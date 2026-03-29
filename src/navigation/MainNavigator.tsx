import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/main/HomeScreen';
import ComplaintsScreen from '../screens/main/ComplaintsScreen';
import AlertsScreen from '../screens/main/AlertsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import FloatingAdvisor from '../components/FloatingAdvisor';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.blue,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Complaints') iconName = 'file-text';
            else if (route.name === 'Alerts') iconName = 'bell';
            else if (route.name === 'Profile') iconName = 'user';
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Complaints" component={ComplaintsScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <FloatingAdvisor />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E8EDF5',
    height: 64,
    paddingBottom: 8,
  },
});

export default MainNavigator;
