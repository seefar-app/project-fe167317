import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

export function useScrollY() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });
  return { scrollY, onScroll };
}

export default function ParallaxHeader({ scrollY, height = 280, children }: { scrollY: Animated.Value; height?: number; children: ReactNode }) {
  const translateY = scrollY.interpolate({ inputRange: [-height, 0, height], outputRange: [-height / 2, 0, height * 0.6] });
  const scale = scrollY.interpolate({ inputRange: [-height, 0], outputRange: [1.6, 1], extrapolateRight: 'clamp' });
  const rotateX = scrollY.interpolate({ inputRange: [0, height], outputRange: ['0deg', '18deg'], extrapolate: 'clamp' });
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Animated.View style={{ flex: 1, transform: [{ perspective: 800 }, { translateY }, { scale }, { rotateX }] }}>{children}</Animated.View>
    </View>
  );
}

export function FadeInView({
  children, delay = 0, distance = 18, style,
}: { children: ReactNode; delay?: number; distance?: number; style?: StyleProp<ViewStyle> }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, damping: 16, stiffness: 120 }),
    ]).start();
  }, [opacity, translateY, delay]);
  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

export function CountUp({ to, duration = 900, format }: { to: number; duration?: number; format?: (n: number) => string }) {
  const value = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = (require('react') as typeof import('react')).useState(0);
  useEffect(() => {
    const id = value.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(value, { toValue: to, duration, useNativeDriver: false }).start();
    return () => value.removeListener(id);
  }, [to, duration, value]);
  const RN = require('react-native') as typeof import('react-native');
  return <RN.Text>{format ? format(display) : String(display)}</RN.Text>;
}