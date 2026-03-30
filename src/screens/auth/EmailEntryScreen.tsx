import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setEmail as setEmailAction } from '../../app/store/slices/authSlice';
import { authService } from '../../services/authService';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import Toast from 'react-native-toast-message';

const EmailEntryScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { phoneNumber } = useSelector((state: RootState) => state.auth);

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      await authService.addEmail(email, phoneNumber);
      dispatch(setEmailAction(email));
      navigation.navigate('SetPin');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to add email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your email</Text>
      <Text style={styles.subtitle}>Used for account recovery and statements</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 24, paddingTop: 80 },
  title: { ...FONTS.semibold, fontSize: 24, color: COLORS.navy },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, marginBottom: 40 },
  input: {
    backgroundColor: COLORS.bgGrey,
    height: 56,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.regular,
  },
  button: {
    backgroundColor: COLORS.blue,
    height: 52,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default EmailEntryScreen;
