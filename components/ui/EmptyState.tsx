import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View className="items-center px-8 py-14">
      <View className="mb-5 h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
        <Ionicons name={icon} size={40} color="#c2410c" />
      </View>
      <Text className="mb-2 text-center text-lg font-bold text-stone-900">{title}</Text>
      <Text className="mb-6 text-center text-sm text-stone-500">{description}</Text>
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} fullWidth={false} /> : null}
    </View>
  );
}