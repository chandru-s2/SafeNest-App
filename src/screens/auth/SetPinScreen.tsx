import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUseDevicePin } from '../../app/store/slices/authSlice';
import PinPad from '../../components/PinPad';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import Toast from 'react-native-toast-message';

const SetPinScreen = ({ navigation }: any) => {
  const [mode, setMode] = useState<'SOURCE' | 'CUSTOM'>('SOURCE');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const dispatch = useDispatch();

  const handleDevicePinSelect = () => {
    dispatch(setUseDevicePin(true));
    navigation.navigate('BiometricSetup');
  };

  const handleCustomPinSelect = () => {
    setMode('CUSTOM');
  };

  const handlePinInput = (digit: string) => {
    const currentPin = isConfirming ? confirmPin : pin;
    if (currentPin.length >= 6) return;
    
    if (isConfirming) {
      setConfirmPin(prev => prev + digit);
    } else {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  React.useEffect(() => {
    if (pin.length === 6 && !isConfirming) {
      setTimeout(() => setIsConfirming(true), 300);
    }
    if (confirmPin.length === 6) {
      if (pin === confirmPin) {
        dispatch(setUseDevicePin(false));
        navigation.navigate('BiometricSetup');
      } else {
        Toast.show({ type: 'error', text1: 'Mismatch', text2: "PINs don't match. Try again." });
        setConfirmPin('');
        setPin('');
        setIsConfirming(false);
      }
    }
  }, [pin, confirmPin, isConfirming, dispatch, navigation]);

  if (mode === 'SOURCE') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create your PIN</Text>
        <Text style={styles.subtitle}>You'll use this to open SafeNest</Text>

        <TouchableOpacity style={styles.optionCard} onPress={handleDevicePinSelect}>
          <View style={[styles.iconBox, { borderColor: COLORS.teal }]} />
          <View>
            <Text style={styles.optionTitle}>Use device screen lock PIN</Text>
            <Text style={styles.optionSub}>Uses your phone's existing PIN/pattern</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleCustomPinSelect}>
          <View style={[styles.iconBox, { borderColor: COLORS.blue }]} />
          <View>
            <Text style={styles.optionTitle}>Create my own PIN</Text>
            <Text style={styles.optionSub}>Set a 6-digit PIN just for SafeNest</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isConfirming ? 'Confirm your PIN' : 'Create your PIN'}</Text>
      <Text style={styles.subtitle}>{isConfirming ? 'Re-enter your 6-digit PIN' : 'Enter a new 6-digit PIN'}</Text>

      <View style={styles.indicatorRow}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.dot, (isConfirming ? confirmPin : pin).length > i && styles.dotFilled]} />
        ))}
      </View>

      <View style={styles.padContainer}>
        <PinPad onNumberPress={handlePinInput} onBackspace={handleBackspace} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, color: COLORS.navy, ...FONTS.semibold },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, marginBottom: 40 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: RADIUS.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  iconBox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, marginRight: 16 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.navy },
  optionSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  indicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 60 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.bgGrey },
  dotFilled: { backgroundColor: COLORS.blue },
  padContainer: { marginTop: 'auto', paddingBottom: 40 },
});

export default SetPinScreen;
