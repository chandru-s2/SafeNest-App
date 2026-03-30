import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { COLORS, FONTS } from '../../constants/theme';

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { registrationComplete } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Small delay to show logo before navigating
    setTimeout(() => {
      navigation.navigate('PhoneEntry');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.logo}>SafeNest</Text>
        <Text style={styles.tagline}>Your Proactive Banking Partner</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy, justifyContent: 'center', alignItems: 'center' },
  logo: { ...FONTS.semibold, fontSize: 48, color: '#FFF' },
  tagline: { fontSize: 14, color: COLORS.blueLight, marginTop: 12, letterSpacing: 1.2 },
});

export default SplashScreen;
