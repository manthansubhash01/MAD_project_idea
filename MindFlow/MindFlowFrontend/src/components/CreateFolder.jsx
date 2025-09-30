import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal,TextInput,Button } from 'react-native';

const CreateFolder = ({visible,folderName,description,setFolderName,setDescription,onCancel,onSubmit}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="w-4/5 bg-white rounded-xl p-5">
          <Text className="text-lg font-bold mb-4 text-jet text-center">
            Create New Folder
          </Text>

          <TextInput
            className="border border-french-gray rounded-lg p-3 mb-3 text-jet"
            placeholder="Folder Name"
            placeholderTextColor="#3a3a3aff"
            value={folderName}
            onChangeText={setFolderName}
          />

          <TextInput
            className="border border-french-gray rounded-lg p-3 mb-4 text-jet"
            placeholder="Description (optional)"
            placeholderTextColor="#3a3a3aff"
            value={description}
            onChangeText={setDescription}
          />

          <View className="flex-row">
            <TouchableOpacity
              className="bg-golden-gate-bridge rounded-3xl px-3 py-3 flex-1 mr-2 items-center"
              onPress={onSubmit}
            >
              <Text className="text-white font-semibold">Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-jet rounded-3xl px-3 py-3 flex-1 ml-2 items-center"
              onPress={onCancel}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

  )
}

export default CreateFolder