import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { Address, CartItem, Dish, Kitchen, Language, Order, OrderStatus, PaymentMethod } from '@/types';
import { DEFAULT_ADDRESS, DISHES, KITCHENS, PROMOS, SEED_ORDERS } from '@/services/mockData';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LANG_KEY = 'sk_lang';
const FAV_KEY = 'sk_favs';

const FLOW: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];

interface StoreState {
  language: Language;
  kitchens: Kitchen[];
  dishes: Dish[];
  isLoadingCatalog: boolean;
  catalogError: string | null;
  cart: CartItem[];
  promoCode: string | null;
  promoRate: number;
  orders: Order[];
  addresses: Address[];
  selectedAddressId: string;
  favorites: string[];
  placing: boolean;
  simTimer: ReturnType<typeof setInterval> | null;

  loadLanguage: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  loadCatalog: () => Promise<void>;
  addToCart: (dishId: string, customization_ids?: string[], quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, delta: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromo: (code: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  placeOrder: (payment: PaymentMethod, slot: string, userId: string) => Promise<Order | null>;
  reorder: (orderId: string) => Promise<void>;
  startSimulation: () => void;
  stopSimulation: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  language: 'fr',
  kitchens: [],
  dishes: [],
  isLoadingCatalog: true,
  catalogError: null,
  cart: [],
  promoCode: null,
  promoRate: 0,
  orders: SEED_ORDERS,
  addresses: [DEFAULT_ADDRESS],
  selectedAddressId: DEFAULT_ADDRESS.id,
  favorites: [],
  placing: false,
  simTimer: null,

  loadLanguage: async () => {
    try {
      const l = await AsyncStorage.getItem(LANG_KEY);
      const f = await AsyncStorage.getItem(FAV_KEY);
      if (l === 'ar' || l === 'fr' || l === 'en') set({ language: l });
      if (f) set({ favorites: JSON.parse(f) as string[] });
    } catch (e) {
      // keep defaults
    }
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    try {
      await AsyncStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      // non-fatal
    }
  },

  loadCatalog: async () => {
    set({ isLoadingCatalog: true, catalogError: null });
    try {
      await wait(700);
      set({ kitchens: KITCHENS, dishes: DISHES });
    } catch (e) {
      set({ catalogError: 'Could not load kitchens. Pull to retry.' });
    } finally {
      set({ isLoadingCatalog: false });
    }
  },

  addToCart: async (dishId, customization_ids = [], quantity = 1) => {
    try {
      const dish = get().dishes.find((d) => d.id === dishId);
      if (!dish || !dish.is_available) return false;
      const existing = get().cart.find(
        (c) => c.dish_id === dishId && [...c.customization_ids].sort().join() === [...customization_ids].sort().join()
      );
      if (existing) {
        set({ cart: get().cart.map((c) => (c.id === existing.id ? { ...c, quantity: c.quantity + quantity } : c)) });
      } else {
        set({
          cart: [
            ...get().cart,
            { id: Crypto.randomUUID(), dish_id: dishId, kitchen_id: dish.kitchen_id, quantity, customization_ids },
          ],
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  updateQuantity: async (itemId, delta) => {
    try {
      const next = get()
        .cart.map((c) => (c.id === itemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0);
      set({ cart: next });
    } catch (e) {
      // ignore
    }
  },

  removeFromCart: async (itemId) => {
    set({ cart: get().cart.filter((c) => c.id !== itemId) });
  },

  clearCart: async () => set({ cart: [], promoCode: null, promoRate: 0 }),

  applyPromo: async (code) => {
    try {
      await wait(400);
      const rate = PROMOS[code.trim().toUpperCase()];
      if (!rate) return false;
      set({ promoCode: code.trim().toUpperCase(), promoRate: rate });
      return true;
    } catch (e) {
      return false;
    }
  },

  toggleFavorite: async (id) => {
    const favs = get().favorites;
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    set({ favorites: next });
    try {
      await AsyncStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch (e) {
      // non-fatal
    }
  },

  placeOrder: async (payment, slot, userId) => {
    set({ placing: true });
    try {
      await wait(900);
      const { cart, dishes, kitchens, promoRate, selectedAddressId, addresses } = get();
      if (cart.length === 0) return null;
      let subtotal = 0;
      const items: Order['items'] = [];
      cart.forEach((c) => {
        const d = dishes.find((x) => x.id === c.dish_id);
        if (!d) return;
        const extras = d.customizations.filter((x) => c.customization_ids.includes(x.id)).reduce((s, x) => s + x.extra_price_dzd, 0);
        const unit = d.price_dzd + extras;
        subtotal += unit * c.quantity;
        items.push({ dish_id: d.id, name: d.name, quantity: c.quantity, unit_price_dzd: unit });
      });
      const kitchenIds = Array.from(new Set(cart.map((c) => c.kitchen_id)));
      const kitchenObjs = kitchenIds.map((id) => kitchens.find((k) => k.id === id)).filter(Boolean) as Kitchen[];
      const fee = kitchenObjs.reduce((s, k) => s + k.delivery_fee_dzd, 0);
      const discount = Math.round(subtotal * promoRate);
      const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
      const order: Order = {
        id: Crypto.randomUUID(),
        customer_id: userId,
        kitchen_ids: kitchenIds,
        kitchen_name: kitchenObjs.map((k) => k.display_name).join(' + '),
        kitchen_photo: kitchenObjs[0]?.cover_photo ?? '',
        address_id: address.id,
        address_label: address.label,
        status: 'placed',
        scheduled_for: slot.startsWith('ASAP') ? null : slot,
        payment_method: payment,
        payment_status: payment === 'cod' ? 'pending' : 'paid',
        subtotal_dzd: subtotal,
        delivery_fee_dzd: fee,
        discount_dzd: discount,
        total_dzd: subtotal + fee - discount,
        courier_id: 'c1',
        item_summary: items.map((i) => `${i.quantity}× ${i.name}`).join(', '),
        items,
        created_at: new Date().toISOString(),
        estimated_arrival_at: new Date(Date.now() + 40 * 60000).toISOString(),
      };
      set({ orders: [order, ...get().orders], cart: [], promoCode: null, promoRate: 0 });
      get().startSimulation();
      return order;
    } catch (e) {
      return null;
    } finally {
      set({ placing: false });
    }
  },

  reorder: async (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;
    for (const it of order.items) {
      await get().addToCart(it.dish_id, [], it.quantity);
    }
  },

  startSimulation: () => {
    if (get().simTimer) return;
    const timer = setInterval(() => {
      const orders = get().orders.map((o) => {
        if (o.status === 'delivered' || o.status === 'cancelled' || o.status === 'refunded') return o;
        const idx = FLOW.indexOf(o.status);
        if (idx < 0 || idx >= FLOW.length - 1) return o;
        return { ...o, status: FLOW[idx + 1], payment_status: FLOW[idx + 1] === 'delivered' ? ('paid' as const) : o.payment_status };
      });
      set({ orders });
      const stillActive = orders.some((o) => !['delivered', 'cancelled', 'refunded'].includes(o.status));
      if (!stillActive) get().stopSimulation();
    }, 12000);
    set({ simTimer: timer });
  },

  stopSimulation: () => {
    const t = get().simTimer;
    if (t) clearInterval(t);
    set({ simTimer: null });
  },
}));

export const STATUS_FLOW = FLOW;
export const isActiveStatus = (s: OrderStatus) => !['delivered', 'cancelled', 'refunded'].includes(s);
export const dz = (n: number) => `${n.toLocaleString('fr-DZ').replace(/\u202f|\u00a0/g, ' ')} DA`;