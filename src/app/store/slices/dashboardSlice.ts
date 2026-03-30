import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  merchant: string;
  ts: string;
  status: string;
  category?: string;
  referenceId?: string;
  accountType?: string;
}

interface DashboardState {
  balance: {
    savings: number;
    current: number;
  };
  transactions: Transaction[];
  isOffline: boolean;
}

const initialState: DashboardState = {
  balance: {
    savings: 0,
    current: 0,
  },
  transactions: [],
  isOffline: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ savings: number; current: number }>) => {
      state.balance = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setBalance, setTransactions, setOffline } = dashboardSlice.actions;
export default dashboardSlice.reducer;
