import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'Open' | 'Reviewing' | 'Resolved' | 'Escalated';
  complaintId: string;
  timestamp: string;
}

interface ComplaintsState {
  items: Complaint[];
  loading: boolean;
}

const initialState: ComplaintsState = {
  items: [],
  loading: false,
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setComplaints: (state, action: PayloadAction<Complaint[]>) => {
      state.items = action.payload;
    },
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.items.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setComplaints, addComplaint, setLoading } = complaintsSlice.actions;
export default complaintsSlice.reducer;
