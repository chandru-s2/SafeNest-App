import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/theme';

const OfflineBanner = () => {
  const [slideAnim] = useState(new Animated.Value(-40));

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>You're offline — showing cached data</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 36,
    backgroundColor: COLORS.amber,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  text: { color: '#412402', fontSize: 12, fontWeight: '600' },
});

export default OfflineBanner;
