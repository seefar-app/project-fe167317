import { useMemo, useState } from 'react';
import { Alert, LayoutAnimation, ScrollView, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PressableScale from '@/components/ui/PressableScale';
import { FadeInView } from '@/components/motion/ParallaxHeader';
import { DELIVERY_SLOTS } from '@/services/mockData';
import { dz, useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { PaymentMethod } from '@/types';

const PAYMENTS: { id: PaymentMethod; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'cod', label: 'Cash on delivery', sub: 'Pay the courier at your door', icon: 'cash-outline' },
  { id: 'card', label: 'CIB / Edahabia card', sub: 'Secure card payment', icon: 'card-outline' },
  { id: 'baridimob', label: 'BaridiMob', sub: 'Pay with your Baridi account', icon: 'phone-portrait-outline' },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const dishes = useStore((s) => s.dishes);
  const kitchens = useStore((s) => s.kitchens);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const promoCode = useStore((s) => s.promoCode);
  const promoRate = useStore((s) => s.promoRate);
  const applyPromo = useStore((s) => s.applyPromo);
  const placeOrder = useStore((s) => s.placeOrder);
  const placing = useStore((s) => s.placing);
  const addresses = useStore((s) => s.addresses);
  const selectedAddressId = useStore((s) => s.selectedAddressId);
  const user = useAuthStore((s) => s.user);

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [applying, setApplying] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [slot, setSlot] = useState(DELIVERY_SLOTS[0]);

  const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const groups = useMemo(() => {
    const map = new Map<string, typeof cart>();
    cart.forEach((c) => map.set(c.kitchen_id, [...(map.get(c.kitchen_id) ?? []), c]));
    return Array.from(map.entries()).map(([kitchenId, items]) => ({ kitchen: kitchens.find((k) => k.id === kitchenId), items }));
  }, [cart, kitchens]);

  const unitPrice = (dishId: string, cids: string[]) => {
    const d = dishes.find((x) => x.id === dishId);
    if (!d) return 0;
    return d.price_dzd + d.customizations.filter((c) => cids.includes(c.id)).reduce((s, c) => s + c.extra_price_dzd, 0);
  };

  const subtotal = cart.reduce((s, c) => s + unitPrice(c.dish_id, c.customization_ids) * c.quantity, 0);
  const fee = groups.reduce((s, g) => s + (g.kitchen?.delivery_fee_dzd ?? 0), 0);
  const discount = Math.round(subtotal * promoRate);
  const total = subtotal + fee - discount;

  const changeQty = (id: string, delta: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateQuantity(id, delta);
  };

  const onApply = async () => {
    if (!promoInput.trim()) {
      setPromoMsg({ ok: false, text: 'Enter a promo code first.' });
      return;
    }
    setApplying(true);
    const ok = await applyPromo(promoInput);
    setApplying(false);
    setPromoMsg(ok ? { ok: true, text: 'Promo applied!' } : { ok: false, text: 'This code is not valid. Try SAHA10.' });
  };

  const onCheckout = async () => {
    const order = await placeOrder(payment, slot, user?.id ?? 'guest');
    if (!order) {
      Alert.alert('Order failed', 'We could not place your order. Please try again.');
      return;
    }
    router.push({ pathname: '/order/[id]', params: { id: order.id } });
  };

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f7f1e8', paddingTop: insets.top + 12 }}>
        <Text className="px-5 text-3xl font-extrabold uppercase text-stone-900">Your cart</Text>
        <EmptyState icon="cart-outline" title="Your cart is empty" description="Add healthy dishes from verified kitchens and they’ll show up here." actionLabel="Browse kitchens" onAction={() => router.push('/(tabs)')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 150 }}>
        <Text className="mb-4 text-3xl font-extrabold uppercase text-stone-900">Your cart</Text>

        {groups.map((g, gi) => (
          <FadeInView key={g.kitchen?.id ?? gi} delay={gi * 80}>
            <Card className="mb-4 p-4">
              <View className="mb-3 flex-row items-center">
                <Image source={{ uri: g.kitchen?.owner_avatar }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <Text className="ml-2.5 flex-1 text-sm font-bold text-stone-900">{g.kitchen?.display_name}</Text>
                <Text className="text-xs text-stone-500">{g.kitchen ? dz(g.kitchen.delivery_fee_dzd) : ''} delivery</Text>
              </View>
              {g.items.map((it) => {
                const d = dishes.find((x) => x.id === it.dish_id);
                if (!d) return null;
                const extras = d.customizations.filter((c) => it.customization_ids.includes(c.id)).map((c) => c.label);
                return (
                  <View key={it.id} className="mb-3 flex-row items-center">
                    <Image source={{ uri: d.photos[0] }} style={{ width: 62, height: 62, borderRadius: 14 }} contentFit="cover" />
                    <View className="ml-3 flex-1">
                      <Text numberOfLines={1} className="text-sm font-bold text-stone-900">{d.name}</Text>
                      {extras.length ? <Text numberOfLines={1} className="text-xs text-stone-500">{extras.join(', ')}</Text> : null}
                      <Text className="mt-1 text-sm font-extrabold text-stone-900">{dz(unitPrice(it.dish_id, it.customization_ids))}</Text>
                    </View>
                    <View className="flex-row items-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
                      <PressableScale onPress={() => changeQty(it.id, -1)}>
                        <View className="h-8 w-8 items-center justify-center">
                          <Ionicons name={it.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color="#c2410c" />
                        </View>
                      </PressableScale>
                      <Text className="w-5 text-center text-sm font-bold text-stone-900">{it.quantity}</Text>
                      <PressableScale onPress={() => changeQty(it.id, 1)}>
                        <View className="h-8 w-8 items-center justify-center">
                          <Ionicons name="add" size={16} color="#c2410c" />
                        </View>
                      </PressableScale>
                    </View>
                  </View>
                );
              })}
            </Card>
          </FadeInView>
        ))}

        {/* Address */}
        <Card className="mb-4 p-4">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
              <Ionicons name="location" size={18} color="#c2410c" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium text-stone-500">Deliver to · {address.label}</Text>
              <Text numberOfLines={1} className="text-sm font-bold text-stone-900">{address.street}</Text>
              <Text className="text-xs text-stone-500">{address.commune}, {address.wilaya} · {address.landmark_note}</Text>
            </View>
          </View>
        </Card>

        {/* Slot */}
        <Text className="mb-2 text-lg font-bold text-stone-900">Delivery time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
          {DELIVERY_SLOTS.map((s) => {
            const active = slot === s;
            return (
              <PressableScale key={s} onPress={() => setSlot(s)}>
                <View className="rounded-full px-4 py-2.5" style={{ backgroundColor: active ? '#c2410c' : '#ffffff' }}>
                  <Text className="text-xs font-bold" style={{ color: active ? '#fff' : '#44403c' }}>{s}</Text>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* Payment */}
        <Text className="mb-2 text-lg font-bold text-stone-900">Payment</Text>
        {PAYMENTS.map((p) => {
          const active = payment === p.id;
          return (
            <PressableScale key={p.id} onPress={() => setPayment(p.id)}>
              <View className="mb-2 flex-row items-center rounded-[20px] bg-white p-4" style={{ borderWidth: 2, borderColor: active ? '#c2410c' : 'transparent' }}>
                <Ionicons name={p.icon} size={22} color={active ? '#c2410c' : '#78716c'} />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-bold text-stone-900">{p.label}</Text>
                  <Text className="text-xs text-stone-500">{p.sub}</Text>
                </View>
                <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? '#c2410c' : '#d6d3d1'} />
              </View>
            </PressableScale>
          );
        })}

        {/* Promo */}
        <Text className="mb-2 mt-4 text-lg font-bold text-stone-900">Promo code</Text>
        <View className="flex-row items-center">
          <View className="mr-2 flex-1 flex-row items-center rounded-full bg-white px-4">
            <Ionicons name="pricetag-outline" size={16} color="#a8a29e" />
            <TextInput
              value={promoInput}
              onChangeText={(v) => { setPromoInput(v); setPromoMsg(null); }}
              placeholder={promoCode ?? 'SAHA10'}
              placeholderTextColor="#a8a29e"
              autoCapitalize="characters"
              className="ml-2 flex-1 py-3 text-sm text-stone-900"
            />
          </View>
          <Button title="Apply" size="sm" fullWidth={false} loading={applying} onPress={onApply} />
        </View>
        {promoMsg ? <Text className="ml-2 mt-1.5 text-xs font-medium" style={{ color: promoMsg.ok ? '#15803d' : '#b91c1c' }}>{promoMsg.text}</Text> : null}

        {/* Breakdown */}
        <Card className="mt-5 p-4">
          <Row label="Subtotal" value={dz(subtotal)} />
          <Row label="Delivery" value={dz(fee)} />
          {discount > 0 ? <Row label={`Promo ${promoCode}`} value={`− ${dz(discount)}`} green /> : null}
          <View className="my-2 h-px bg-stone-200" />
          <Row label="Total" value={dz(total)} bold />
        </Card>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-5 pt-3" style={{ paddingBottom: 14 }}>
        <Button title={`Place order · ${dz(total)}`} size="lg" loading={placing} onPress={onCheckout} icon="checkmark-circle-outline" />
      </View>
    </View>
  );
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className={bold ? 'text-base font-bold text-stone-900' : 'text-sm text-stone-600'}>{label}</Text>
      <Text className={bold ? 'text-xl font-extrabold text-stone-900' : 'text-sm font-semibold'} style={{ color: green ? '#15803d' : bold ? '#1c1917' : '#1c1917', fontVariant: ['tabular-nums'] }}>{value}</Text>
    </View>
  );
}