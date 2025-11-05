import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { navigate } from "../utils/navigation";
import { CommonActions } from '@react-navigation/native';

const API_URL = "https://mad-project-idea.onrender.com/user";
const TOKEN = "authToken";

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword)
      return Alert.alert("Error", "Please fill both fields");
    try {
      const token = await AsyncStorage.getItem(TOKEN);
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
  try {
    const token = await AsyncStorage.getItem(TOKEN);
    const res = await fetch(`${API_URL}/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert("Deleted", data.message);
      // setIsLoggedIn(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } else {
      Alert.alert("Error", data.error);
    }
  } catch (err) {
    console.error(err);
  }
};


  const handleLogout = async () => {
    try {
      const res = await AsyncStorage.removeItem(TOKEN);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    console.log(folderName);
    if (folderName != "") {
      handleChangePassword();
      setModalVisible(false);
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-5xl font-bold mb-10">Profile</Text>

      <View className="flex justify-center items-center mb-10">
        <Image
          className="h-40 w-40 rounded-full border-8 border-golden-gate-bridge"
          source={{
            uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F018%2F765%2F757%2Foriginal%2Fuser-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg&f=1&nofb=1&ipt=cf5dba5af2e2209695e811af2456ae3290e6c830a14e5ccc15e4a8f063fee78e",
          }}
        />
      </View>

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

      <Text className="text-5xl font-bold mb-10">Account</Text>

      <TouchableOpacity
        className="bg-jet py-3 px-4 rounded-lg mt-4 items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-semibold text-lg">
          Change Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-golden-gate-bridge py-3 rounded-xl mt-4 items-center shadow"
        onPress={() => setDeleteModalVisible(true)}
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
        visible={modalVisible}
        oldPassword={oldPassword}
        newPassword={newPassword}
        setOldPassword={setOldPassword}
        setNewPassword={setNewPassword}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />

      <DeleteAccountModal
      visible={deleteModalVisible}
      onCancel={() => setDeleteModalVisible(false)}
      onDelete={() => {
        handleDeleteUser();
        setDeleteModalVisible(false);
      }}/>

    </View>
  );
}
