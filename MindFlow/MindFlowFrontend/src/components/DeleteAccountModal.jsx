import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://mad-project-idea.onrender.com/user";
const TOKEN = "authToken";

const DeleteAccountModal = ({ visible, onCancel, onDelete }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="w-4/5 bg-white rounded-xl p-5">
          <Text className="text-lg font-bold mb-4 text-black">
            Confirm Delete
          </Text>
          <Text className="text-gray-700 mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </Text>

          <View className="flex-row">
            <TouchableOpacity
              className="bg-powderBlue rounded-3xl px-4 py-3 flex-1 items-center mr-2"
              onPress={onDelete}
            >
              <Text className="text-white font-semibold">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-jet rounded-3xl px-4 py-3 flex-1 items-center ml-2"
              onPress={onCancel}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
