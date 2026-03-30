import api from './api';

export const claudeService = {
  chat: async (messages: any[], currentScreen: string) => {
    try {
      const response = await api.post('/ai/chat', {
        messages,
        currentScreen,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },
};
