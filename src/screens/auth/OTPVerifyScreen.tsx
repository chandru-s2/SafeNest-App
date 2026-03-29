import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { authService } from '../../services/authService';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import Toast from 'react-native-toast-message';

const OTPVerifyScreen = ({ route, navigation }: any) => {
  const { phoneNumber } = route.params;
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (otp: string) => {
    setLoading(true);
    try {
      await authService.verifyOtp(phoneNumber, otp);
      navigation.navigate('EmailEntry');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Incorrect OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await authService.sendOtp(phoneNumber);
      setTimer(30);
      Toast.show({ type: 'success', text1: 'Sent', text2: 'OTP resent successfully' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed', text2: 'Try again later' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.subtitle}>OTP sent to {phoneNumber}</Text>

      <OtpInput
        numberOfDigits={6}
        onFilled={handleVerify}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.otpBox,
          pinCodeTextStyle: styles.otpText,
          focusedPinCodeContainerStyle: styles.otpBoxActive,
        }}
      />

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive code? </Text>
        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
          <Text style={[styles.resendLink, timer > 0 && { color: COLORS.textLight }]}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, color: COLORS.navy, ...FONTS.semibold },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, marginBottom: 40 },
  otpContainer: { width: '100%', marginBottom: 32 },
  otpBox: { width: 48, height: 56, backgroundColor: COLORS.bgGrey, borderRadius: 8, borderWidth: 0 },
  otpBoxActive: { borderColor: COLORS.blue, borderWidth: 1 },
  otpText: { fontSize: 20, color: COLORS.navy, fontWeight: '600' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  resendText: { fontSize: 14, color: COLORS.textMuted },
  resendLink: { fontSize: 14, color: COLORS.blue, fontWeight: '600' },
  loader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center' },
});

export default OTPVerifyScreen;
