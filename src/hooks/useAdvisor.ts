import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { addMessage, setTyping } from '../app/store/slices/chatSlice';
import { claudeService } from '../services/claudeService';

export const useAdvisor = (currentScreen: string) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);

  const sendMessage = async (content: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMsg));
    dispatch(setTyping(true));

    try {
      const chatHistory = messages
        .slice(-9)
        .map((m) => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content });

      const response = await claudeService.chat(chatHistory, currentScreen);
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.content[0].text,
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(aiMsg));
    } catch (error) {
      console.error('Advisor Chat Error:', error);
    } finally {
      dispatch(setTyping(false));
    }
  };

  return { sendMessage };
};
