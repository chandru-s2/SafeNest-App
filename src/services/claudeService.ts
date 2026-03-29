import axios from 'axios';

const ANTHROPIC_API_KEY = 'YOUR_API_KEY'; // Should be from .env in production

export const claudeService = {
  chat: async (messages: any[], currentScreen: string) => {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 500,
          system: `You are SafeNest's Customer Advisor, an intelligent banking assistant for Indian retail bank customers.
          User is currently on the ${currentScreen} screen.
          Rules:
          - Always respond in simple, friendly English under 3 sentences unless asked for detail.
          - NEVER fabricate account numbers, balances, or transaction details.
          - For account data: call the appropriate tool and say "Let me check that for you".
          - For complaints: offer to raise a complaint and generate a complaint ID.
          - For fraud: immediately say "I'm flagging this as urgent" and trigger escalation.
          - Be conversational, warm, and reassuring.`,
          messages,
          tools: [
            { name: 'get_account_summary', description: 'Get user account balance and summary' },
            { name: 'get_recent_transactions', description: 'Get last N transactions' },
            { name: 'initiate_complaint', description: 'File a complaint and return complaint ID' },
            { name: 'check_spending_summary', description: 'Get this month spending breakdown' },
            { name: 'flag_suspicious_activity', description: 'Escalate fraud concern to L2/L3' },
          ],
        },
        {
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  },
};
