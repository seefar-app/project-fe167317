import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
}

export default function Input({ label, error, icon, prefix, secureTextEntry, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focus, setFocus] = useState(false);
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1.5 text-xs font-medium text-stone-500">{label}</Text> : null}
      <View
        className="flex-row items-center rounded-2xl bg-white px-4"
        style={{ borderWidth: 1.5, borderColor: error ? Colors.light.error : focus ? Colors.light.primary : '#ece4d6' }}
      >
        {icon ? <Ionicons name={icon} size={18} color="#a8a29e" style={{ marginRight: 10 }} /> : null}
        {prefix ? <Text className="mr-2 text-sm font-semibold text-stone-700">{prefix}</Text> : null}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          placeholderTextColor="#a8a29e"
          className="flex-1 py-3.5 text-sm text-stone-900"
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color="#a8a29e" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}