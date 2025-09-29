import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePasswordModal from "../components/ChangePasswordModal";

const API_URL = "http://localhost:3000/user";
const TOKEN = 'authToken'

export default function ProfileScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN)

      const res = await fetch(`${API_URL}/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      console.log(data)
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return Alert.alert("Error", "Please fill both fields");
    try {
      const token = await AsyncStorage.getItem(TOKEN)
      const res = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", data.message);
        setOldPassword("");
        setNewPassword("");
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN)
              const res = await fetch(`${API_URL}/profile`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              const data = await res.json();
              if (res.ok) {
                Alert.alert("Deleted", data.message);
                // logout or login redirect
              } else {
                Alert.alert("Error", data.error);
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    )
  }

  const handleLogout = async() => {
    try{
      const res = await AsyncStorage.removeItem(TOKEN)
      navigation.replace("Login");
    }catch(err){
      console.log(err)
    }
  }


  const handleSubmit = () => {
    console.log(folderName)
    if(folderName != ''){
        handleChangePassword()
        setModalVisible(false)
        setOldPassword("")
        setNewPassword("")
    }
  }

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-5xl font-bold mb-10">Profile</Text>

      <View className="mb-5">
        <View className="flex flex-row">
          <Text className="text-xl font-bold mt-2 text-jet">Name:</Text>
          <Text className="text-lg mt-3 ml-3 text-gray">{user.name}</Text>
        </View>

        <View className="flex flex-row">
          <Text className="text-xl font-bold mt-2 text-jet">Email:</Text>
          <Text className="text-lg mt-3 ml-3 text-gray">{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-jet py-3 px-4 rounded-lg mt-4 items-center"
        onPress={() => setModalVisible(true)}
        >
        <Text className="text-white font-semibold text-lg">Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-golden-gate-bridge py-3 rounded-xl mt-4 items-center shadow"
        onPress={handleDeleteUser}
      >
        <Text className="text-white text-lg font-semibold">Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-jet py-3 rounded-xl mt-4 items-center shadow"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>

      <ChangePasswordModal
        visible = {modalVisible}
        oldPassword = {oldPassword}
        newPassword = {newPassword}
        setOldPassword = {setOldPassword}
        setNewPassword = {setNewPassword}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

