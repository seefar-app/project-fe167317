import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Linking, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import PressableScale from '@/components/ui/PressableScale';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { COURIER, DEFAULT_ADDRESS, KITCHENS } from '@/services/mockData';
import { dz, isActiveStatus, STATUS_FLOW, useStore } from '@/store/useStore';
import type { OrderStatus } from '@/types';

const STEPS: { status: OrderStatus; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { status: 'placed', label: 'Order placed', sub: 'We sent your order to the kitchen', icon: 'receipt-outline' },
  { status: 'confirmed', label: 'Confirmed', sub: 'The kitchen accepted your order', icon: 'checkmark-circle-outline' },
  { status: 'preparing', label: 'Preparing', sub: 'Your meal is being cooked fresh', icon: 'restaurant-outline' },
  { status: 'ready_for_pickup', label: 'Ready for pickup', sub: 'Courier is collecting your meal', icon: 'bag-check-outline' },
  { status: 'out_for_delivery', label: 'On the way', sub: 'Your courier is heading to you', icon: 'bicycle-outline' },
  { status: 'delivered', label: 'Delivered', sub: 'Enjoy your healthy meal!', icon: 'happy-outline' },
];

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const addresses = useStore((s) => s.addresses);
  const kitchens = useStore((s) => s.kitchens);

  const kitchen = useMemo(() => kitchens.find((k) => order && k.id === order.kitchen_ids[0]) ?? KITCHENS[0], [kitchens, order]);
  const dropoff = addresses.find((a) => order && a.id === order.address_id) ?? DEFAULT_ADDRESS;

  const [progress, setProgress] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;

  const stepIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;

  // Courier position interpolates between kitchen and dropoff based on status
  useEffect(() => {
    if (!order) return;
    const target =
      order.status === 'out_for_delivery' ? 0.55
      : order.status === 'delivered' ? 1
      : order.status === 'ready_for_pickup' ? 0.1
      : 0;
    setProgress(target);
  }, [order?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (order?.status !== 'out_for_delivery') return;
    const timer = setInterval(() => setProgress((p) => Math.min(0.95, p + 0.04)), 2500);
    return () => clearInterval(timer);
  }, [order?.status]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f7f1e8', paddingTop: insets.top }}>
        <EmptyState icon="receipt-outline" title="Order not found" description="We couldn’t find that order." actionLabel="Back to orders" onAction={() => router.replace('/(tabs)/orders')} />
      </View>
    );
  }

  const courierLat = kitchen.lat + (dropoff.lat - kitchen.lat) * progress;
  const courierLng = kitchen.lng + (dropoff.lng - kitchen.lng) * progress;
  const remainingMin = Math.max(1, Math.round((1 - progress) * 18) + (stepIndex < 4 ? (4 - stepIndex) * 6 : 0));
  const active = isActiveStatus(order.status);

  const region = {
    latitude: (kitchen.lat + dropoff.lat) / 2,
    longitude: (kitchen.lng + dropoff.lng) / 2,
    latitudeDelta: Math.max(Math.abs(kitchen.lat - dropoff.lat) * 2.4, 0.04),
    longitudeDelta: Math.max(Math.abs(kitchen.lng - dropoff.lng) * 2.4, 0.04),
  };

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <View style={{ height: 320 }}>
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation={false} toolbarEnabled={false}>
          <Polyline coordinates={[{ latitude: kitchen.lat, longitude: kitchen.lng }, { latitude: dropoff.lat, longitude: dropoff.lng }]} strokeColor="#c2410c" strokeWidth={4} lineDashPattern={[8, 8]} />
          <Marker coordinate={{ latitude: kitchen.lat, longitude: kitchen.lng }} title={kitchen.display_name}>
            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#c2410c', borderWidth: 3, borderColor: '#fff' }}>
              <Ionicons name="restaurant" size={18} color="#fff" />
            </View>
          </Marker>
          <Marker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} title="Your address">
            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#1c1917', borderWidth: 3, borderColor: '#fff' }}>
              <Ionicons name="home" size={18} color="#fff" />
            </View>
          </Marker>
          {active && stepIndex >= 3 ? (
            <Marker coordinate={{ latitude: courierLat, longitude: courierLng }} title={COURIER.name} anchor={{ x: 0.5, y: 0.5 }}>
              <View className="items-center justify-center">
                <Animated.View style={{ position: 'absolute', width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(194,65,12,0.25)', transform: [{ scale: ringScale }] }} />
                <View className="h-9 w-9 items-center justify-center rounded-full bg-white" style={{ borderWidth: 3, borderColor: '#c2410c' }}>
                  <Ionicons name="bicycle" size={17} color="#c2410c" />
                </View>
              </View>
            </Marker>
          ) : null}
        </MapView>

        <View className="absolute left-5" style={{ top: insets.top + 8 }}>
          <PressableScale onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/orders')}>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white" style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 }}>
              <Ionicons name="arrow-back" size={20} color="#1c1917" />
            </View>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: -26, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#f7f1e8' }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: insets.bottom + 30 }}
      >
        {/* ETA */}
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-xs font-medium uppercase tracking-widest text-stone-500">{active ? 'Arriving in' : 'Status'}</Text>
            <Text className="text-4xl font-extrabold text-stone-900" style={{ fontVariant: ['tabular-nums'] }}>
              {active ? `${remainingMin} min` : order.status === 'delivered' ? 'Delivered' : order.status}
            </Text>
          </View>
          {active ? (
            <View className="flex-row items-center rounded-full bg-white px-3 py-2">
              <StatusIndicator color="#16a34a" size={8} />
              <Text className="ml-1 text-xs font-bold text-stone-900">Live</Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-1 text-xs text-stone-500">
          {order.scheduled_for ? `Scheduled · ${order.scheduled_for}` : `Estimated by ${format(new Date(order.estimated_arrival_at), 'HH:mm')}`}
        </Text>

        {/* Courier */}
        {stepIndex >= 3 ? (
          <Card className="mt-5 flex-row items-center p-4">
            <Image source={{ uri: COURIER.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-stone-900">{COURIER.name}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#d97706" />
                <Text className="ml-1 text-xs text-stone-500">{COURIER.rating} · Motorbike</Text>
              </View>
            </View>
            <PressableScale onPress={() => Linking.openURL(`tel:${COURIER.phone.replace(/\s/g, '')}`).catch(() => Alert.alert('Cannot place call', COURIER.phone))}>
              <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: '#c2410c' }}>
                <Ionicons name="call" size={19} color="#fff" />
              </View>
            </PressableScale>
          </Card>
        ) : null}

        {/* Timeline */}
        <Text className="mb-3 mt-6 text-lg font-bold text-stone-900">Order progress</Text>
        <View>
          {STEPS.map((s, i) => {
            const done = i <= stepIndex;
            const current = i === stepIndex;
            return (
              <View key={s.status} className="flex-row">
                <View className="items-center" style={{ width: 36 }}>
                  <View
                    className="h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: done ? '#c2410c' : '#ece4d6' }}
                  >
                    <Ionicons name={done ? (current && active ? s.icon : 'checkmark') : s.icon} size={15} color={done ? '#fff' : '#a8a29e'} />
                  </View>
                  {i < STEPS.length - 1 ? <View style={{ width: 2, flex: 1, minHeight: 26, backgroundColor: i < stepIndex ? '#c2410c' : '#ece4d6' }} /> : null}
                </View>
                <View className="ml-3 flex-1 pb-5">
                  <Text className="text-sm font-bold" style={{ color: done ? '#1c1917' : '#a8a29e' }}>{s.label}</Text>
                  <Text className="text-xs" style={{ color: done ? '#78716c' : '#c4bcb0' }}>{s.sub}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <Text className="mb-2 mt-2 text-lg font-bold text-stone-900">Summary</Text>
        <Card className="p-4">
          <View className="mb-2 flex-row items-center">
            <Image source={{ uri: order.kitchen_photo }} style={{ width: 40, height: 40, borderRadius: 12 }} />
            <Text className="ml-3 flex-1 text-sm font-bold text-stone-900">{order.kitchen_name}</Text>
          </View>
          {order.items.map((it) => (
            <View key={it.dish_id} className="flex-row justify-between py-1">
              <Text className="text-sm text-stone-700">{it.quantity}× {it.name}</Text>
              <Text className="text-sm font-semibold text-stone-900" style={{ fontVariant: ['tabular-nums'] }}>{dz(it.unit_price_dzd * it.quantity)}</Text>
            </View>
          ))}
          <View className="my-2 h-px bg-stone-100" />
          <View className="flex-row justify-between py-0.5"><Text className="text-xs text-stone-500">Delivery</Text><Text className="text-xs font-semibold text-stone-800">{dz(order.delivery_fee_dzd)}</Text></View>
          {order.discount_dzd > 0 ? <View className="flex-row justify-between py-0.5"><Text className="text-xs text-stone-500">Promo</Text><Text className="text-xs font-semibold text-green-700">− {dz(order.discount_dzd)}</Text></View> : null}
          <View className="mt-1 flex-row justify-between"><Text className="text-base font-bold text-stone-900">Total</Text><Text className="text-lg font-extrabold text-stone-900">{dz(order.total_dzd)}</Text></View>
          <Text className="mt-2 text-xs text-stone-500">
            {order.payment_method === 'cod' ? 'Pay in cash on delivery' : order.payment_method === 'card' ? 'Paid by CIB / Edahabia' : 'Paid with BaridiMob'}
          </Text>
        </Card>

        <View className="mt-5 gap-3">
          {active ? (
            <Button title="Report a problem" variant="tinted" icon="chatbubble-ellipses-outline" onPress={() => Alert.alert('Support', 'Our support team has been notified and will message you within a few minutes.')} />
          ) : (
            <Button title="Back to orders" variant="primary" onPress={() => router.replace('/(tabs)/orders')} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}