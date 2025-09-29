import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = 'authToken'
const USER  = 'User'
const LAST_LOGIN = 'lastLogin'
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadData = async() => {
      try{
        const data = await AsyncStorage.getItem(USER)
        const user = JSON.parse(data)
        if(user){
          setEmail(user.email)
          setPassword(user.password)
          const res = await fetch('http://localhost:3000/auth/login',{
            method : 'POST',
            headers : { "Content-Type": "application/json" },
            body : JSON.stringify({email, password})
          })
          const result = await res.json()
          console.log(result)
          await AsyncStorage.setItem(TOKEN, result.token)
          await AsyncStorage.setItem(LAST_LOGIN, new Date().toDateString())
          
          navigation.replace("Dashboard");
        }
      }catch(err){

      }
    }
    loadData()

  },[])

  const handleLogin = async () => {
    try{
        const res = await fetch('http://localhost:3000/auth/login',{
            method : 'POST',
            headers : { "Content-Type": "application/json" },
            body : JSON.stringify({email, password})
        })
        const data = await res.json()
        console.log(data)
        await AsyncStorage.setItem(TOKEN, data.token)
        await AsyncStorage.setItem(USER, JSON.stringify({email , password}))
        await AsyncStorage.setItem(LAST_LOGIN, new Date().toDateString())
        
        navigation.replace("Dashboard");
    }catch(err){
        console.log(err)
    }
  }

  return (
     <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-jet text-center mb-2">
        Welcome Back
      </Text>
      <Text className="text-base text-french-gray text-center mb-8">
        Log in to continue
      </Text>

      <TextInput
        className="h-12 border border-french-gray rounded-xl px-4 mb-4 bg-white text-jet text-base"
        placeholder="Email"
        placeholderTextColor="#b2b6baff"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="h-12 border border-french-gray rounded-xl px-4 mb-6 bg-white text-jet text-base"
        placeholder="Password"
        placeholderTextColor="#b2b6baff"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-golden-gate-bridge rounded-xl py-3 mb-4 items-center shadow-md"
        onPress={handleLogin}
      >
        <Text className="text-white font-semibold text-lg">Log In</Text>
      </TouchableOpacity>

      <Text className="text-center text-french-gray text-sm">
        Don’t have an account?{" "}
        <Text
          className="text-golden-gate-bridge font-semibold"
          onPress={() => navigation.replace("Signup")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};



export default LoginScreen;
