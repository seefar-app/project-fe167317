import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';
import Badge from '@/components/ui/Badge';
import { dz } from '@/store/useStore';
import type { Kitchen } from '@/types';

interface Props {
  kitchen: Kitchen;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export default function KitchenCard({ kitchen, isFavorite, onToggleFavorite, onPress }: Props) {
  return (
    <PressableScale onPress={onPress}>
      <View
        className="mb-4 overflow-hidden rounded-[20px] bg-white"
        style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      >
        <View>
          <Image source={{ uri: kitchen.cover_photo }} style={{ width: '100%', height: 168 }} contentFit="cover" transition={250} />
          <View className="absolute left-3 top-3 flex-row gap-2">
            <Badge label={kitchen.type === 'home_kitchen' ? 'Cuisine maison' : 'Restaurant'} tone="dark" icon={kitchen.type === 'home_kitchen' ? 'home' : 'restaurant'} />
          </View>
          <PressableScale onPress={onToggleFavorite} style={{ position: 'absolute', right: 12, top: 12 }}>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={19} color={isFavorite ? '#dc2626' : '#1c1917'} />
            </View>
          </PressableScale>
          {!kitchen.is_accepting_orders ? (
            <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Text className="text-sm font-bold text-white">On a break · back soon</Text>
            </View>
          ) : null}
        </View>
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center pr-2">
              <Text numberOfLines={1} className="text-lg font-bold text-stone-900">{kitchen.display_name}</Text>
              {kitchen.is_verified ? <Ionicons name="checkmark-circle" size={17} color="#16a34a" style={{ marginLeft: 6 }} /> : null}
            </View>
            <View className="flex-row items-center rounded-full bg-amber-50 px-2 py-1">
              <Ionicons name="star" size={12} color="#d97706" />
              <Text className="ml-1 text-xs font-bold text-stone-900">{kitchen.rating.toFixed(1)}</Text>
              <Text className="ml-1 text-[11px] text-stone-500">({kitchen.review_count})</Text>
            </View>
          </View>
          <Text numberOfLines={1} className="mt-1 text-xs text-stone-500">{kitchen.specialties.join(' · ')}</Text>
          <View className="mt-3 flex-row items-center gap-4">
            <View className="flex-row items-center"><Ionicons name="time-outline" size={14} color="#78716c" /><Text className="ml-1 text-xs font-medium text-stone-600">{kitchen.avg_prep_minutes} min</Text></View>
            <View className="flex-row items-center"><Ionicons name="navigate-outline" size={14} color="#78716c" /><Text className="ml-1 text-xs font-medium text-stone-600">{kitchen.distance_km} km</Text></View>
            <View className="flex-row items-center"><Ionicons name="bicycle-outline" size={14} color="#78716c" /><Text className="ml-1 text-xs font-medium text-stone-600">{dz(kitchen.delivery_fee_dzd)}</Text></View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}