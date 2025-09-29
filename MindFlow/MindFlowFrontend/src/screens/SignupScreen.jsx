import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const User_Name = 'Name'
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      await AsyncStorage.setItem(User_Name, name)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-jet text-center mb-8">Sign Up</Text>

      <TextInput
        className="h-12 border border-french-gray rounded-xl px-4 mb-4 bg-white text-jet text-base"
        placeholder="Name"
        placeholderTextColor="#b2b6baff"
        value={name}
        onChangeText={setName}
      />

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
        onPress={handleSignup}
      >
        <Text className="text-white font-semibold text-lg">Sign Up</Text>
      </TouchableOpacity>

      <Text className="text-center text-french-gray text-sm">
        Already have an account?{" "}
        <Text
          className="text-golden-gate-bridge font-semibold"
          onPress={() => navigation.replace("Login")}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
};



export default SignupScreen;
