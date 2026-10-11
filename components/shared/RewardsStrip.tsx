import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';

export default function RewardsStrip({ onPress }: { onPress?: () => void }) {
  return (
    <PressableScale onPress={onPress}>
      <View className="flex-row items-center rounded-[20px] p-4" style={{ backgroundColor: '#fde8d7' }}>
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white">
          <Ionicons name="gift" size={22} color="#c2410c" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-stone-900">Use code SAHA10 — 10% off</Text>
          <Text className="mt-0.5 text-xs text-stone-600">Your first healthy week, on us. Try FIRST20 for 20%.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#c2410c" />
      </View>
    </PressableScale>
  );
}