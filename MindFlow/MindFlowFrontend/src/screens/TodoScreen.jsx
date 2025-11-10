import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import CompletedTodoScreen from "./CompletedTodoScreen";
import PendingTodoScreen from "./PendingTodoScreen";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TodoScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Pending") {
            return <FontAwesome name="clock-o" size={size} color={color} />;
          } else if (route.name === "Completed") {
            return (
              <MaterialIcons name="check-circle" size={size} color={color} />
            );
          }
        },
        tabBarActiveTintColor: "#7284BE",
        tabBarInactiveTintColor: "#3a3a3aff",
      })}
    >
      <Tab.Screen name="Pending" component={PendingTodoScreen} />
      <Tab.Screen name="Completed" component={CompletedTodoScreen} />
      
    </Tab.Navigator>
  );
}
