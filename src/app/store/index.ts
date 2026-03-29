import 'react-native-get-random-values';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import chatReducer from './slices/chatSlice';
import complaintsReducer from './slices/complaintsSlice';
import alertsReducer from './slices/alertsSlice';
import captchaReducer from './slices/captchaSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    chat: chatReducer,
    complaints: complaintsReducer,
    alerts: alertsReducer,
    captcha: captchaReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
