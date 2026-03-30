import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { setBiometricEnabled, setRegistrationComplete, setAuthenticated } from '../../app/store/slices/authSlice';
import { useBiometrics } from '../../hooks/useBiometrics';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const BiometricSetupScreen = () => {
  const dispatch = useDispatch();
  const { authenticate } = useBiometrics();

  const handleEnable = async () => {
    const success = await authenticate('Confirm your biometrics to enable login');
    if (success) {
      dispatch(setBiometricEnabled(true));
      dispatch(setRegistrationComplete(true));
      dispatch(setAuthenticated(true));
    }
  };

  const handleSkip = () => {
    dispatch(setBiometricEnabled(false));
    dispatch(setRegistrationComplete(true));
    dispatch(setAuthenticated(true));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable biometric login</Text>
      <Text style={styles.subtitle}>Use your fingerprint or Face ID to open the app faster</Text>

      <View style={styles.illustration}>
        <Icon name="shield" size={120} color={COLORS.teal} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEnable}>
        <Text style={styles.buttonText}>Enable Biometrics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 24, paddingTop: 100, alignItems: 'center' },
  title: { ...FONTS.semibold, fontSize: 24, color: COLORS.navy, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', marginBottom: 60 },
  illustration: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 100, marginBottom: 80, ...SHADOW.card },
  button: {
    backgroundColor: COLORS.blue,
    width: '100%',
    height: 52,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  skipButton: { marginTop: 24 },
  skipText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
});

export default BiometricSetupScreen;
