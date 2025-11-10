import React,{useEffect, useState, useContext} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notes from './FolderListScreen';
import ProfileScreen from './ProfileScreen';
import { greetings } from '../../assets/greetings';
import TodoScreen from './TodoScreen';
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { TodoProvider } from '../contexts/TodoContext';
import { TodoContext } from '../contexts/TodoContext';
import TaskProgressCircle from '../components/TaskProgressCircle';
import CalendarScreen from "./CalenderScreen"

const Drawer = createDrawerNavigator()
const TOKEN = 'authToken'
const User_greetings = greetings
const User_Name = 'Name'
const LAST_LOGIN = 'lastLogin'
const LAST_GREETING = 'lastGreeting';

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

const HomeScreen = ({navigation}) => {
  const {todos, setTodos,total, setTotal} = useContext(TodoContext)
  const [name,setName] = useState('')
  const [greeting , setGreeting] = useState('')

  useEffect(() => {
    const loadData = async() => {
      const storedName = await AsyncStorage.getItem(User_Name)
      if (storedName){
        setName(storedName)
      }else{
        setName('Champ')
      }

      const firstLoginToday = await checkFirstLogin();

      let finalGreeting = '';

      if (firstLoginToday) {
        finalGreeting = await getRandomGreeting(name, true);
      } else {
        const lastGreeting = await AsyncStorage.getItem(LAST_GREETING);
        finalGreeting = lastGreeting ? lastGreeting.replace("{name}", name) : await getRandomGreeting(name, false);
      }

      setGreeting(finalGreeting);
    }
    loadData()
  },[])

  const handleLogout = async() => {
    try{
      const res = await AsyncStorage.removeItem(TOKEN)
      navigation.replace("Login");
    }catch(err){
      console.log(err)
    }
  }

  async function getRandomGreeting(name, isFirstLogin){
    const time = getTimeOfDay()

    if(isFirstLogin){
      return User_greetings[time][0].replace("{name}", name)
    }

    const categories = ["motivational", "playful", "neutral"]
    const category = categories[Math.floor(Math.random() * categories.length)]

    const pool = greetings[category]
    const lastGreeting = await AsyncStorage.getItem('lastGreeting')

    let newGreeting
    do {
      newGreeting = pool[Math.floor(Math.random() * pool.length)]
    } while (newGreeting === lastGreeting && pool.length > 1)

    await AsyncStorage.setItem('lastGreeting', newGreeting)

    return newGreeting.replace('{name}', name)
  }


  return (
    <View>
        <View className="p-5 m-4 mb-2 rounded-3xl bg-powderBlue">
          <Text className="text-white text-xl font-semibold">{greeting}</Text>
        </View>

        <View className="flex flex-row gap-2 px-5">
          <View className="flex-[2] h-48 p-5 rounded-3xl bg-columbiaBlue justify-normal">
            <MaterialIcons name="checklist" size={52} color="white" />
            <Text className="text-white text-xl mt-3">{todos.length} Tasks</Text>
            <Text className="text-white font-bold text-2xl">To do List</Text>
          </View>

          <View className="flex-[3] h-48 p-5 rounded-3xl bg-jordyBlue">
            <Text className="text-white font-bold text-2xl">Today</Text>
            <Text className="text-white text-xl">Tasks</Text>
            <Text className="text-white text-lg mt-2">{todos.length !== 0 ? `1. ${todos[0].title}` : "Nothing to do"}</Text>
            <Text className="text-white text-lg mt-1">   ... {todos.length == 0 ? 0 : todos.length-1} more</Text>
          </View> 
        </View>

        <View className = "flex flex-row gap-2 mt-10">
          <View className="p-5 rounded-3xl items-center">
            <TaskProgressCircle total={total} completed={total-todos.length}/>
            <Text className="text-jet mt-3 text-xl font-semibold">Task Progress</Text>
          </View>
          <View className="">
            <Image source={require("../../assets/9175151-removebg-preview(1).png")}
            style={{ width: 150, height: 150}} className="mt-5"/>
          </View>
        </View>

    </View>
  )
}

const Main = () => {
  return (
    <TodoProvider>
    <Drawer.Navigator
    screenOptions={{
        headerShown: true, 
        headerTintColor: "#8FB9E1",
        drawerActiveTintColor: "#71A5E9",
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
  )
}

const styles = StyleSheet.create({
  greetingContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#f0f4f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    alignItems: 'flex-start',  
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a', 
    textAlign : 'center'
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
  }
})

export default Main