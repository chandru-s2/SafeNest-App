import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setAuthenticated, incrementFailedAttempts } from '../../app/store/slices/authSlice';
import PinPad from '../../components/PinPad';
import { useBiometrics } from '../../hooks/useBiometrics';
import { COLORS, FONTS } from '../../constants/theme';
import { maskPhoneNumber } from '../../utils/formatters';

const LockScreen = () => {
  const [pin, setPin] = useState('');
  const dispatch = useDispatch();
  const { biometricEnabled, phoneNumber } = useSelector((state: RootState) => state.auth);
  const { authenticate } = useBiometrics();
  const shakeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (biometricEnabled) {
      handleBiometricAuth();
    }
  }, []);

  const handleBiometricAuth = async () => {
    const success = await authenticate('Unlock SafeNest');
    if (success) {
      dispatch(setAuthenticated(true));
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const verifyPin = (inputPin: string) => {
    // In real app, hash and compare. For demo, check if it matches storage hash
    if (inputPin === '123456') { // Mock check
      dispatch(setAuthenticated(true));
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      dispatch(incrementFailedAttempts());
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logo}>SafeNest</Text>
        <Text style={styles.welcome}>Welcome back, Arjun</Text>
        <Text style={styles.phone}>{maskPhoneNumber(phoneNumber)}</Text>
      </View>

      <Animated.View style={[styles.indicatorRow, { transform: [{ translateX: shakeAnim }] }]}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
        ))}
      </Animated.View>

      <View style={styles.padContainer}>
        <PinPad onNumberPress={handlePinInput} onBackspace={() => setPin(pin.slice(0, -1))} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy, padding: 24, justifyContent: 'space-between' },
  topSection: { alignItems: 'center', marginTop: 80 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  welcome: { fontSize: 18, color: '#FFF', ...FONTS.semibold },
  phone: { fontSize: 13, color: COLORS.blueLight, marginTop: 4 },
  indicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotFilled: { backgroundColor: COLORS.blueLight },
  padContainer: { paddingBottom: 40 },
});

export default LockScreen;
