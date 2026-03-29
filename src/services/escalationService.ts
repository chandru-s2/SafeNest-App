import BackgroundFetch from 'react-native-background-fetch';
import axios from 'axios';

export const escalationService = {
  init: () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 360, // 6 hours
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Task started:', taskId);
        await escalationService.checkRisk();
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('[BackgroundFetch] Error:', error);
      }
    );
  },

  checkRisk: async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/v1/agents/escalation/analyse');
      const { riskScore, tier } = response.data;
      
      // Trigger alerts based on risk score tiers
      if (riskScore > 70) {
        // L3 escalation
      } else if (riskScore > 40) {
        // L2 escalation
      }
      
      return response.data;
    } catch (error) {
      console.error('Escalation Service Error:', error);
    }
  },
};
