import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LockScreen from '../screens/auth/LockScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, registrationComplete } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!registrationComplete ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Lock" component={LockScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
