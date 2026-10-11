import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';
import { dz } from '@/store/useStore';

interface Props {
  price: number;
  onAdd: () => void;
  disabled?: boolean;
}

export default function PriceAddButton({ price, onAdd, disabled }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-extrabold text-stone-900">{dz(price)}</Text>
      <PressableScale onPress={disabled ? undefined : onAdd} haptic disabled={disabled}>
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: disabled ? '#d6d3d1' : '#c2410c' }}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </View>
      </PressableScale>
    </View>
  );
}