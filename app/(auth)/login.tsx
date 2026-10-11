import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PressableScale from '@/components/ui/PressableScale';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { t } from '@/constants/i18n';

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const language = useStore((s) => s.language);
  const { isSubmitting, authError, otpSentTo, requestOtp, login, continueAsGuest, clearError } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const step = otpSentTo ? 'otp' : 'phone';
  const error = localError ?? authError;

  const onSendCode = async () => {
    clearError();
    setLocalError(null);
    if (!phone.trim()) {
      setLocalError('Please enter your phone number.');
      return;
    }
    await requestOtp(phone);
  };

  const onVerify = async () => {
    clearError();
    setLocalError(null);
    if (!code.trim()) {
      setLocalError('Please enter the 6-digit code.');
      return;
    }
    const ok = await login(otpSentTo ?? phone, code);
    if (ok) router.replace('/(tabs)');
  };

  const onGuest = async () => {
    clearError();
    setLocalError(null);
    const ok = await continueAsGuest();
    if (ok) router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1000' }} style={{ height: 260 }}>
          <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(247,241,232,1)']} style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingTop: insets.top }}>
            <Text className="mb-1 text-3xl font-extrabold uppercase leading-tight text-stone-900">Welcome{'\n'}back</Text>
          </LinearGradient>
        </ImageBackground>

        <View className="px-5 pb-10" style={{ paddingBottom: insets.bottom + 24 }}>
          <Text className="mb-5 mt-2 text-sm text-stone-500">
            {step === 'phone' ? 'Sign in with your Algerian phone number. We’ll send you an SMS code.' : `We sent a 6-digit code to ${otpSentTo}. Demo code: 123456`}
          </Text>

          {step === 'phone' ? (
            <Input
              label="Phone number"
              icon="call-outline"
              prefix="+213"
              placeholder="555 12 34 56"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(v) => { setPhone(v); if (localError) setLocalError(null); }}
            />
          ) : (
            <Input
              label="SMS code"
              icon="keypad-outline"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={(v) => { setCode(v); if (localError) setLocalError(null); }}
            />
          )}

          {error ? (
            <View className="mb-4 flex-row items-center rounded-2xl bg-red-50 p-3">
              <Text className="flex-1 text-xs font-medium text-red-700">{error}</Text>
            </View>
          ) : null}

          <Button
            title={step === 'phone' ? 'Send code' : 'Verify & sign in'}
            size="lg"
            loading={isSubmitting}
            onPress={step === 'phone' ? onSendCode : onVerify}
          />

          <View className="mt-3">
            <Button title={t('guest', language)} variant="tinted" onPress={onGuest} disabled={isSubmitting} />
          </View>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-sm text-stone-500">New here? </Text>
            <PressableScale onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-sm font-bold" style={{ color: '#c2410c' }}>Create an account</Text>
            </PressableScale>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}