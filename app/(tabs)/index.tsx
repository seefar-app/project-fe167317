import { useCallback, useMemo, useState } from 'react';
import { Animated, FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParallaxHeader, { FadeInView, useScrollY } from '@/components/motion/ParallaxHeader';
import PressableScale from '@/components/ui/PressableScale';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import CategoryRow from '@/components/shared/CategoryRow';
import KitchenCard from '@/components/shared/KitchenCard';
import DishCard from '@/components/shared/DishCard';
import TrustChips from '@/components/shared/TrustChips';
import RewardsStrip from '@/components/shared/RewardsStrip';
import LocationPicker from '@/components/shared/LocationPicker';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { HERO_IMAGE } from '@/services/mockData';
import { t } from '@/constants/i18n';

type Filter = 'all' | 'restaurant' | 'home_kitchen';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();
  const language = useStore((s) => s.language);
  const kitchens = useStore((s) => s.kitchens);
  const dishes = useStore((s) => s.dishes);
  const loading = useStore((s) => s.isLoadingCatalog);
  const catalogError = useStore((s) => s.catalogError);
  const loadCatalog = useStore((s) => s.loadCatalog);
  const addToCart = useStore((s) => s.addToCart);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const user = useAuthStore((s) => s.user);

  const [wilaya, setWilaya] = useState(user?.wilaya ?? 'Alger');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [goal, setGoal] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCatalog();
    setRefreshing(false);
  }, [loadCatalog]);

  const q = query.trim().toLowerCase();

  const popularDishes = useMemo(
    () =>
      dishes.filter((d) => {
        const kitchen = kitchens.find((k) => k.id === d.kitchen_id);
        if (filter !== 'all' && kitchen?.type !== filter) return false;
        if (goal && !d.diet_tags.includes(goal)) return false;
        if (q && !(d.name.toLowerCase().includes(q) || d.name_fr.toLowerCase().includes(q))) return false;
        return true;
      }),
    [dishes, kitchens, goal, filter, q]
  );

  const visibleKitchens = useMemo(
    () =>
      kitchens.filter((k) => {
        if (filter !== 'all' && k.type !== filter) return false;
        if (goal) {
          const has = dishes.some((d) => d.kitchen_id === k.id && d.diet_tags.includes(goal));
          if (!has) return false;
        }
        if (q && !(k.display_name.toLowerCase().includes(q) || k.specialties.join(' ').toLowerCase().includes(q))) return false;
        return true;
      }),
    [kitchens, dishes, goal, filter, q]
  );

  const searchTranslate = scrollY.interpolate({ inputRange: [0, 140], outputRange: [0, -8], extrapolate: 'clamp' });

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: t('all', language) },
    { id: 'restaurant', label: t('restaurants', language) },
    { id: 'home_kitchen', label: t('homeKitchens', language) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c2410c" />}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header: location + search + bell */}
        <View className="px-5" style={{ paddingTop: insets.top + 10 }}>
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => setPickerOpen(true)} className="flex-row items-center">
              <Ionicons name="location" size={18} color="#c2410c" />
              <View className="ml-1.5">
                <Text className="text-xs font-medium text-stone-500">{t('deliverTo', language)}</Text>
                <View className="flex-row items-center">
                  <Text className="text-sm font-bold text-stone-900">{wilaya}</Text>
                  <Ionicons name="chevron-down" size={14} color="#78716c" style={{ marginLeft: 3 }} />
                </View>
              </View>
            </Pressable>
            <View className="flex-row items-center gap-2.5">
              <PressableScale onPress={() => router.push('/(tabs)/orders')}>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Ionicons name="notifications-outline" size={20} color="#1c1917" />
                  <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full" style={{ backgroundColor: '#dc2626' }} />
                </View>
              </PressableScale>
              <PressableScale onPress={() => router.push('/(tabs)/profile')}>
                <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
                  <Ionicons name="person" size={18} color="#c2410c" />
                </View>
              </PressableScale>
            </View>
          </View>

          <Animated.View style={{ transform: [{ translateY: searchTranslate }] }}>
            <View
              className="mt-3.5 flex-row items-center rounded-full bg-white px-4 py-3"
              style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
            >
              <Ionicons name="search" size={18} color="#a8a29e" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t('search', language)}
                placeholderTextColor="#a8a29e"
                className="ml-2.5 flex-1 text-sm text-stone-900"
                returnKeyType="search"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#a8a29e" />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>
        </View>

        {/* Photo hero with parallax */}
        <FadeInView delay={80} style={{ marginTop: 16, marginHorizontal: 20 }}>
          <View style={{ borderRadius: 24, overflow: 'hidden' }}>
            <ParallaxHeader scrollY={scrollY} height={216}>
              <ImageBackground source={{ uri: HERO_IMAGE }} style={{ flex: 1 }}>
                <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(28,25,23,0.88)']} style={{ flex: 1, justifyContent: 'flex-end', padding: 18 }}>
                  <Text className="text-3xl font-extrabold uppercase leading-tight text-white">{t('heroTitle', language)}</Text>
                  <Text numberOfLines={1} className="mb-3 mt-1.5 text-xs text-white/80">{t('heroSub', language)}</Text>
                  <View className="flex-row items-center justify-between">
                    <PressableScale onPress={() => { setFilter('home_kitchen'); }}>
                      <View className="rounded-full bg-white px-5 py-2.5">
                        <Text className="text-sm font-bold" style={{ color: '#c2410c' }}>{t('orderNow', language)}</Text>
                      </View>
                    </PressableScale>
                    <View className="flex-row gap-1.5">
                      <View className="h-1.5 w-5 rounded-full bg-white" />
                      <View className="h-1.5 w-1.5 rounded-full bg-white/50" />
                      <View className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </ParallaxHeader>
          </View>
        </FadeInView>

        {/* Goal category row */}
        <FadeInView delay={160} style={{ marginTop: 22 }}>
          <CategoryRow selected={goal} onSelect={setGoal} language={language} />
        </FadeInView>

        {/* Kitchen type toggle */}
        <FadeInView delay={220} style={{ marginTop: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <PressableScale key={f.id} onPress={() => setFilter(f.id)}>
                  <View className="rounded-full px-4 py-2.5" style={{ backgroundColor: active ? '#c2410c' : '#ffffff' }}>
                    <Text className="text-xs font-bold" style={{ color: active ? '#fff' : '#44403c' }}>{f.label}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* Popular dishes rail */}
        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between px-5">
            <Text className="text-lg font-bold text-stone-900">{t('popular', language)}</Text>
            {goal || q ? (
              <PressableScale onPress={() => { setGoal(null); setQuery(''); }}>
                <Text className="text-xs font-bold" style={{ color: '#c2410c' }}>Clear filters</Text>
              </PressableScale>
            ) : null}
          </View>
          {loading ? (
            <View className="flex-row gap-3 px-5">
              {[0, 1].map((i) => (
                <View key={i}>
                  <Skeleton width={200} height={128} radius={20} />
                  <Skeleton width={150} height={14} style={{ marginTop: 10 }} />
                  <Skeleton width={90} height={14} style={{ marginTop: 8 }} />
                </View>
              ))}
            </View>
          ) : catalogError ? (
            <EmptyState icon="cloud-offline-outline" title="Couldn’t load dishes" description={catalogError} actionLabel="Try again" onAction={loadCatalog} />
          ) : popularDishes.length === 0 ? (
            <EmptyState icon="restaurant-outline" title="No dishes match" description="Try another goal or clear the search to see more healthy meals." />
          ) : (
            <FlatList
              data={popularDishes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(d) => d.id}
              snapToInterval={212}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              renderItem={({ item }) => (
                <DishCard
                  dish={item}
                  kitchenName={kitchens.find((k) => k.id === item.kitchen_id)?.display_name}
                  onPress={() => router.push({ pathname: '/kitchen/[id]', params: { id: item.kitchen_id, dish: item.id } })}
                  onAdd={() => addToCart(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Rewards / trust */}
        <View className="mt-7 px-5">
          <RewardsStrip onPress={() => router.push('/(tabs)/cart')} />
        </View>
        <View className="mt-5">
          <TrustChips />
        </View>

        {/* Kitchens */}
        <View className="mt-7 px-5">
          <Text className="mb-3 text-lg font-bold text-stone-900">{t('kitchensNear', language)}</Text>
          {loading ? (
            [0, 1].map((i) => (
              <View key={i} className="mb-4 overflow-hidden rounded-[20px] bg-white">
                <Skeleton height={168} radius={0} />
                <View className="p-4">
                  <Skeleton width="60%" height={18} />
                  <Skeleton width="40%" height={12} style={{ marginTop: 10 }} />
                </View>
              </View>
            ))
          ) : visibleKitchens.length === 0 ? (
            <EmptyState icon="storefront-outline" title="No kitchens found" description="No kitchens match these filters in your area yet." actionLabel="Reset filters" onAction={() => { setGoal(null); setFilter('all'); setQuery(''); }} />
          ) : (
            visibleKitchens.map((k, i) => (
              <FadeInView key={k.id} delay={Math.min(i * 70, 280)}>
                <KitchenCard
                  kitchen={k}
                  isFavorite={favorites.includes(k.id)}
                  onToggleFavorite={() => toggleFavorite(k.id)}
                  onPress={() => router.push({ pathname: '/kitchen/[id]', params: { id: k.id } })}
                />
              </FadeInView>
            ))
          )}
        </View>

        <View className="mt-2 px-5">
          <Button title="Become a partner kitchen" variant="outline" icon="restaurant-outline" onPress={() => router.push('/(tabs)/profile')} />
        </View>
      </Animated.ScrollView>

      <LocationPicker visible={pickerOpen} onClose={() => setPickerOpen(false)} current={wilaya} onSelect={setWilaya} />
    </View>
  );
}