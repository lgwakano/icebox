import { View, Text, Pressable, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface QuickStepperProps extends ViewProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  className?: string;
}

export function QuickStepper({ value, onChange, min = 0, className, ...props }: QuickStepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrement = () => {
    onChange(value + 1);
  };

  return (
    <View className={`flex-row items-center bg-gray-100 rounded-full ${className || ''}`} {...props}>
      <Pressable onPress={handleDecrement} className="p-2">
        <Feather name="minus" size={16} color="black" />
      </Pressable>
      <Text className="px-2 font-medium">{value}</Text>
      <Pressable onPress={handleIncrement} className="p-2">
        <Feather name="plus" size={16} color="black" />
      </Pressable>
    </View>
  );
}
