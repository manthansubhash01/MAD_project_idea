import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = "authToken";
const USER = "User";
const LAST_LOGIN = "lastLogin";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(USER);
        if (!data) return;

        const user = JSON.parse(data);
        if (user) {
          setEmail(user.email);
          setPassword(user.password);
          const res = await fetch(
            "https://mad-project-idea.onrender.com/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                password: user.password,
              }),
            }
          );

          if (!res.ok) {
            await AsyncStorage.removeItem(USER);
            return;
          }

          const responseText = await res.text();
          if (!responseText) {
            await AsyncStorage.removeItem(USER);
            return;
          }

          const result = JSON.parse(responseText);

          if (result.token) {
            await AsyncStorage.setItem(TOKEN, result.token);
            await AsyncStorage.setItem(LAST_LOGIN, new Date().toDateString());
            navigation.replace("Dashboard");
          } else {
            await AsyncStorage.removeItem(USER);
          }
        }
      } catch (err) {
        console.log("Auto-login error:", err);
        await AsyncStorage.removeItem(USER);
      }
    };
    loadData();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://mad-project-idea.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert(data.error || "Login failed. Please check your credentials.");
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem(TOKEN, data.token);
        await AsyncStorage.setItem(USER, JSON.stringify({ email, password }));
        await AsyncStorage.setItem(LAST_LOGIN, new Date().toDateString());
        navigation.replace("Dashboard");
      } else {
        alert("Login failed. No token received.");
      }
    } catch (err) {
      console.log(err);
      alert("Network error. Please check your connection.");
    }
  };

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
        className="bg-powderBlue rounded-xl py-3 mb-4 items-center shadow-md"
        onPress={handleLogin}
      >
        <Text className="text-white font-semibold text-lg">Log In</Text>
      </TouchableOpacity>

      <Text className="text-center text-french-gray text-sm">
        Don’t have an account?{" "}
        <Text
          className="text-powderBlue font-semibold"
          onPress={() => navigation.replace("Signup")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
