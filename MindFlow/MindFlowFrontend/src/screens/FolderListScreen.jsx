import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import EmptyNotes from "../components/EmptyNotes";
import CreateFolder from "../components/CreateFolder";
import RenameFolderModal from "../components/RenameFolderModal";
import NotesListScreen from "./NotesListScreen";
import NoteDetailsScreen from "./NoteDetailsScreen";

const Stack = createStackNavigator();
const TOKEN = "authToken";

const FolderListScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
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

  const handleRenameFolder = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const response = await fetch(
        `https://mad-project-idea.onrender.com/user/folders/${selectedFolder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedFolder = await response.json();
        setNotes((prev) =>
          prev.map((folder) =>
            folder._id === selectedFolder._id ? updatedFolder : folder
          )
        );
        Alert.alert("Success", "Folder renamed successfully");
      } else {
        Alert.alert("Error", "Failed to rename folder");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred");
    }
    setRenameModalVisible(false);
    setSelectedFolder(null);
  };

  const handleDeleteFolder = (folder) => {
    Alert.alert(
      "Delete Folder",
      `Are you sure you want to delete "${folder.name}"? All notes inside will be deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN);
              const response = await fetch(
                `https://mad-project-idea.onrender.com/user/folders/${folder._id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.ok) {
                setNotes((prev) => prev.filter((f) => f._id !== folder._id));
                Alert.alert("Success", "Folder deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete folder");
              }
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "An error occurred");
            }
          },
        },
      ]
    );
    setMenuVisible(null);
  };

  const openMenu = (folder) => {
    setSelectedFolder(folder);
    setMenuVisible(folder._id);
  };

  const closeMenu = () => {
    setMenuVisible(null);
    setSelectedFolder(null);
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
                <View key={idx} className="mb-3">
                  <TouchableOpacity
                    className="bg-white p-5 rounded-2xl shadow-md flex-row items-center"
                    onPress={() =>
                      navigation.navigate("Folder", { folder: ele })
                    }
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
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => openMenu(ele)}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={24}
                        color="#71A5E9"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {/* Menu Modal */}
                  {menuVisible === ele._id && (
                    <Modal
                      transparent={true}
                      visible={menuVisible === ele._id}
                      animationType="fade"
                      onRequestClose={closeMenu}
                    >
                      <TouchableOpacity
                        style={styles.menuOverlay}
                        activeOpacity={1}
                        onPress={closeMenu}
                      >
                        <View style={styles.menuContainer}>
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                              closeMenu();
                              setRenameModalVisible(true);
                            }}
                          >
                            <Ionicons
                              name="create-outline"
                              size={20}
                              color="#333"
                            />
                            <Text style={styles.menuText}>Rename</Text>
                          </TouchableOpacity>
                          <View style={styles.menuDivider} />
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleDeleteFolder(ele)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color="#ff3b30"
                            />
                            <Text
                              style={[styles.menuText, { color: "#ff3b30" }]}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  )}
                </View>
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

          <RenameFolderModal
            visible={renameModalVisible}
            folder={selectedFolder}
            onClose={() => {
              setRenameModalVisible(false);
              setSelectedFolder(null);
            }}
            onSave={handleRenameFolder}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
});

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
