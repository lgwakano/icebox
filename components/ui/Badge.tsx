import { View, Text, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  icon?: keyof typeof Feather.glyphMap;
}

export function Badge({ label, variant = 'default', className, icon, ...props }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'danger': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const variantClass = getVariantStyles();
  const bgClass = variantClass.split(' ')[0];
  const textClass = variantClass.split(' ')[1];

  const iconColor = variant === 'success' ? '#15803d' : variant === 'warning' ? '#a16207' : variant === 'danger' ? '#b91c1c' : '#374151';

  return (
    <View className={`px-2.5 py-1 rounded-full flex-row items-center justify-center ${bgClass} ${className || ''}`} {...props}>
      {icon && <View className="mr-1.5"><Feather name={icon} size={12} color={iconColor} /></View>}
      <Text className={`text-xs font-medium ${textClass}`}>{label}</Text>
    </View>
  );
}
