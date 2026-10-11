import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';
import BottomSheet from '@/components/ui/BottomSheet';
import { WILAYAS } from '@/services/mockData';

interface Props {
  visible: boolean;
  onClose: () => void;
  current: string;
  onSelect: (wilaya: string) => void;
}

export default function LocationPicker({ visible, onClose, current, onSelect }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Choose your wilaya">
      {WILAYAS.map((w) => {
        const active = w.name === current;
        return (
          <PressableScale
            key={w.code}
            onPress={() => {
              onSelect(w.name);
              onClose();
            }}
          >
            <View className="mb-2 flex-row items-center rounded-2xl p-3.5" style={{ backgroundColor: active ? '#fde8d7' : '#ffffff' }}>
              <Ionicons name="location" size={18} color={active ? '#c2410c' : '#a8a29e'} />
              <Text className="ml-3 flex-1 text-sm font-semibold text-stone-900">{w.name}</Text>
              <Text className="text-xs text-stone-500">{w.code}</Text>
              {active ? <Ionicons name="checkmark-circle" size={18} color="#c2410c" style={{ marginLeft: 8 }} /> : null}
            </View>
          </PressableScale>
        );
      })}
    </BottomSheet>
  );
}