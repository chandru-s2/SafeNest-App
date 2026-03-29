import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';

const API_URL = 'http://10.0.2.2:3000/v1';

export const authService = {
  sendOtp: async (phoneNumber: string) => {
    try {
      // Mocking the API call for demo purposes because api.safenest.in does not exist
      console.log(`[Mock API] Sending OTP to ${phoneNumber}`);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    try {
      // Mock API verification
      console.log(`[Mock API] Verifying OTP ${otp} for ${phoneNumber}`);
      const authToken = 'mock_auth_token_123';
      const refreshToken = 'mock_refresh_token_456';
      
      // Still store tokens in keychain (mocked)
      // Note: If Keychain throws on emulator, we can ignore or mock it too
      try {
        await Keychain.setGenericPassword(phoneNumber, JSON.stringify({ authToken, refreshToken }), {
          service: 'auth_tokens',
        });
      } catch (e) {
        console.warn('Keychain not available on this emulator/device yet, skipping token storage');
      }
      
      return { success: true, authToken, refreshToken };
    } catch (error) {
      throw new Error('Incorrect OTP');
    }
  },

  addEmail: async (email: string) => {
    try {
      // Mock API for email
      console.log(`[Mock API] Adding email: ${email}`);
      return { success: true, message: 'Email added successfully' };
    } catch (error) {
      throw new Error('Failed to add email');
    }
  },

  savePin: async (pinHash: string, useDevicePin: boolean) => {
    await EncryptedStorage.setItem('pin_config', JSON.stringify({ pinHash, useDevicePin }));
  },

  logout: async () => {
    // Full wipe per requirements
    await Keychain.resetGenericPassword({ service: 'auth_tokens' });
    await Keychain.resetGenericPassword({ service: 'realm_key' });
    await EncryptedStorage.clear();
    // Realm file deletion and state reset handled in slice/app entry
  },
};
