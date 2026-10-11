import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import PressableScale from '@/components/ui/PressableScale';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { FadeInView } from '@/components/motion/ParallaxHeader';
import { dz, isActiveStatus, useStore } from '@/store/useStore';
import type { Order, OrderStatus } from '@/types';

const LABELS: Record<OrderStatus, string> = {
  placed: 'Order placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const orders = useStore((s) => s.orders);
  const reorder = useStore((s) => s.reorder);
  const loadCatalog = useStore((s) => s.loadCatalog);
  const [tab, setTab] = useState<'active' | 'past'>('active');
  const [refreshing, setRefreshing] = useState(false);

  const active = orders.filter((o) => isActiveStatus(o.status));
  const past = orders.filter((o) => !isActiveStatus(o.status));
  const list = tab === 'active' ? active : past;

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCatalog();
    setRefreshing(false);
  };

  const onReorder = async (o: Order) => {
    await reorder(o.id);
    router.push('/(tabs)/cart');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c2410c" />}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 130 }}
      >
        <Text className="mb-4 text-3xl font-extrabold uppercase text-stone-900">Orders</Text>

        <View className="mb-5 flex-row rounded-full bg-white p-1">
          {(['active', 'past'] as const).map((k) => {
            const on = tab === k;
            return (
              <PressableScale key={k} onPress={() => setTab(k)} style={{ flex: 1 }}>
                <View className="items-center rounded-full py-2.5" style={{ backgroundColor: on ? '#c2410c' : 'transparent' }}>
                  <Text className="text-sm font-bold" style={{ color: on ? '#fff' : '#78716c' }}>
                    {k === 'active' ? `Active (${active.length})` : `Past (${past.length})`}
                  </Text>
                </View>
              </PressableScale>
            );
          })}
        </View>

        {list.length === 0 ? (
          <EmptyState
            icon={tab === 'active' ? 'bicycle-outline' : 'receipt-outline'}
            title={tab === 'active' ? 'No active orders' : 'No past orders yet'}
            description={tab === 'active' ? 'When you order, you can follow your meal live from the kitchen to your door.' : 'Your delivered orders will appear here for easy reordering.'}
            actionLabel="Browse kitchens"
            onAction={() => router.push('/(tabs)')}
          />
        ) : (
          list.map((o, i) => (
            <FadeInView key={o.id} delay={Math.min(i * 70, 280)}>
              <Card className="mb-4 p-4" onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })}>
                <View className="flex-row">
                  <Image source={{ uri: o.kitchen_photo }} style={{ width: 64, height: 64, borderRadius: 16 }} contentFit="cover" />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text numberOfLines={1} className="mr-2 flex-1 text-base font-bold text-stone-900">{o.kitchen_name}</Text>
                      <Text className="text-sm font-extrabold text-stone-900" style={{ fontVariant: ['tabular-nums'] }}>{dz(o.total_dzd)}</Text>
                    </View>
                    <Text numberOfLines={2} className="mt-0.5 text-xs text-stone-500">{o.item_summary}</Text>
                    <Text className="mt-1 text-[11px] text-stone-400">{formatDistanceToNow(new Date(o.created_at), { addSuffix: true })}</Text>
                  </View>
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                  {isActiveStatus(o.status) ? (
                    <View className="flex-row items-center">
                      <StatusIndicator color="#c2410c" size={8} />
                      <Text className="ml-1 text-xs font-bold" style={{ color: '#c2410c' }}>{LABELS[o.status]}</Text>
                    </View>
                  ) : (
                    <Badge label={LABELS[o.status]} tone={o.status === 'delivered' ? 'green' : 'red'} icon={o.status === 'delivered' ? 'checkmark-circle' : 'close-circle'} />
                  )}
                  {isActiveStatus(o.status) ? (
                    <Button title="Track" size="sm" fullWidth={false} icon="navigate" onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} />
                  ) : (
                    <Button title="Reorder" size="sm" variant="tinted" fullWidth={false} icon="refresh" onPress={() => onReorder(o)} />
                  )}
                </View>
              </Card>
            </FadeInView>
          ))
        )}
      </ScrollView>
    </View>
  );
}