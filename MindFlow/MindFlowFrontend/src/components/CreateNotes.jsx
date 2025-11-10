import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';

const CreateNote = ({ visible, title, setTitle, onCancel, onSubmit }) => {
  return (
     <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="w-4/5 bg-white rounded-xl p-5">
          <Text className="text-lg font-bold mb-4 text-jet text-center">
            Create New Note
          </Text>

          <TextInput
            className="border border-french-gray rounded-lg p-3 mb-4 text-jet"
            placeholder="Note title"
            placeholderTextColor="#3a3a3aff"
            value={title}
            onChangeText={setTitle}
          />

          <View className="flex-row">
            <TouchableOpacity
              className="bg-powderBlue rounded-3xl px-3 py-3 flex-1 mr-2 items-center"
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

export default CreateNote;