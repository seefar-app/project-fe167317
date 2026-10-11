import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import PressableScale from './PressableScale';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

// Archetype card treatment: bg-white rounded-2xl (20pt), shadow-sm, no border
export default function Card({ children, onPress, style, className = '' }: Props) {
  const body = (
    <View
      className={`rounded-[20px] bg-white ${className}`}
      style={[
        { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return body;
  return <PressableScale onPress={onPress}>{body}</PressableScale>;
}