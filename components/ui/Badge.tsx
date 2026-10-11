import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  tone?: 'brand' | 'green' | 'red' | 'amber' | 'neutral' | 'dark';
  icon?: keyof typeof Ionicons.glyphMap;
}

const tones = {
  brand: { bg: '#fde8d7', fg: '#c2410c' },
  green: { bg: '#dcfce7', fg: '#15803d' },
  red: { bg: '#fee2e2', fg: '#b91c1c' },
  amber: { bg: '#fef3c7', fg: '#b45309' },
  neutral: { bg: '#f5f0e6', fg: '#57534e' },
  dark: { bg: 'rgba(28,25,23,0.78)', fg: '#ffffff' },
};

export default function Badge({ label, tone = 'neutral', icon }: Props) {
  const t = tones[tone];
  return (
    <View className="flex-row items-center self-start rounded-full px-2.5 py-1" style={{ backgroundColor: t.bg }}>
      {icon ? <Ionicons name={icon} size={11} color={t.fg} style={{ marginRight: 4 }} /> : null}
      <Text className="text-[11px] font-semibold" style={{ color: t.fg }}>{label}</Text>
    </View>
  );
}