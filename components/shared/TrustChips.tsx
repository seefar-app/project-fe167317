import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'shield-checkmark', label: 'Hygiene verified' },
  { icon: 'moon', label: '100% Halal' },
  { icon: 'id-card', label: 'ID-checked cooks' },
  { icon: 'cash-outline', label: 'Cash on delivery' },
];

export default function TrustChips() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
      {ITEMS.map((i) => (
        <View key={i.label} className="flex-row items-center rounded-full bg-white px-3.5 py-2" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
          <Ionicons name={i.icon} size={14} color="#c2410c" />
          <Text className="ml-1.5 text-xs font-medium text-stone-800">{i.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}