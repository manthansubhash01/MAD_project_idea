import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/utils/navigation';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import "./global.css"

const Stack = createStackNavigator()

export default function App() {
  return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name = "Dashboard" component={Main} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
          <Stack.Screen name = "Signup" component={SignupScreen} options={{ headerLeft: () => null, gestureEnabled: false }}></Stack.Screen>
          <Stack.Screen name = "Login" component={LoginScreen} options={{ headerLeft: () => null, gestureEnabled: false }}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

