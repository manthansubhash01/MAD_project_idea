import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyNotes from "../components/EmptyNotes";
import CreateFolder from "../components/CreateFolder";
import NotesListScreen from "./NotesListScreen";
import NoteDetailsScreen from "./NoteDetailsScreen";

const Stack = createStackNavigator();
const TOKEN = "authToken";

const FolderListScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN);
        // console.log(token)
        const data = await fetch(
          "https://mad-project-idea.onrender.com/user/folders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await data.json();
        setNotes(result);
        // console.log(result)
      } catch (err) {
        console.log(err);
      }
    };
    loadNotes();
  }, []);

  const createFolder = async (folderName, description) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const res = await fetch(
        "https://mad-project-idea.onrender.com/user/folders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: folderName, description }),
        }
      );

      const newFolder = await res.json();
      setNotes((prev) => [...prev, newFolder]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    // console.log(folderName)
    if (folderName != "") {
      createFolder(folderName, description);
      setModalVisible(false);
      setFolderName("");
      setDescription("");
    }
  };

  return (
    <View className="flex-1 bg-azure">
      {notes.length === 0 ? (
        <EmptyNotes onCreate={createFolder} />
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View className="bg-powderBlue pt-12 pb-6 px-6 rounded-b-3xl mb-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-white">
                    My Folders
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    {notes.length} folder{notes.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-white px-5 py-2.5 rounded-full shadow-md"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="text-powderBlue font-bold text-base">
                    + New
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Folders Grid */}
            <View className="px-4">
              {notes.map((ele, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="bg-white p-5 mb-3 rounded-2xl shadow-md flex-row items-center"
                  onPress={() => navigation.navigate("Folder", { folder: ele })}
                >
                  <View className="bg-azure h-14 w-14 rounded-xl items-center justify-center mr-4">
                    <Text className="text-3xl">📁</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-jet">
                      {ele.name}
                    </Text>
                    {ele.description ? (
                      <Text
                        className="text-french-gray text-sm mt-0.5"
                        numberOfLines={1}
                      >
                        {ele.description}
                      </Text>
                    ) : (
                      <Text className="text-french-gray text-sm mt-0.5">
                        No description
                      </Text>
                    )}
                  </View>
                  <Text className="text-powderBlue text-2xl">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <CreateFolder
            visible={modalVisible}
            folderName={folderName}
            description={description}
            setFolderName={setFolderName}
            setDescription={setDescription}
            onCancel={() => setModalVisible(false)}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </View>
  );
};

const Notes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontWeight: "bold", color: "#3a3a3a" },
        headerTintColor: "#71A5E9",
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Folder List"
        component={FolderListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Folder"
        component={NotesListScreen}
        options={({ route }) => ({ title: route.params.folder.name })}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={{ title: "Note Details" }}
      />
    </Stack.Navigator>
  );
};

export default Notes;
