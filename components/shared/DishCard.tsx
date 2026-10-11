import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';
import PriceAddButton from './PriceAddButton';
import type { Dish } from '@/types';

interface Props {
  dish: Dish;
  kitchenName?: string;
  width?: number;
  onPress: () => void;
  onAdd: () => void;
}

export default function DishCard({ dish, kitchenName, width = 200, onPress, onAdd }: Props) {
  return (
    <PressableScale onPress={onPress}>
      <View
        className="overflow-hidden rounded-[20px] bg-white"
        style={{ width, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      >
        <Image source={{ uri: dish.photos[0] }} style={{ width: '100%', height: 128 }} contentFit="cover" transition={250} />
        <View className="absolute left-2.5 top-2.5 flex-row items-center rounded-full bg-white/95 px-2 py-1">
          <Ionicons name="flame" size={11} color="#c2410c" />
          <Text className="ml-1 text-[11px] font-bold text-stone-900">{dish.nutrition.kcal} kcal</Text>
        </View>
        <View className="p-3">
          <Text numberOfLines={2} className="text-sm font-bold text-stone-900" style={{ minHeight: 36 }}>{dish.name}</Text>
          {kitchenName ? <Text numberOfLines={1} className="mb-2 mt-0.5 text-xs text-stone-500">{kitchenName}</Text> : <View style={{ height: 8 }} />}
          <PriceAddButton price={dish.price_dzd} onAdd={onAdd} disabled={!dish.is_available} />
        </View>
      </View>
    </PressableScale>
  );
}