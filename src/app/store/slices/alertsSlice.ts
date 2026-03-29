import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  type: 'Fraud' | 'Spending' | 'Tips';
  message: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
  ts: string;
}

interface AlertsState {
  items: Alert[];
  riskScore: number;
  lastAnalyzed: string;
}

const initialState: AlertsState = {
  items: [],
  riskScore: 35,
  lastAnalyzed: new Date().toISOString(),
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.items = action.payload;
    },
    setRiskScore: (state, action: PayloadAction<number>) => {
      state.riskScore = action.payload;
      state.lastAnalyzed = new Date().toISOString();
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.items.find((i) => i.id === action.payload);
      if (alert) {
        alert.read = true;
      }
    },
  },
});

export const { setAlerts, setRiskScore, markAsRead } = alertsSlice.actions;
export default alertsSlice.reducer;
