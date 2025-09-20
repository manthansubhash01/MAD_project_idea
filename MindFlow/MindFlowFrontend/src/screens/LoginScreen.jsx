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
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.replace("Signup")}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
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
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#4a90e2",
    fontWeight: "600",
  },
});

export default LoginScreen;
