import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CaptchaState {
  token: string | null;
  expiresAt: number | null;
  isValid: boolean;
}

const initialState: CaptchaState = {
  token: null,
  expiresAt: null,
  isValid: false,
};

const captchaSlice = createSlice({
  name: 'captcha',
  initialState,
  reducers: {
    setCaptchaToken: (state, action: PayloadAction<{ token: string; expiresIn: number }>) => {
      state.token = action.payload.token;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      state.isValid = true;
    },
    clearCaptchaToken: (state) => {
      state.token = null;
      state.expiresAt = null;
      state.isValid = false;
    },
  },
});

export const { setCaptchaToken, clearCaptchaToken } = captchaSlice.actions;
export default captchaSlice.reducer;
