import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { Colors } from '@/constants/Colors';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'tinted' | 'outline' | 'ghost' | 'destructive' | 'dark';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'sm';
  fullWidth?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', icon, loading, disabled, size = 'md', fullWidth = true }: Props) {
  const c = Colors.light;
  const bg =
    variant === 'primary' ? c.primary
    : variant === 'tinted' ? c.secondary
    : variant === 'destructive' ? c.accent
    : variant === 'dark' ? '#1c1917'
    : 'transparent';
  const fg =
    variant === 'primary' || variant === 'destructive' || variant === 'dark' ? '#ffffff'
    : variant === 'tinted' ? c.primary
    : variant === 'outline' ? c.primary
    : c.text;
  const pad = size === 'lg' ? 'py-4 px-7' : size === 'sm' ? 'py-2 px-4' : 'py-3.5 px-6';
  const off = disabled || loading;
  return (
    <PressableScale onPress={off ? undefined : onPress} haptic disabled={off} style={fullWidth ? undefined : { alignSelf: 'flex-start' }}>
      <View
        className={`flex-row items-center justify-center rounded-full ${pad}`}
        style={{
          backgroundColor: bg,
          opacity: off ? 0.55 : 1,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: c.primary,
        }}
      >
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 8 }} /> : null}
            <Text className={size === 'sm' ? 'text-xs font-bold' : 'text-base font-bold'} style={{ color: fg }}>
              {title}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}