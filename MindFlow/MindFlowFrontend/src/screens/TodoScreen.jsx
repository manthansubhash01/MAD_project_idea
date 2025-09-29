import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AllTodoScreen from "./AllTodoScreen";
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
          if (route.name === "All") {
            return <Ionicons name="list" size={size} color={color} />;
          } else if (route.name === "Completed") {
            return (
              <MaterialIcons name="check-circle" size={size} color={color} />
            );
          } else if (route.name === "Pending") {
            return <FontAwesome name="clock-o" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#f04a00ff",
        tabBarInactiveTintColor: "#3a3a3aff",
      })}
    >
      <Tab.Screen name="All" component={AllTodoScreen} />
      <Tab.Screen name="Completed" component={CompletedTodoScreen} />
      <Tab.Screen name="Pending" component={PendingTodoScreen} />
    </Tab.Navigator>
  );
}
