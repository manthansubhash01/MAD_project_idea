import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePasswordModal from "../components/ChangePasswordModal";

const API_URL = "http://localhost:3000/user";
const TOKEN = 'authToken'

export default function ProfileScreen() {
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
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        >
        <Text style={styles.addButtonText}>Change Password</Text>
      </TouchableOpacity>

      <Button title="Delete Account" onPress={handleDeleteUser} color="red" />

      <TouchableOpacity style = {styles.button} onPress={handleLogout}>
        <Text style = {styles.buttonText}>Logout</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5, marginBottom: 10 },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 20 },
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
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
