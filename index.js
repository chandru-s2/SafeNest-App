/**
 * @format
 */
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';

// Safely register background fetch (may not be available on all environments)
try {
  const BackgroundFetch = require('react-native-background-fetch').default;
  const { escalationService } = require('./src/services/escalationService');
  const { syncService } = require('./src/services/syncService');

  // Background fetch handler for fraud analysis & syncing
  const backgroundFetchHeadlessTask = async (event) => {
    const taskId = event.taskId;
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

    try {
      await syncService.triggerSync();
      await escalationService.checkRisk();
    } catch (error) {
      console.warn('[BackgroundFetch HeadlessTask] Error:', error);
    }

    BackgroundFetch.finish(taskId);
  };

  // Register the background task (required for Android headless mode)
  BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);
} catch (e) {
  console.warn('[index.js] BackgroundFetch registration failed:', e);
}

AppRegistry.registerComponent(appName, () => App);

