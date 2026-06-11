import { View, ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View 
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${className || ''}`}
      {...props} 
    />
  );
}
