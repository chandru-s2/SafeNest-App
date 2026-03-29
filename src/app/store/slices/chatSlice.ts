import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isOpen: boolean;
  sessionId: string;
  unreadCount: number;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  isOpen: false,
  sessionId: '',
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (!state.isOpen) {
        state.unreadCount += 1;
      }
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    toggleChat: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
      if (action.payload) {
        state.unreadCount = 0;
      }
    },
    resetChat: (state) => {
      return initialState;
    },
  },
});

export const { addMessage, setTyping, toggleChat, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
