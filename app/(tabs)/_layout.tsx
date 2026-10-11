import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PressableScale from '@/components/ui/PressableScale';
import CartBadge from '@/components/shared/CartBadge';
import { useStore } from '@/store/useStore';
import { t } from '@/constants/i18n';

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; key: 'home' | 'cart' | 'orders' | 'profile' }> = {
  index: { on: 'home', off: 'home-outline', key: 'home' },
  cart: { on: 'cart', off: 'cart-outline', key: 'cart' },
  orders: { on: 'receipt', off: 'receipt-outline', key: 'orders' },
  profile: { on: 'person', off: 'person-outline', key: 'profile' },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.quantity, 0));
  const language = useStore((s) => s.language);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: '#ffffff',
            paddingBottom: insets.bottom + 6,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#efe7da',
          }}
        >
          {props.state.routes.map((route, index) => {
            const focused = props.state.index === index;
            const cfg = ICONS[route.name];
            if (!cfg) return null;
            const isCenter = route.name === 'cart';
            const color = focused ? '#c2410c' : '#a8a29e';
            const onPress = () => props.navigation.navigate(route.name);

            if (isCenter) {
              return (
                <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
                  <PressableScale onPress={onPress} haptic>
                    <View
                      style={{
                        width: 58, height: 58, borderRadius: 29, marginTop: -30,
                        backgroundColor: '#c2410c', alignItems: 'center', justifyContent: 'center',
                        shadowColor: '#c2410c', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8,
                        borderWidth: 4, borderColor: '#f7f1e8',
                      }}
                    >
                      <Ionicons name={cfg.on} size={26} color="#fff" />
                      <CartBadge count={cartCount} />
                    </View>
                  </PressableScale>
                  <Text className="mt-1 text-[11px] font-medium" style={{ color }}>{t(cfg.key, language)}</Text>
                </View>
              );
            }
            return (
              <PressableScale key={route.key} onPress={onPress} style={{ flex: 1 }}>
                <View className="items-center gap-1 py-1">
                  <Ionicons name={focused ? cfg.on : cfg.off} size={23} color={color} />
                  <Text className="text-[11px] font-medium" style={{ color }}>{t(cfg.key, language)}</Text>
                </View>
              </PressableScale>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}