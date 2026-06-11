import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

interface CategoryCardProps {
  name: string;
  itemCount: number;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function CategoryCard({ name, itemCount, icon, color, onPress }: CategoryCardProps) {
  const anim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 5] });
  const rotateX = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '6deg'] });
  const rotateY = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-3deg'] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.97] });

  const borderBottomWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [7, 2] });
  const borderRightWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [4, 1] });
  const shadowOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.08] });
  const shadowOffsetY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 2] });
  const elevation = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 2] });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: '47%', marginBottom: 24 }}  // ← width lives here now
    >
      <Animated.View
        style={{
          width: '100%',            // ← fills the Pressable
          borderRadius: 32,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderWidth: 0.5,
          borderColor: 'rgba(203,213,225,0.8)',
          borderBottomWidth,
          borderRightWidth,
          borderBottomColor: '#94a3b8',
          borderRightColor: '#cbd5e1',
          shadowColor: '#64748b',
          shadowOffset: { width: 0, height: shadowOffsetY as any },
          shadowOpacity: shadowOpacity as any,
          shadowRadius: 15,
          elevation: elevation as any,
          transform: [{ perspective: 600 }, { rotateX }, { rotateY }, { translateY }, { scale }],
        }}
      >
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: `${color}15` }}
        >
          <View className="bg-white rounded-full p-2 shadow-sm">
            <MaterialCommunityIcons name={icon as any} size={32} color={color} />
          </View>
        </View>
        <Text className="text-xl font-bold text-gray-900">{name}</Text>
        <Text className="text-gray-400 text-sm mt-1">{itemCount} items</Text>
      </Animated.View>
    </Pressable>
  );
}