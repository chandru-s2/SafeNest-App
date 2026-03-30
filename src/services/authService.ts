import * as Keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';
import api from './api';

export const authService = {
  sendOtp: async (phoneNumber: string) => {
    try {
      const response = await api.post('/auth/otp/send', { phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    try {
      const response = await api.post('/auth/otp/verify', { phoneNumber, otp });
      const { authToken, refreshToken, user } = response.data;
      
      try {
        await Keychain.setGenericPassword(phoneNumber, JSON.stringify({ authToken, refreshToken }), {
          service: 'auth_tokens',
        });
      } catch (e) {
        console.warn('Keychain storage failed', e);
      }
      
      return { success: true, authToken, refreshToken, user };
    } catch (error) {
      throw new Error('Incorrect OTP');
    }
  },

  addEmail: async (email: string, phoneNumber: string) => {
    try {
      const response = await api.post('/auth/email', { email, phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add email');
    }
  },

  savePin: async (pinHash: string, useDevicePin: boolean) => {
    await EncryptedStorage.setItem('pin_config', JSON.stringify({ pinHash, useDevicePin }));
  },

  logout: async () => {
    await Keychain.resetGenericPassword({ service: 'auth_tokens' });
    await Keychain.resetGenericPassword({ service: 'realm_key' });
    await EncryptedStorage.clear();
  },
};
