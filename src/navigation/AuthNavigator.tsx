import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import EmailEntryScreen from '../screens/auth/EmailEntryScreen';
import SetPinScreen from '../screens/auth/SetPinScreen';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';
import SplashScreen from '../screens/auth/SplashScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
      <Stack.Screen name="EmailEntry" component={EmailEntryScreen} />
      <Stack.Screen name="SetPin" component={SetPinScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
