import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { User } from '@/types';

const KEY = 'sk_auth_user';
const OTP_CODE = '123456';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  authError: string | null;
  otpSentTo: string | null;
  requestOtp: (phone: string) => Promise<boolean>;
  login: (phone: string, code: string) => Promise<boolean>;
  signup: (data: { full_name: string; phone: string; wilaya: string; commune: string }) => Promise<boolean>;
  continueAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

const normalize = (p: string) => p.replace(/\s+/g, '');
const validPhone = (p: string) => /^(\+213|0)[567]\d{8}$/.test(normalize(p));

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isInitializing: true,
  isSubmitting: false,
  authError: null,
  otpSentTo: null,

  clearError: () => set({ authError: null }),

  initializeAuth: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const user = JSON.parse(raw) as User;
        set({ user, isAuthenticated: true, isGuest: user.id.startsWith('guest') });
      }
    } catch (e) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false });
    }
  },

  requestOtp: async (phone) => {
    set({ isSubmitting: true, authError: null });
    try {
      if (!validPhone(phone)) {
        set({ authError: 'Enter a valid Algerian phone number (e.g. 0555 12 34 56).' });
        return false;
      }
      await wait(700);
      set({ otpSentTo: normalize(phone) });
      return true;
    } catch (e) {
      set({ authError: 'Could not send the SMS code. Please try again.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  login: async (phone, code) => {
    set({ isSubmitting: true, authError: null });
    try {
      if (code.trim().length !== 6) {
        set({ authError: 'Enter the 6-digit code we sent you.' });
        return false;
      }
      await wait(600);
      if (code.trim() !== OTP_CODE) {
        set({ authError: 'That code is incorrect. For this demo use 123456.' });
        return false;
      }
      const stored = await AsyncStorage.getItem(KEY + '_' + normalize(phone));
      const user: User = stored
        ? (JSON.parse(stored) as User)
        : {
            id: Crypto.randomUUID(),
            full_name: 'Amine Bouzid',
            phone: normalize(phone),
            email: null,
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            language_pref: 'fr',
            wilaya: 'Alger',
            commune: 'Bab Ezzouar',
            dietary_goals: ['high-protein'],
            allergies: [],
            role: 'customer',
            created_at: new Date().toISOString(),
          };
      await AsyncStorage.setItem(KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isGuest: false, otpSentTo: null });
      return true;
    } catch (e) {
      set({ authError: 'Something went wrong while signing you in. Please try again.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  signup: async ({ full_name, phone, wilaya, commune }) => {
    set({ isSubmitting: true, authError: null });
    try {
      if (full_name.trim().length < 3) {
        set({ authError: 'Please enter your full name.' });
        return false;
      }
      if (!validPhone(phone)) {
        set({ authError: 'Enter a valid Algerian phone number (e.g. 0555 12 34 56).' });
        return false;
      }
      if (!wilaya) {
        set({ authError: 'Please choose your wilaya.' });
        return false;
      }
      await wait(800);
      const user: User = {
        id: Crypto.randomUUID(),
        full_name: full_name.trim(),
        phone: normalize(phone),
        email: null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=c2410c&color=fff&size=200`,
        language_pref: 'fr',
        wilaya,
        commune: commune || wilaya,
        dietary_goals: [],
        allergies: [],
        role: 'customer',
        created_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(KEY, JSON.stringify(user));
      await AsyncStorage.setItem(KEY + '_' + normalize(phone), JSON.stringify(user));
      set({ user, isAuthenticated: true, isGuest: false });
      return true;
    } catch (e) {
      set({ authError: 'Could not create your account. Please try again.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  continueAsGuest: async () => {
    set({ isSubmitting: true, authError: null });
    try {
      const user: User = {
        id: 'guest-' + Crypto.randomUUID(),
        full_name: 'Guest',
        phone: '',
        email: null,
        avatar: null,
        language_pref: 'en',
        wilaya: 'Alger',
        commune: 'Alger Centre',
        dietary_goals: [],
        allergies: [],
        role: 'customer',
        created_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isGuest: true });
      return true;
    } catch (e) {
      set({ authError: 'Could not start guest mode.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    set({ isSubmitting: true });
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (e) {
      // ignore storage failure, still clear in-memory state
    } finally {
      set({ user: null, isAuthenticated: false, isGuest: false, otpSentTo: null, authError: null, isSubmitting: false });
    }
  },
}));