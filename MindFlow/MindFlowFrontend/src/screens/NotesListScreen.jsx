import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateNote from "../components/CreateNotes";

const TOKEN = "authToken";

const NotesListScreen = ({ navigation, route }) => {
  const { folder } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
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

  const renderNote = ({ item }) => (
    <TouchableOpacity
      className="bg-white flex-1 m-2 p-4 rounded-xl border border-gray-200 h-32 justify-center items-center shadow"
      onPress={() => navigation.navigate("NoteDetails", { note: item })}
    >
      <Text
        className="text-center text-lg font-semibold text-jet"
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold text-jet">{folder.name}</Text>
      {folder.description ? (
        <Text className="text-base text-gray-600 mt-2">
          {folder.description}
        </Text>
      ) : null}

      <View className="flex-row justify-between items-center mt-4 mb-2">
        <Text className="text-lg font-bold text-jet">My Notes</Text>
        <TouchableOpacity
          className="bg-powderBlue px-4 py-2 rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-semibold">Create Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        numColumns={2}
        columnWrapperClassName="justify-between"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />

      <CreateNote
        visible={modalVisible}
        title={title}
        setTitle={setTitle}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default NotesListScreen;
