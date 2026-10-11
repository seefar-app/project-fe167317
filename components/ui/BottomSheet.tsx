import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeightRatio?: number;
}

const { height: SCREEN_H } = Dimensions.get('window');

export default function BottomSheet({ visible, onClose, title, children, maxHeightRatio = 0.88 }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 180 }),
        Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(SCREEN_H);
      fade.setValue(0);
    }
  }, [visible, translateY, fade]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', opacity: fade }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          maxHeight: SCREEN_H * maxHeightRatio,
          transform: [{ translateY }],
          backgroundColor: '#fffdf9',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          paddingBottom: insets.bottom + 12,
        }}
      >
        <View className="items-center pb-2 pt-3">
          <View className="h-1.5 w-12 rounded-full bg-stone-300" />
        </View>
        {title ? <Text className="px-5 pb-2 text-lg font-bold text-stone-900">{title}</Text> : null}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}