import React,{useEffect, useState} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notes from './FolderListScreen';
import ProfileScreen from './ProfileScreen';
import { greetings } from '../../assets/greetings';

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
  const today = new Date().toDateString(); // "Sat Sep 20 2025"
  const lastLogin = await AsyncStorage.getItem(LAST_LOGIN);

  if (lastLogin !== today) {
    await AsyncStorage.setItem(LAST_LOGIN, today);
    return true;
  }
  return false;
}

const HomeScreen = ({navigation}) => {
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
        <View style = {styles.greetingContainer}>
          <Text style = {styles.greetingText}>{greeting}</Text>
        </View>
        <TouchableOpacity style = {styles.button} onPress={handleLogout}>
          <Text style = {styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </View>
  )
}

const Main = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name = "Home" component={HomeScreen} ></Drawer.Screen>
      <Drawer.Screen name = "Notes" component={Notes}></Drawer.Screen>
      <Drawer.Screen name = "Profile" component={ProfileScreen}></Drawer.Screen>
    </Drawer.Navigator>
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