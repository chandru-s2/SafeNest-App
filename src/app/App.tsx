import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { store } from './store';
import AppNavigator from '../navigation/AppNavigator';
import { escalationService } from '../services/escalationService';
import { syncService } from '../services/syncService';

const App = () => {
  useEffect(() => {
    // Initialize background services safely — errors must not crash the app
    try {
      escalationService.init();
    } catch (e) {
      console.warn('[App] escalationService.init failed:', e);
    }

    syncService.triggerSync().catch((e) => {
      console.warn('[App] syncService.triggerSync failed:', e);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

