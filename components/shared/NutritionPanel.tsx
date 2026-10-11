import { Text, View } from 'react-native';
import type { Nutrition } from '@/types';

export default function NutritionPanel({ n }: { n: Nutrition }) {
  const max = Math.max(n.protein_g, n.carbs_g, n.fat_g, 1);
  const rows = [
    { label: 'Protein', v: n.protein_g, color: '#c2410c' },
    { label: 'Carbs', v: n.carbs_g, color: '#d97706' },
    { label: 'Fat', v: n.fat_g, color: '#dc2626' },
  ];
  return (
    <View className="rounded-[20px] p-4" style={{ backgroundColor: '#fff7ed' }}>
      <View className="mb-3 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-medium text-stone-500">Per portion</Text>
          <Text className="text-3xl font-extrabold text-stone-900" style={{ fontVariant: ['tabular-nums'] }}>
            {n.kcal} <Text className="text-sm font-semibold text-stone-500">kcal</Text>
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-stone-500">Fiber {n.fiber_g}g · Sugar {n.sugar_g}g</Text>
        </View>
      </View>
      {rows.map((r) => (
        <View key={r.label} className="mb-2 flex-row items-center">
          <Text className="w-16 text-xs font-medium text-stone-600">{r.label}</Text>
          <View className="mx-2 h-2 flex-1 overflow-hidden rounded-full bg-white">
            <View style={{ width: `${(r.v / max) * 100}%`, height: 8, backgroundColor: r.color, borderRadius: 8 }} />
          </View>
          <Text className="w-10 text-right text-xs font-bold text-stone-800" style={{ fontVariant: ['tabular-nums'] }}>{r.v}g</Text>
        </View>
      ))}
    </View>
  );
}