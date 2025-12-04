import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import CreateNote from "../components/CreateNotes";
import RenameNoteModal from "../components/RenameNoteModal";

const TOKEN = "authToken";

const NotesListScreen = ({ navigation, route }) => {
  const { folder } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      console.log("Loading notes for folder:", folder._id);

      const response = await fetch(
        `https://mad-project-idea.onrender.com/user/folders/${folder._id}/notes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        setNotes([]);
        return;
      }

      const result = await response.json();
      console.log("Notes received:", JSON.stringify(result, null, 2));
      console.log("Number of notes:", result?.length || 0);

      setNotes(Array.isArray(result) ? result : []);
    } catch (err) {
      console.log("Error loading notes:", err.message);
      setNotes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [folder._id])
  );

  const createNote = async (title) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const res = await fetch(
        `https://mad-project-idea.onrender.com/user/folders/${folder._id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title }),
        }
      );

      const newNote = await res.json();

      if (newNote && newNote._id) {
        setNotes((prev) => [...(Array.isArray(prev) ? prev : []), newNote]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (title.trim() !== "") {
      createNote(title);
      setModalVisible(false);
      setTitle("");
    }
  };

  const handleRenameNote = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const response = await fetch(
        `https://mad-project-idea.onrender.com/user/folders/${folder._id}/notes/${selectedNote._id}`,
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
        const updatedNote = await response.json();
        setNotes((prev) =>
          prev.map((note) =>
            note._id === selectedNote._id ? updatedNote : note
          )
        );
        Alert.alert("Success", "Note renamed successfully");
      } else {
        Alert.alert("Error", "Failed to rename note");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred");
    }
    setRenameModalVisible(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (note) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN);
              const response = await fetch(
                `https://mad-project-idea.onrender.com/user/folders/${folder._id}/notes/${note._id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.ok) {
                setNotes((prev) => prev.filter((n) => n._id !== note._id));
                Alert.alert("Success", "Note deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete note");
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

  const openMenu = (note) => {
    setSelectedNote(note);
    setMenuVisible(note._id);
  };

  const closeMenu = () => {
    setMenuVisible(null);
    setSelectedNote(null);
  };

  const renderNote = ({ item }) => (
    <View className="flex-1 m-1">
      <TouchableOpacity
        className="bg-white p-4 rounded-2xl h-28 justify-between shadow-md"
        onPress={() => navigation.navigate("NoteDetails", { note: item })}
      >
        <View className="flex-row justify-between items-start">
          <View className="bg-azure h-8 w-8 rounded-lg items-center justify-center">
            <Text className="text-lg">📝</Text>
          </View>
          <TouchableOpacity className="p-1" onPress={() => openMenu(item)}>
            <Ionicons name="ellipsis-vertical" size={18} color="#71A5E9" />
          </TouchableOpacity>
        </View>
        <Text className="text-base font-semibold text-jet" numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>

      {menuVisible === item._id && (
        <Modal
          transparent={true}
          visible={menuVisible === item._id}
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
                <Ionicons name="create-outline" size={20} color="#333" />
                <Text style={styles.menuText}>Rename</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleDeleteNote(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                <Text style={[styles.menuText, { color: "#ff3b30" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-azure">
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        numColumns={2}
        columnWrapperClassName="justify-between"
        contentContainerStyle={{
          paddingVertical: 10,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        ListHeaderComponent={
          <View
            className="bg-white mb-2 p-5 rounded-2xl shadow-md"
            style={{ marginHorizontal: 4 }}
          >
            <View className="flex-row items-center mb-2">
              <View className="bg-azure h-12 w-12 rounded-xl items-center justify-center mr-3">
                <Text className="text-2xl">📁</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-jet">
                  {folder.name}
                </Text>
                <Text className="text-french-gray text-xs">
                  {notes.length} note{notes.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-powderBlue px-4 py-2 rounded-full"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white font-semibold text-sm">+ Add</Text>
              </TouchableOpacity>
            </View>
            {folder.description ? (
              <Text className="text-french-gray text-sm mt-1">
                {folder.description}
              </Text>
            ) : null}
          </View>
        }
      />

      <CreateNote
        visible={modalVisible}
        title={title}
        setTitle={setTitle}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />

      <RenameNoteModal
        visible={renameModalVisible}
        note={selectedNote}
        onClose={() => {
          setRenameModalVisible(false);
          setSelectedNote(null);
        }}
        onSave={handleRenameNote}
      />
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

export default NotesListScreen;
