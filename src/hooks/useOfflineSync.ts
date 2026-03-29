import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setOffline } from '../app/store/slices/dashboardSlice';
import { syncService } from '../services/syncService';

export const useOfflineSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = !state.isConnected;
      dispatch(setOffline(isOffline));
      
      if (!isOffline) {
        syncService.triggerSync();
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
