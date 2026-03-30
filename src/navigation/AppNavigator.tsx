import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LockScreen from '../screens/auth/LockScreen';
import SendMoneyScreen from '../screens/main/SendMoneyScreen';
import StripePaymentScreen from '../screens/main/StripePaymentScreen';
import ReceiveMoneyScreen from '../screens/main/ReceiveMoneyScreen';
import QRScannerScreen from '../screens/main/QRScannerScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';

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
          <Stack.Group>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
            <Stack.Screen name="StripePayment" component={StripePaymentScreen} />
            <Stack.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
