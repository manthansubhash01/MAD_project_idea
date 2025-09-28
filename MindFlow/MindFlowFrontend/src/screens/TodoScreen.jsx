import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AllTodoScreen from "./AllTodoScreen";
import CompletedTodoScreen from "./CompletedTodoScreen";
import PendingTodoScreen from "./PendingTodoScreen";


const Tab = createBottomTabNavigator()

export default function TodoScreen() {
  return(
        <Tab.Navigator>
            <Tab.Screen name = "All" component={AllTodoScreen} />
            <Tab.Screen name = "Completed" component={CompletedTodoScreen}/>
            <Tab.Screen name = "Pending" component={PendingTodoScreen}/>
        </Tab.Navigator>
  )
}


