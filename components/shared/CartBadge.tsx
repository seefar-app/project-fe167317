import { Text, View } from 'react-native';

export default function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View
      className="absolute -right-1 -top-1 min-w-[20px] items-center justify-center rounded-full px-1"
      style={{ backgroundColor: '#dc2626', height: 20, borderWidth: 2, borderColor: '#fff' }}
    >
      <Text className="text-[10px] font-extrabold text-white">{count > 9 ? '9+' : count}</Text>
    </View>
  );
}