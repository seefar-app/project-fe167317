import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PressableScale from '@/components/ui/PressableScale';
import LocationPicker from '@/components/shared/LocationPicker';
import { useAuthStore } from '@/store/useAuthStore';

export default function Signup() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSubmitting, authError, signup, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commune, setCommune] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [picker, setPicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError ?? authError;

  const onSubmit = async () => {
    clearError();
    setLocalError(null);
    if (!name.trim() || !phone.trim()) {
      setLocalError('Please enter your full name and phone number.');
      return;
    }
    if (!wilaya) {
      setLocalError('Please choose your wilaya.');
      return;
    }
    const ok = await signup({ full_name: name, phone, wilaya, commune });
    if (ok) router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <PressableScale onPress={() => router.back()}>
          <View className="mb-5 h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons name="arrow-back" size={20} color="#1c1917" />
          </View>
        </PressableScale>
        <Text className="mb-1 text-3xl font-extrabold uppercase leading-tight text-stone-900">Join Saha{'\n'}Kitchen</Text>
        <Text className="mb-6 mt-2 text-sm text-stone-500">Healthy, halal meals from verified kitchens near you.</Text>

        <Input label="Full name" icon="person-outline" placeholder="Amine Bouzid" value={name} onChangeText={setName} />
        <Input label="Phone number" icon="call-outline" prefix="+213" placeholder="555 12 34 56" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <Text className="mb-1.5 text-xs font-medium text-stone-500">Wilaya</Text>
        <PressableScale onPress={() => setPicker(true)}>
          <View className="mb-4 flex-row items-center rounded-2xl bg-white px-4 py-4" style={{ borderWidth: 1.5, borderColor: '#ece4d6' }}>
            <Ionicons name="location-outline" size={18} color="#a8a29e" />
            <Text className="ml-2.5 flex-1 text-sm" style={{ color: wilaya ? '#1c1917' : '#a8a29e' }}>{wilaya || 'Select your wilaya'}</Text>
            <Ionicons name="chevron-down" size={16} color="#a8a29e" />
          </View>
        </PressableScale>

        <Input label="Commune (optional)" icon="map-outline" placeholder="Bab Ezzouar" value={commune} onChangeText={setCommune} />

        {error ? (
          <View className="mb-4 rounded-2xl bg-red-50 p-3">
            <Text className="text-xs font-medium text-red-700">{error}</Text>
          </View>
        ) : null}

        <Button title="Create account" size="lg" loading={isSubmitting} onPress={onSubmit} />
        <View className="mt-5 flex-row justify-center">
          <Text className="text-sm text-stone-500">Already have an account? </Text>
          <PressableScale onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-sm font-bold" style={{ color: '#c2410c' }}>Sign in</Text>
          </PressableScale>
        </View>
      </ScrollView>
      <LocationPicker visible={picker} onClose={() => setPicker(false)} current={wilaya} onSelect={setWilaya} />
    </KeyboardAvoidingView>
  );
}