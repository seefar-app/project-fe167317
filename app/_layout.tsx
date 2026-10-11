import '../global.css';
import { useEffect } from 'react';
import { I18nManager, Platform, UIManager, View, ActivityIndicator, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Colors } from '@/constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const loadLanguage = useStore((s) => s.loadLanguage);
  const loadCatalog = useStore((s) => s.loadCatalog);
  const startSimulation = useStore((s) => s.startSimulation);

  useEffect(() => {
    initializeAuth();
    loadLanguage();
    loadCatalog();
    startSimulation();
    I18nManager.allowRTL(true);
  }, [initializeAuth, loadLanguage, loadCatalog, startSimulation]);

  useEffect(() => {
    if (isInitializing) return;
    const root = segments[0] as string | undefined;
    const inAuth = root === '(auth)';
    const onSplash = root === undefined || root === 'index';
    if (!isAuthenticated && !inAuth && !onSplash) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuth || onSplash)) {
      router.replace('/(tabs)');
    }
  }, [isInitializing, isAuthenticated, segments, router]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: Colors.light.primary }}>
          <Text className="text-3xl font-extrabold text-white">S</Text>
        </View>
        <ActivityIndicator color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.light.background } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="kitchen/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="order/[id]" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}