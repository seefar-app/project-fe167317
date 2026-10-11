import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '@/components/ui/PressableScale';
import { GOALS } from '@/services/mockData';
import type { Language } from '@/types';

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
  language: Language;
}

export default function CategoryRow({ selected, onSelect, language }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
      {GOALS.map((g) => {
        const active = selected === g.id;
        return (
          <PressableScale key={g.id} onPress={() => onSelect(active ? null : g.id)}>
            <View className="w-[78px] items-center">
              <View
                className="mb-2 h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: active ? '#c2410c' : '#fde8d7' }}
              >
                <Ionicons name={g.icon as keyof typeof Ionicons.glyphMap} size={26} color={active ? '#fff' : '#c2410c'} />
              </View>
              <Text
                numberOfLines={2}
                className="text-center text-xs font-medium"
                style={{ color: active ? '#c2410c' : '#1c1917', fontWeight: active ? '700' : '500' }}
              >
                {g.label[language]}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}