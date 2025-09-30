import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import CreateFolder from "./CreateFolder";

const EmptyNotes = ({ onCreate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (folderName.trim() !== "") {
      onCreate(folderName, description);
      setModalVisible(false);
      setFolderName("");
      setDescription("");
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="flex-1 justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <View className="h-80 justify-center items-center bg-white rounded-2xl border border-gray-300 p-4">
          <Image
            className="h-64 w-64"
            source={{
              uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fvector-premium%2Filustracion-reunion_1090712-257.jpg&f=1&nofb=1&ipt=fcdab8ea468e109e3d750a125f0038bf2c5c6b0d835e6222f6505219aa7dba5f",
            }}
          />
          <Text className="mt-5 text-base text-black">
            Nothing to see here, click to get started.
          </Text>
        </View>
      </TouchableOpacity>

      <CreateFolder
        visible={modalVisible}
        folderName={folderName}
        description={description}
        setFolderName={setFolderName}
        setDescription={setDescription}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default EmptyNotes;
