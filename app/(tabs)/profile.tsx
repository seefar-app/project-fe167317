import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import PressableScale from '@/components/ui/PressableScale';
import { FadeInView } from '@/components/motion/ParallaxHeader';
import { GOALS } from '@/services/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import type { Language } from '@/types';

const LANGS: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const addresses = useStore((s) => s.addresses);
  const orders = useStore((s) => s.orders);
  const favorites = useStore((s) => s.favorites);

  const [goals, setGoals] = useState<string[]>(user?.dietary_goals ?? []);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifNear, setNotifNear] = useState(true);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [partnerType, setPartnerType] = useState<'home' | 'restaurant' | null>(null);

  const toggleGoal = (id: string) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const stats = [
    { label: 'Orders', value: orders.length },
    { label: 'Favorites', value: favorites.length },
    { label: 'Addresses', value: addresses.length },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f1e8' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 130 }}>
        <Text className="mb-4 text-3xl font-extrabold uppercase text-stone-900">Profile</Text>

        <FadeInView>
          <Card className="mb-4 p-5">
            <View className="flex-row items-center">
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: 66, height: 66, borderRadius: 33 }} />
              ) : (
                <View className="h-[66px] w-[66px] items-center justify-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
                  <Ionicons name="person" size={30} color="#c2410c" />
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-stone-900">{user?.full_name ?? 'Guest'}</Text>
                <Text className="text-xs text-stone-500">{isGuest ? 'Browsing as guest' : user?.phone}</Text>
                <View className="mt-1.5"><Badge label={`${user?.wilaya ?? 'Alger'}${user?.commune ? ' · ' + user.commune : ''}`} tone="brand" icon="location" /></View>
              </View>
            </View>
            <View className="mt-4 flex-row justify-between rounded-2xl p-3" style={{ backgroundColor: '#fff7ed' }}>
              {stats.map((s) => (
                <View key={s.label} className="flex-1 items-center">
                  <Text className="text-xl font-extrabold text-stone-900" style={{ fontVariant: ['tabular-nums'] }}>{s.value}</Text>
                  <Text className="text-[11px] text-stone-500">{s.label}</Text>
                </View>
              ))}
            </View>
            {isGuest ? (
              <View className="mt-4">
                <Button title="Create a free account" variant="primary" onPress={() => router.push('/(auth)/signup')} />
              </View>
            ) : null}
          </Card>
        </FadeInView>

        {/* Dietary profile */}
        <FadeInView delay={80}>
          <Text className="mb-2 text-lg font-bold text-stone-900">My dietary goals</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {GOALS.map((g) => {
              const on = goals.includes(g.id);
              return (
                <PressableScale key={g.id} onPress={() => toggleGoal(g.id)}>
                  <View className="flex-row items-center rounded-full px-3.5 py-2" style={{ backgroundColor: on ? '#c2410c' : '#ffffff' }}>
                    <Ionicons name={g.icon as keyof typeof Ionicons.glyphMap} size={14} color={on ? '#fff' : '#c2410c'} />
                    <Text className="ml-1.5 text-xs font-bold" style={{ color: on ? '#fff' : '#44403c' }}>{g.label[language]}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </FadeInView>

        {/* Partner entry */}
        <FadeInView delay={140}>
          <PressableScale onPress={() => setPartnerOpen(true)}>
            <View className="mb-5 flex-row items-center rounded-[20px] p-4" style={{ backgroundColor: '#c2410c' }}>
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Ionicons name="restaurant" size={22} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-white">Cook with Saha Kitchen</Text>
                <Text className="text-xs text-white/80">Home cooks & restaurants — apply in minutes</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={26} color="#fff" />
            </View>
          </PressableScale>
        </FadeInView>

        {/* Language */}
        <Text className="mb-2 text-lg font-bold text-stone-900">Language</Text>
        <View className="mb-5 flex-row rounded-full bg-white p-1">
          {LANGS.map((l) => {
            const on = language === l.code;
            return (
              <PressableScale key={l.code} onPress={() => setLanguage(l.code)} style={{ flex: 1 }}>
                <View className="items-center rounded-full py-2.5" style={{ backgroundColor: on ? '#c2410c' : 'transparent' }}>
                  <Text className="text-sm font-bold" style={{ color: on ? '#fff' : '#78716c' }}>{l.label}</Text>
                </View>
              </PressableScale>
            );
          })}
        </View>

        {/* Addresses */}
        <Text className="mb-2 text-lg font-bold text-stone-900">Saved addresses</Text>
        {addresses.map((a) => (
          <Card key={a.id} className="mb-3 flex-row items-center p-4">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#fde8d7' }}>
              <Ionicons name="home" size={18} color="#c2410c" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-stone-900">{a.label}{a.is_default ? '  ·  Default' : ''}</Text>
              <Text numberOfLines={1} className="text-xs text-stone-500">{a.street}, {a.commune}</Text>
            </View>
          </Card>
        ))}

        {/* Settings */}
        <Text className="mb-2 mt-3 text-lg font-bold text-stone-900">Notifications</Text>
        <Card className="mb-5 px-4">
          <SwitchRow label="Order status updates" value={notifOrders} onChange={setNotifOrders} />
          <View className="h-px bg-stone-100" />
          <SwitchRow label="New kitchens nearby" value={notifNear} onChange={setNotifNear} />
        </Card>

        <Card className="mb-5 px-4">
          <LinkRow icon="help-circle-outline" label="Help center & FAQ" onPress={() => Alert.alert('Help center', 'Cash on delivery: pay the courier in DZD. Refunds are credited within 24h. Food-safety issues? Report from the order screen.')} />
          <View className="h-px bg-stone-100" />
          <LinkRow icon="shield-checkmark-outline" label="Privacy & data" onPress={() => Alert.alert('Privacy', 'We only use your location to find nearby kitchens and deliver your order.')} />
          <View className="h-px bg-stone-100" />
          <LinkRow icon="trash-outline" label="Delete my account" danger onPress={() => Alert.alert('Delete account', 'Are you sure? This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: onLogout }])} />
        </Card>

        <Button title="Log out" variant="outline" icon="log-out-outline" onPress={onLogout} />
      </ScrollView>

      <BottomSheet visible={partnerOpen} onClose={() => { setPartnerOpen(false); setPartnerType(null); }} title="Become a partner">
        {partnerType === null ? (
          <View>
            <Text className="mb-4 text-sm text-stone-500">Choose how you want to sell healthy food on Saha Kitchen.</Text>
            <PressableScale onPress={() => setPartnerType('home')}>
              <View className="mb-3 flex-row items-center rounded-[20px] bg-white p-4">
                <Ionicons name="home" size={24} color="#c2410c" />
                <View className="ml-3 flex-1"><Text className="text-sm font-bold text-stone-900">Home cook</Text><Text className="text-xs text-stone-500">ID + hygiene verification</Text></View>
                <Ionicons name="chevron-forward" size={18} color="#a8a29e" />
              </View>
            </PressableScale>
            <PressableScale onPress={() => setPartnerType('restaurant')}>
              <View className="mb-2 flex-row items-center rounded-[20px] bg-white p-4">
                <Ionicons name="restaurant" size={24} color="#c2410c" />
                <View className="ml-3 flex-1"><Text className="text-sm font-bold text-stone-900">Restaurant</Text><Text className="text-xs text-stone-500">Commercial register + opening hours</Text></View>
                <Ionicons name="chevron-forward" size={18} color="#a8a29e" />
              </View>
            </PressableScale>
          </View>
        ) : (
          <View>
            <Text className="mb-3 text-sm text-stone-500">{partnerType === 'home' ? 'Home cook application' : 'Restaurant application'} — you’ll need:</Text>
            {(partnerType === 'home'
              ? ['National ID photo', 'Hygiene certificate', 'Kitchen photos', 'Sample weekly menu']
              : ['Commercial register number', 'Hygiene certificate', 'Menu & opening hours', 'Bank / CCP details']
            ).map((item) => (
              <View key={item} className="mb-2 flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                <Text className="ml-2 text-sm text-stone-800">{item}</Text>
              </View>
            ))}
            <View className="mt-4">
              <Button
                title="Submit for review"
                onPress={() => {
                  setPartnerOpen(false);
                  setPartnerType(null);
                  Alert.alert('Application sent', 'Our team will review your documents within 48 hours and notify you.');
                }}
              />
            </View>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function SwitchRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center justify-between py-3.5">
      <Text className="text-sm font-medium text-stone-900">{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: '#c2410c', false: '#e7e0d4' }} thumbColor="#fff" />
    </View>
  );
}

function LinkRow({ icon, label, onPress, danger }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.98}>
      <View className="flex-row items-center py-3.5">
        <Ionicons name={icon} size={20} color={danger ? '#dc2626' : '#78716c'} />
        <Text className="ml-3 flex-1 text-sm font-medium" style={{ color: danger ? '#dc2626' : '#1c1917' }}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#d6d3d1" />
      </View>
    </PressableScale>
  );
}