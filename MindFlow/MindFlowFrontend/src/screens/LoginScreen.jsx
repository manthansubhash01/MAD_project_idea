import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const TOKEN = "authToken";
const USER = "User";
const LAST_LOGIN = "lastLogin";
const MANUAL_LOGOUT = "manualLogout";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const manualLogout = await AsyncStorage.getItem(MANUAL_LOGOUT);
        if (manualLogout === "true") {
          await AsyncStorage.removeItem(MANUAL_LOGOUT);
          return;
        }

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
    setError("");

    // Validate empty fields
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    // Validate email format
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    // Validate whitespace
    if (email !== email.trim() || password !== password.trim()) {
      setError("Email and password cannot contain leading or trailing spaces");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://mad-project-idea.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        if (res.status === 401 || res.status === 404) {
          setError(
            "Invalid email or password. Please check your credentials or sign up if you don't have an account."
          );
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-powderBlue pt-12 pb-8 px-6 rounded-b-3xl mb-6">
          <View className="items-center">
            <Text className="text-3xl font-bold text-white mb-1">
              Welcome Back
            </Text>
            <Text className="text-white/80 text-sm">Sign in to continue</Text>
          </View>
        </View>

        <View className="px-6 flex-1">
          {error ? (
            <View className="bg-red-100 border border-red-400 rounded-xl p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color="#DC2626"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text className="text-red-700 flex-1">{error}</Text>
              </View>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-jet font-semibold mb-2 ml-1">Email</Text>
            <View className="flex-row items-center bg-white border border-french-gray rounded-xl px-4 h-14">
              <Ionicons name="mail-outline" size={20} color="#71A5E9" />
              <TextInput
                className="flex-1 ml-3 text-jet text-base"
                placeholder="Enter your email"
                placeholderTextColor="#b2b6baff"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-jet font-semibold mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-white border border-french-gray rounded-xl px-4 h-14">
              <Ionicons name="lock-closed-outline" size={20} color="#71A5E9" />
              <TextInput
                className="flex-1 ml-3 text-jet text-base"
                placeholder="Enter your password"
                placeholderTextColor="#b2b6baff"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#71A5E9"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-powderBlue rounded-xl py-4 mb-6 items-center shadow-lg"
            onPress={handleLogin}
            disabled={loading}
            style={{ elevation: 4 }}
          >
            {loading ? (
              <Text className="text-white font-bold text-lg">
                Logging in...
              </Text>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-lg">Log In</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-french-gray text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.replace("Signup")}>
              <Text className="text-powderBlue font-bold text-base">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
