import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  name: string;
  email: string;
  accountNumber: string;
  settings: {
    fraudAlerts: boolean;
    spendingAlerts: boolean;
    aiTips: boolean;
    balanceVisibility: boolean;
    language: string;
  };
}

const initialState: ProfileState = {
  name: 'Arjun',
  email: '',
  accountNumber: 'XXXX XXXX 1234',
  settings: {
    fraudAlerts: true,
    spendingAlerts: true,
    aiTips: true,
    balanceVisibility: true,
    language: 'English',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    updateSettings: (state, action: PayloadAction<Partial<ProfileState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { updateProfile, updateSettings } = profileSlice.actions;
export default profileSlice.reducer;
