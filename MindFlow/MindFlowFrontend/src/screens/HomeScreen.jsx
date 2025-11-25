import React, { useEffect, useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notes from "./FolderListScreen";
import ProfileScreen from "./ProfileScreen";
import { greetings } from "../../assets/greetings";
import TodoScreen from "./TodoScreen";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { TodoProvider } from "../contexts/TodoContext";
import { TodoContext } from "../contexts/TodoContext";
import TaskProgressCircle from "../components/TaskProgressCircle";
import CalendarScreen from "./CalenderScreen";

const Drawer = createDrawerNavigator();
const TOKEN = "authToken";
const User_greetings = greetings;
const User_Name = "Name";
const LAST_LOGIN = "lastLogin";
const LAST_GREETING = "lastGreeting";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

async function checkFirstLogin() {
  const today = new Date().toDateString();
  const lastLogin = await AsyncStorage.getItem(LAST_LOGIN);

  if (lastLogin !== today) {
    await AsyncStorage.setItem(LAST_LOGIN, today);
    return true;
  }
  return false;
}

const HomeScreen = ({ navigation }) => {
  const { todos, setTodos, total, setTotal } = useContext(TodoContext);
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedName = await AsyncStorage.getItem(User_Name);
      if (storedName) {
        setName(storedName);
      } else {
        setName("Champ");
      }

      const firstLoginToday = await checkFirstLogin();

      let finalGreeting = "";

      if (firstLoginToday) {
        finalGreeting = await getRandomGreeting(name, true);
      } else {
        const lastGreeting = await AsyncStorage.getItem(LAST_GREETING);
        finalGreeting = lastGreeting
          ? lastGreeting.replace("{name}", name)
          : await getRandomGreeting(name, false);
      }

      setGreeting(finalGreeting);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await AsyncStorage.removeItem(TOKEN);
      navigation.replace("Login");
    } catch (err) {
      console.log(err);
    }
  };

  async function getRandomGreeting(name, isFirstLogin) {
    const time = getTimeOfDay();

    if (isFirstLogin) {
      return User_greetings[time][0].replace("{name}", name);
    }

    const categories = ["motivational", "playful", "neutral"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const pool = greetings[category];
    const lastGreeting = await AsyncStorage.getItem("lastGreeting");

    let newGreeting;
    do {
      newGreeting = pool[Math.floor(Math.random() * pool.length)];
    } while (newGreeting === lastGreeting && pool.length > 1);

    await AsyncStorage.setItem("lastGreeting", newGreeting);

    return newGreeting.replace("{name}", name);
  }

  return (
    <ScrollView
      className="flex-1 bg-azure"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View className="bg-powderBlue pt-12 pb-6 px-6 rounded-b-3xl mb-6">
        <Text className="text-white text-2xl font-bold leading-relaxed">
          {greeting}
        </Text>
        <Text className="text-white/80 text-sm mt-1">
          Welcome back, {name}!
        </Text>
      </View>

      <View className="flex-row gap-3 px-4 mb-6">
        <TouchableOpacity
          className="flex-1 bg-white p-5 rounded-2xl shadow-md"
          onPress={() => navigation.navigate("Tasks")}
        >
          <View className="bg-columbiaBlue h-14 w-14 rounded-xl items-center justify-center mb-3">
            <MaterialIcons name="checklist" size={28} color="white" />
          </View>
          <Text className="text-jet text-3xl font-bold mb-1">
            {todos.length}
          </Text>
          <Text className="text-french-gray text-sm">Pending Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-white p-5 rounded-2xl shadow-md"
          onPress={() => navigation.navigate("Tasks")}
        >
          <View className="bg-azure h-14 w-14 rounded-xl items-center justify-center mb-3">
            <MaterialIcons name="check-circle" size={28} color="#7284BE" />
          </View>
          <Text className="text-jet text-3xl font-bold mb-1">
            {total - todos.length}
          </Text>
          <Text className="text-french-gray text-sm">Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Tasks Card */}
      <View className="mx-4 mb-6">
        <View className="bg-white rounded-2xl p-5 shadow-md">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-jordyBlue h-10 w-10 rounded-xl items-center justify-center mr-3">
                <Text className="text-white text-lg">📅</Text>
              </View>
              <View>
                <Text className="text-jet text-xl font-bold">
                  Today's Focus
                </Text>
                <Text className="text-french-gray text-xs">
                  Your priority tasks
                </Text>
              </View>
            </View>
          </View>

          {todos.length > 0 ? (
            <View className="space-y-2">
              <View className="bg-azure px-4 py-3 rounded-xl">
                <Text className="text-jet font-semibold" numberOfLines={1}>
                  {todos[0].title}
                </Text>
                {todos[0].priority === "high" && (
                  <Text className="text-highText text-xs mt-1">
                    🔴 High Priority
                  </Text>
                )}
              </View>
              {todos.length > 1 && (
                <TouchableOpacity
                  className="bg-azure/50 px-4 py-2 rounded-xl"
                  onPress={() => navigation.navigate("Tasks")}
                >
                  <Text className="text-powderBlue text-sm font-semibold text-center">
                    + {todos.length - 1} more task
                    {todos.length - 1 !== 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="bg-azure px-4 py-6 rounded-xl items-center">
              <Text className="text-2xl mb-2">🎉</Text>
              <Text className="text-jet font-semibold">All caught up!</Text>
              <Text className="text-french-gray text-xs mt-1">
                No pending tasks
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Card */}
      <View className="mx-4 mb-6">
        <View className="bg-white rounded-2xl p-5 shadow-md">
          <View className="flex-row items-center mb-4">
            <View className="bg-powderBlue h-10 w-10 rounded-xl items-center justify-center mr-3">
              <Text className="text-white text-lg">📊</Text>
            </View>
            <View>
              <Text className="text-jet text-xl font-bold">Task Progress</Text>
              <Text className="text-french-gray text-xs">
                Your productivity overview
              </Text>
            </View>
          </View>

          <View className="items-center py-4">
            <TaskProgressCircle
              total={total}
              completed={total - todos.length}
            />
            <View className="flex-row mt-4 justify-around w-full px-4">
              <View className="items-center">
                <Text className="text-jet text-2xl font-bold">{total}</Text>
                <Text className="text-french-gray text-xs">Total</Text>
              </View>
              <View className="items-center">
                <Text className="text-powderBlue text-2xl font-bold">
                  {total - todos.length}
                </Text>
                <Text className="text-french-gray text-xs">Done</Text>
              </View>
              <View className="items-center">
                <Text className="text-columbiaBlue text-2xl font-bold">
                  {todos.length}
                </Text>
                <Text className="text-french-gray text-xs">Pending</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4">
        <Text className="text-jet text-lg font-bold mb-3 px-1">
          Quick Actions
        </Text>
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-2xl shadow-md items-center"
            onPress={() => navigation.navigate("Notes")}
          >
            <View className="bg-azure h-12 w-12 rounded-xl items-center justify-center mb-2">
              <MaterialIcons name="note" size={24} color="#7284BE" />
            </View>
            <Text className="text-jet font-semibold text-sm">Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-2xl shadow-md items-center"
            onPress={() => navigation.navigate("Calendar")}
          >
            <View className="bg-azure h-12 w-12 rounded-xl items-center justify-center mb-2">
              <FontAwesome name="calendar" size={22} color="#7284BE" />
            </View>
            <Text className="text-jet font-semibold text-sm">Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-2xl shadow-md items-center"
            onPress={() => navigation.navigate("Profile")}
          >
            <View className="bg-azure h-12 w-12 rounded-xl items-center justify-center mb-2">
              <Ionicons name="person" size={24} color="#7284BE" />
            </View>
            <Text className="text-jet font-semibold text-sm">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const Main = () => {
  return (
    <TodoProvider>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          headerTintColor: "#8FB9E1",
          drawerActiveTintColor: "#7284BE",
          drawerInactiveTintColor: "#7284BE",
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Notes"
          component={Notes}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="note" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Tasks"
          component={TodoScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="tasks" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </TodoProvider>
  );
};

const styles = StyleSheet.create({
  greetingContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#f0f4f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Main;
