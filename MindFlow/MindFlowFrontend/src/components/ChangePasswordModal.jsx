import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://mad-project-idea.onrender.com/user";
const TOKEN = "authToken";

const ChangePasswordModal = ({
  visible,
  oldPassword,
  newPassword,
  setOldPassword,
  setNewPassword,
  onCancel,
  onSubmit,
}) => {
  
  return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="w-4/5 bg-white rounded-xl p-5">
            <Text className="text-lg font-bold mb-4 text-black">Change Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <View className="flex-row">
              <TouchableOpacity className="bg-golden-gate-bridge rounded-3xl px-2 py-2 flex-1 ml-2 items-center"
               onPress={onSubmit}>
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-jet rounded-3xl px-3 py-3 flex-1 ml-2 items-center"
               onPress={onCancel}>
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
};

export default ChangePasswordModal;
