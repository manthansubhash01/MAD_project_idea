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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { navigate } from "../utils/navigation";
import { CommonActions } from "@react-navigation/native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

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
      // console.log(data);
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
            routes: [{ name: "Login" }],
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
          routes: [{ name: "Login" }],
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    // console.log(folderName);
    if (folderName != "") {
      handleChangePassword();
      setModalVisible(false);
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-azure"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Profile */}
      <View className="bg-powderBlue pt-12 pb-8 px-6 rounded-b-3xl">
        <Text className="text-3xl font-bold text-white mb-6">Profile</Text>

        <View className="items-center">
          <View className="relative">
            <Image
              className="h-28 w-28 rounded-full border-4 border-white"
              source={{
                uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F018%2F765%2F757%2Foriginal%2Fuser-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg&f=1&nofb=1&ipt=cf5dba5af2e2209695e811af2456ae3290e6c830a14e5ccc15e4a8f063fee78e",
              }}
            />
            <View className="absolute bottom-0 right-0 bg-white h-8 w-8 rounded-full items-center justify-center border-2 border-powderBlue">
              <Text className="text-powderBlue text-lg">✓</Text>
            </View>
          </View>
          <Text className="text-white text-xl font-bold mt-3">{user.name}</Text>
          <Text className="text-white/90 text-sm mt-1">{user.email}</Text>
        </View>
      </View>

      {/* User Info Cards */}
      <View className="px-6 mt-6">
        <View className="bg-white rounded-2xl p-5 shadow-lg mb-4">
          <Text className="text-jet text-lg font-bold mb-4">
            Personal Information
          </Text>

          <View className="flex-row items-center mb-3 pb-3 border-b border-azure">
            <View className="bg-azure h-10 w-10 rounded-full items-center justify-center mr-3">
              <Text className="text-powderBlue text-lg">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-french-gray text-xs">Full Name</Text>
              <Text className="text-jet text-base font-semibold">
                {user.name}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-azure h-10 w-10 rounded-full items-center justify-center mr-3">
              <Text className="text-powderBlue text-lg">✉️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-french-gray text-xs">Email Address</Text>
              <Text className="text-jet text-base font-semibold">
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <Text className="text-jet text-lg font-bold mb-3 px-1">
          Account Settings
        </Text>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-md flex-row items-center"
          onPress={() => setModalVisible(true)}
        >
          <View className="bg-azure h-12 w-12 rounded-xl items-center justify-center mr-4">
            <Text className="text-powderBlue text-xl">🔐</Text>
          </View>
          <View className="flex-1">
            <Text className="text-jet font-semibold text-base">
              Change Password
            </Text>
            <Text className="text-french-gray text-xs mt-0.5">
              Update your password
            </Text>
          </View>
          <Text className="text-powderBlue text-xl">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-md flex-row items-center"
          onPress={() => setDeleteModalVisible(true)}
        >
          <View className="bg-highBg h-12 w-12 rounded-xl items-center justify-center mr-4">
            <Text className="text-highText text-xl">🗑️</Text>
          </View>
          <View className="flex-1">
            <Text className="text-jet font-semibold text-base">
              Delete Account
            </Text>
            <Text className="text-french-gray text-xs mt-0.5">
              Permanently delete your account
            </Text>
          </View>
          <Text className="text-highText text-xl">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-powderBlue rounded-2xl p-4 shadow-md flex-row items-center justify-center mb-6"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={28} color="#fff" />
          <Text className="text-white text-base font-bold ml-2">Logout</Text>
        </TouchableOpacity>
      </View>

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
        }}
      />
    </ScrollView>
  );
}
