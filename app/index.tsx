import { Text, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import PressableScale from '@/components/ui/PressableScale';
import { FadeInView } from '@/components/motion/ParallaxHeader';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SPLASH_IMAGE } from '@/services/mockData';
import { t } from '@/constants/i18n';
import type { Language } from '@/types';

const LANGS: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

export default function Splash() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const headline = t('heroTitle', language);

  return (
    <ImageBackground source={{ uri: SPLASH_IMAGE }} style={{ flex: 1 }}>
      <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(28,25,23,0.92)']} style={{ flex: 1, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
        <FadeInView>
          <View className="flex-row items-center">
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: '#c2410c' }}>
              <Text className="text-xl font-extrabold text-white">S</Text>
            </View>
            <Text className="text-xl font-extrabold tracking-wide text-white">SAHA KITCHEN</Text>
          </View>
        </FadeInView>

        <View className="flex-1 justify-end">
          <FadeInView delay={150}>
            <Text className="mb-3 text-4xl font-extrabold uppercase leading-tight text-white">{headline}</Text>
          </FadeInView>
          <FadeInView delay={280}>
            <Text className="mb-6 text-sm text-white/80">{t('heroSub', language)}</Text>
          </FadeInView>

          <FadeInView delay={380}>
            <Text className="mb-2 text-xs font-medium uppercase tracking-widest text-white/60">{t('chooseLanguage', language)}</Text>
            <View className="mb-6 flex-row gap-2">
              {LANGS.map((l) => {
                const active = language === l.code;
                return (
                  <PressableScale key={l.code} onPress={() => setLanguage(l.code)} haptic>
                    <View
                      className="rounded-full px-4 py-2.5"
                      style={{ backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.16)' }}
                    >
                      <Text className="text-sm font-semibold" style={{ color: active ? '#c2410c' : '#fff' }}>{l.label}</Text>
                    </View>
                  </PressableScale>
                );
              })}
            </View>
          </FadeInView>

          <FadeInView delay={480}>
            <Button
              title={t('continue', language)}
              size="lg"
              onPress={() => router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login')}
            />
          </FadeInView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}