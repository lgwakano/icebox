import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {
  const rotationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotationAnimation, {
          toValue: 25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 4 }
    ).start();
  }, []);

  const rotate = rotationAnimation.interpolate({
    inputRange: [0, 25],
    outputRange: ['0deg', '25deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
