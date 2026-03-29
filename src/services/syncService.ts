import axios from 'axios';
import { getRealm, SyncQueue } from './localCache';

export const syncService = {
  triggerSync: async () => {
    const realm = await getRealm();
    const queue = realm.objects(SyncQueue).sorted('createdAt');

    for (const item of queue) {
      try {
        const payload = JSON.parse(item.payload);
        const response = await syncService.processItem(item.opType, payload);
        
        if (response.status === 200 || response.status === 201) {
          realm.write(() => {
            realm.delete(item);
          });
        }
      } catch (error: any) {
        console.error('Sync Error:', error);
        // Implement exponential backoff retry logic if needed
        break; 
      }
    }
  },

  processItem: async (type: string, payload: any) => {
    switch (type) {
      case 'complaint':
        return await axios.post('http://10.0.2.2:3000/v1/complaints', payload);
      case 'profile_update':
        return await axios.put('http://10.0.2.2:3000/v1/profile', payload);
      default:
        throw new Error('Unknown sync operation');
    }
  },

  addToQueue: async (type: string, payload: any) => {
    const realm = await getRealm();
    realm.write(() => {
      realm.create('SyncQueue', {
        opId: Math.random().toString(36).substr(2, 9),
        opType: type,
        payload: JSON.stringify(payload),
        createdAt: new Date(),
      });
    });
  },
};
