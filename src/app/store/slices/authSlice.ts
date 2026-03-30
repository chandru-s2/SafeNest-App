import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  registrationComplete: boolean;
  biometricEnabled: boolean;
  useDevicePin: boolean;
  phoneNumber: string;
  email: string;
  failedPinAttempts: number;
  lockoutUntil: number | null;
  captchaRequired: boolean;
  authToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  registrationComplete: false,
  biometricEnabled: false,
  useDevicePin: false,
  phoneNumber: '',
  email: '',
  failedPinAttempts: 0,
  lockoutUntil: null,
  captchaRequired: false,
  authToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setRegistrationComplete: (state, action: PayloadAction<boolean>) => {
      state.registrationComplete = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setUseDevicePin: (state, action: PayloadAction<boolean>) => {
      state.useDevicePin = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    incrementFailedAttempts: (state) => {
      state.failedPinAttempts += 1;
      if (state.failedPinAttempts >= 3) {
        state.captchaRequired = true;
      }
    },
    resetFailedAttempts: (state) => {
      state.failedPinAttempts = 0;
      state.captchaRequired = false;
    },
    setLockout: (state, action: PayloadAction<number | null>) => {
      state.lockoutUntil = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const {
  setAuthenticated,
  setRegistrationComplete,
  setBiometricEnabled,
  setUseDevicePin,
  setPhoneNumber,
  setEmail,
  incrementFailedAttempts,
  resetFailedAttempts,
  setLockout,
  setAuthToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
