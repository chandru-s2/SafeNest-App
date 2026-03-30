import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setPhoneNumber } from '../../app/store/slices/authSlice';
import { authService } from '../../services/authService';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import Toast from 'react-native-toast-message';

const PhoneEntryScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Toast.show({ type: 'error', text1: 'Invalid Number', text2: 'Please enter a 10-digit mobile number' });
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      await authService.sendOtp(fullPhone);
      dispatch(setPhoneNumber(fullPhone));
      navigation.navigate('OTPVerify', { phoneNumber: fullPhone });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed', text2: 'Failed to send OTP. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.logo}>SafeNest</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Enter your mobile number to get started</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing you agree to SafeNest's Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  headerCard: {
    height: 180,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 24, marginTop: 20 },
  title: { ...FONTS.semibold, fontSize: 24, color: COLORS.navy },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, marginBottom: 32 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGrey,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  prefix: { fontSize: 16, color: COLORS.textPrimary, marginRight: 8, ...FONTS.medium },
  input: { flex: 1, fontSize: 16, color: COLORS.textPrimary, ...FONTS.regular },
  button: {
    backgroundColor: COLORS.blue,
    height: 52,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  terms: { fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 24 },
});

export default PhoneEntryScreen;
