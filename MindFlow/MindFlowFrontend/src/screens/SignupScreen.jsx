import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const User_Name = "Name";
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    if (
      name !== name.trim() ||
      email !== email.trim() ||
      password !== password.trim()
    ) {
      setError("Fields cannot contain leading or trailing spaces");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!/(?=.*[a-z])/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/(?=.*\d)/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://mad-project-idea.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        if (res.status === 409 || data.error?.includes("already")) {
          setError("This email is already registered. Please login instead.");
        } else {
          setError(data.error || "Signup failed. Please try again.");
        }
        return;
      }

      await AsyncStorage.setItem(User_Name, name.trim());
      alert("✓ Account created successfully! Redirecting to login...");
      navigation.replace("Login");
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
              Create Account
            </Text>
            <Text className="text-white/80 text-sm">Join us today</Text>
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
            <Text className="text-jet font-semibold mb-2 ml-1">Name</Text>
            <View className="flex-row items-center bg-white border border-french-gray rounded-xl px-4 h-14">
              <Ionicons name="person-outline" size={20} color="#71A5E9" />
              <TextInput
                className="flex-1 ml-3 text-jet text-base"
                placeholder="Enter your name"
                placeholderTextColor="#b2b6baff"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

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
                placeholder="Create a password"
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
            onPress={handleSignup}
            disabled={loading}
            style={{ elevation: 4 }}
          >
            {loading ? (
              <Text className="text-white font-bold text-lg">
                Creating Account...
              </Text>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-lg">Sign Up</Text>
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
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text className="text-powderBlue font-bold text-base">
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
