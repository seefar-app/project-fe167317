import { useEffect, useMemo, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParallaxHeader, { FadeInView, useScrollY } from '@/components/motion/ParallaxHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import BottomSheet from '@/components/ui/BottomSheet';
import EmptyState from '@/components/ui/EmptyState';
import PressableScale from '@/components/ui/PressableScale';
import PriceAddButton from '@/components/shared/PriceAddButton';
import NutritionPanel from '@/components/shared/NutritionPanel';
import { dz, useStore } from '@/store/useStore';
import type { Dish } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function KitchenDetail() {
  const { id, dish: dishParam } = useLocalSearchParams<{ id: string; dish?: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();
  const kitchen = useStore((s) => s.kitchens.find((k) => k.id === id));
  const dishes = useStore((s) => s.dishes);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const addToCart = useStore((s) => s.addToCart);
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.quantity, 0));

  const [selected, setSelected] = useState<Dish | null>(null);
  const [customIds, setCustomIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [day, setDay] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const menu = useMemo(() => dishes.filter((d) => d.kitchen_id === id), [dishes, id]);
  const weekly = menu.filter((d) => d.weekday !== null);
  const shown = day === null ? menu : menu.filter((d) => d.weekday === day || d.weekday === null);

  useEffect(() => {
    if (dishParam) {
      const d = dishes.find((x) => x.id === dishParam);
      if (d) openDish(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishParam, dishes.length]);

  const openDish = (d: Dish) => {
    setSelected(d);
    setCustomIds([]);
    setQty(1);
    setAdded(false);
  };

  if (!kitchen) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f7f1e8', paddingTop: insets.top }}>
        <EmptyState icon="storefront-outline" title="Kitchen not found" description="This kitchen may have been removed." actionLabel="Go back" onAction={() => router.back()} />
      </View>
    );
  }

  const isFav = favorites.includes(kitchen.id);
  const extra = selected ? selected.customizations.filter((c) => customIds.includes(c.id)).reduce((s, c) => s + c.extra_price_dzd, 0) : 0;
  const lineTotal = selected ? (selected.price_dzd + extra) * qty : 0;

  const confirmAdd = async () => {
    if (!selected) return;
    const ok = await addToCart(selected.id, customIds, qty);
    if (ok) {
      setAdded(true);
      setTimeout(() => setSelected(null), 650);
    }
  };

  const headerOpacity = scrollY.interpolate({ inputRange: [120, 200], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ParallaxHeader scrollY={scrollY} height={290}>
          <Image source={{ uri: kitchen.cover_photo }} style={{ flex: 1 }} contentFit="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.45)']} style={{ position: 'absolute', inset: 0 } as object} />
        </ParallaxHeader>

        <View className="-mt-6 rounded-t-[28px] px-5 pt-6" style={{ backgroundColor: '#f7f1e8' }}>
          <FadeInView>
            <View className="mb-2 flex-row flex-wrap gap-2">
              <Badge label={kitchen.type === 'home_kitchen' ? 'Cuisine maison' : 'Restaurant'} tone="brand" icon={kitchen.type === 'home_kitchen' ? 'home' : 'restaurant'} />
              {kitchen.is_verified ? <Badge label="ID & hygiene verified" tone="green" icon="shield-checkmark" /> : null}
              <Badge label="Halal" tone="neutral" icon="moon" />
            </View>
            <Text className="text-3xl font-extrabold uppercase leading-tight text-stone-900">{kitchen.display_name}</Text>
            <View className="mt-2 flex-row items-center">
              <Ionicons name="star" size={15} color="#d97706" />
              <Text className="ml-1 text-sm font-bold text-stone-900">{kitchen.rating.toFixed(1)}</Text>
              <Text className="ml-1 text-sm text-stone-500">({kitchen.review_count} reviews)</Text>
              <Text className="mx-2 text-stone-300">·</Text>
              <Text className="text-sm text-stone-500">{kitchen.commune}, {kitchen.wilaya}</Text>
            </View>

            <View className="mt-4 flex-row rounded-[20px] bg-white p-4">
              <Stat icon="time-outline" label={`${kitchen.avg_prep_minutes} min`} sub="Prep time" />
              <Stat icon="bicycle-outline" label={dz(kitchen.delivery_fee_dzd)} sub="Delivery" />
              <Stat icon="calendar-outline" label={kitchen.opening_hours} sub="Hours" />
            </View>

            <Text className="mb-1 mt-5 text-lg font-bold text-stone-900">Our story</Text>
            <Text className="text-sm leading-5 text-stone-600">{kitchen.story_text}</Text>

            {!kitchen.is_accepting_orders ? (
              <View className="mt-4 flex-row items-center rounded-2xl bg-amber-50 p-3">
                <Ionicons name="pause-circle" size={20} color="#b45309" />
                <Text className="ml-2 flex-1 text-xs font-medium text-amber-800">This kitchen is on a break and not accepting orders right now.</Text>
              </View>
            ) : null}
          </FadeInView>

          {weekly.length > 0 ? (
            <View className="mt-6">
              <Text className="mb-2 text-lg font-bold text-stone-900">Weekly menu</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <PressableScale onPress={() => setDay(null)}>
                  <View className="rounded-full px-4 py-2.5" style={{ backgroundColor: day === null ? '#c2410c' : '#fff' }}>
                    <Text className="text-xs font-bold" style={{ color: day === null ? '#fff' : '#44403c' }}>Full menu</Text>
                  </View>
                </PressableScale>
                {DAYS.map((d, i) => {
                  const has = menu.some((m) => m.weekday === i);
                  if (!has) return null;
                  const on = day === i;
                  return (
                    <PressableScale key={d} onPress={() => setDay(i)}>
                      <View className="rounded-full px-4 py-2.5" style={{ backgroundColor: on ? '#c2410c' : '#fff' }}>
                        <Text className="text-xs font-bold" style={{ color: on ? '#fff' : '#44403c' }}>{d}</Text>
                      </View>
                    </PressableScale>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Text className="mb-3 mt-6 text-lg font-bold text-stone-900">Menu</Text>
          {shown.length === 0 ? (
            <EmptyState icon="restaurant-outline" title="Nothing on the menu" description="This kitchen hasn’t published dishes for that day yet." />
          ) : (
            shown.map((d, i) => (
              <FadeInView key={d.id} delay={Math.min(i * 60, 240)}>
                <PressableScale onPress={() => openDish(d)}>
                  <View className="mb-3 flex-row rounded-[20px] bg-white p-3" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
                    <Image source={{ uri: d.photos[0] }} style={{ width: 92, height: 92, borderRadius: 16 }} contentFit="cover" />
                    <View className="ml-3 flex-1 justify-between">
                      <View>
                        <Text numberOfLines={1} className="text-sm font-bold text-stone-900">{d.name}</Text>
                        <Text numberOfLines={2} className="mt-0.5 text-xs text-stone-500">{d.description}</Text>
                        <View className="mt-1.5 flex-row flex-wrap gap-1">
                          <Badge label={`${d.nutrition.kcal} kcal`} tone="brand" icon="flame" />
                          <Badge label={`${d.nutrition.protein_g}g protein`} tone="neutral" />
                        </View>
                      </View>
                      <View className="mt-2">
                        <PriceAddButton price={d.price_dzd} disabled={!d.is_available || !kitchen.is_accepting_orders} onAdd={() => openDish(d)} />
                      </View>
                    </View>
                  </View>
                </PressableScale>
              </FadeInView>
            ))
          )}
        </View>
      </Animated.ScrollView>

      {/* Floating controls */}
      <View className="absolute left-0 right-0 flex-row items-center justify-between px-5" style={{ top: insets.top + 8 }}>
        <PressableScale onPress={() => router.back()}>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons name="arrow-back" size={20} color="#1c1917" />
          </View>
        </PressableScale>
        <PressableScale onPress={() => toggleFavorite(kitchen.id)}>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#dc2626' : '#1c1917'} />
          </View>
        </PressableScale>
      </View>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 56, backgroundColor: '#f7f1e8', opacity: headerOpacity }} />

      {/* Sticky cart bar */}
      {cartCount > 0 ? (
        <View className="absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 10 }}>
          <Button title={`View cart · ${cartCount} item${cartCount > 1 ? 's' : ''}`} icon="cart" onPress={() => router.push('/(tabs)/cart')} />
        </View>
      ) : null}

      {/* Dish sheet */}
      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} maxHeightRatio={0.92}>
        {selected ? (
          <View>
            <Image source={{ uri: selected.photos[0] }} style={{ width: '100%', height: 180, borderRadius: 20 }} contentFit="cover" />
            <View className="mt-3 flex-row flex-wrap gap-1.5">
              {selected.is_halal ? <Badge label="Halal" tone="green" icon="moon" /> : null}
              {selected.diet_tags.map((tg) => <Badge key={tg} label={tg.replace('-', ' ')} tone="brand" />)}
            </View>
            <Text className="mt-2 text-2xl font-extrabold text-stone-900">{selected.name}</Text>
            <Text className="mt-1 text-sm leading-5 text-stone-600">{selected.description}</Text>
            <Text className="mt-1 text-xs text-stone-400">{selected.portion_grams} g portion</Text>

            <Text className="mb-2 mt-4 text-base font-bold text-stone-900">Nutrition</Text>
            <NutritionPanel n={selected.nutrition} />

            <Text className="mb-1.5 mt-4 text-base font-bold text-stone-900">Ingredients</Text>
            <Text className="text-sm text-stone-600">{selected.ingredients.join(' · ')}</Text>
            {selected.allergens.length > 0 ? (
              <View className="mt-2 flex-row items-center">
                <Ionicons name="alert-circle" size={15} color="#b45309" />
                <Text className="ml-1.5 text-xs font-medium text-amber-700">Contains: {selected.allergens.join(', ')}</Text>
              </View>
            ) : null}

            {selected.customizations.length > 0 ? (
              <>
                <Text className="mb-2 mt-4 text-base font-bold text-stone-900">Customize</Text>
                {selected.customizations.map((c) => {
                  const on = customIds.includes(c.id);
                  return (
                    <PressableScale key={c.id} onPress={() => setCustomIds((p) => (on ? p.filter((x) => x !== c.id) : [...p, c.id]))}>
                      <View className="mb-2 flex-row items-center rounded-2xl bg-white p-3.5" style={{ borderWidth: 2, borderColor: on ? '#c2410c' : 'transparent' }}>
                        <Ionicons name={on ? 'checkbox' : 'square-outline'} size={20} color={on ? '#c2410c' : '#d6d3d1'} />
                        <Text className="ml-3 flex-1 text-sm font-medium text-stone-900">{c.label}</Text>
                        <Text className="text-xs font-semibold text-stone-500">{c.extra_price_dzd > 0 ? `+${dz(c.extra_price_dzd)}` : 'Free'}</Text>
                      </View>
                    </PressableScale>
                  );
                })}
              </>
            ) : null}

            <View className="mt-4 flex-row items-center">
              <View className="mr-3 flex-row items-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
                <PressableScale onPress={() => setQty((q) => Math.max(1, q - 1))}>
                  <View className="h-11 w-11 items-center justify-center"><Ionicons name="remove" size={20} color="#c2410c" /></View>
                </PressableScale>
                <Text className="w-7 text-center text-base font-bold text-stone-900">{qty}</Text>
                <PressableScale onPress={() => setQty((q) => q + 1)}>
                  <View className="h-11 w-11 items-center justify-center"><Ionicons name="add" size={20} color="#c2410c" /></View>
                </PressableScale>
              </View>
              <View className="flex-1">
                <Button
                  title={added ? 'Added ✓' : `Add · ${dz(lineTotal)}`}
                  size="lg"
                  disabled={!selected.is_available || !kitchen.is_accepting_orders}
                  onPress={confirmAdd}
                />
              </View>
            </View>
            {!kitchen.is_accepting_orders ? <Text className="mt-2 text-center text-xs text-amber-700">This kitchen isn’t accepting orders right now.</Text> : null}
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}

function Stat({ icon, label, sub }: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string }) {
  return (
    <View className="flex-1 items-center">
      <Ionicons name={icon} size={20} color="#c2410c" />
      <Text numberOfLines={1} className="mt-1 text-xs font-bold text-stone-900">{label}</Text>
      <Text className="text-[11px] text-stone-500">{sub}</Text>
    </View>
  );
}