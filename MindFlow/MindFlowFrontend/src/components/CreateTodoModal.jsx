import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal,TextInput,Button } from 'react-native';
import { Picker } from "@react-native-picker/picker";

const CreateTodo = ({visible,title,description,priority,setTitle,setDescription,setPriority,onCancel,onSubmit}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="w-11/12 bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-2xl font-bold text-jet mb-5 text-center">
            Create New Task
          </Text>

          <TextInput
            placeholder="Title"
            placeholderTextColor="#3a3a3aff"
            className="border border-french-gray rounded-xl px-4 py-3 mb-4 text-jet text-base"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor="#3a3a3aff"
            className="border border-french-gray rounded-xl px-4 py-3 mb-4 text-jet text-base"
            value={description}
            onChangeText={setDescription}
          />

          <View className="mb-5">
            <Text className="text-jet font-semibold mb-2">Select Priority:</Text>
            <View className="border border-french-gray rounded-xl overflow-hidden">
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                className="h-7 w-full text-jet"
              >
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
          </View>

          <View className="flex-row justify-between">

            <TouchableOpacity
              className="flex-1 bg-golden-gate-bridge rounded-full m-2 py-3 items-center"
              onPress={onSubmit}
            >
              <Text className="text-white font-bold text-base">Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-french-gray rounded-full py-3 m-2 items-center"
              onPress={onCancel}
            >
              <Text className="text-black font-semibold text-base">Cancel</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  )
}


export default CreateTodo