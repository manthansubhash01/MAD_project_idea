import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const TOKEN = "authToken";

const NoteEditor = ({ note, onSave }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: "",
  });

  useEffect(() => {
    const loadNoteContent = async () => {
      if (note?._id && note?.folderId) {
        try {
          const token = await AsyncStorage.getItem(TOKEN);
          const response = await fetch(
            `${API_URL}/user/folders/${note.folderId}/notes/${note._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            editor.setContent(data.content || "");
          } else {
            editor.setContent(note?.content || "");
          }
        } catch (error) {
          editor.setContent(note?.content || "");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadNoteContent();
  }, [note?._id]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const screenHeight = Dimensions.get("window").height;
        const keyboardTop = e.endCoordinates.screenY;
        const actualKeyboardHeight = screenHeight - keyboardTop;
        // console.log("Screen height:", screenHeight);
        // console.log("Keyboard top:", keyboardTop);
        // console.log("Actual keyboard height:", actualKeyboardHeight);
        setKeyboardHeight(actualKeyboardHeight);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const saveNote = async () => {
    if (!note?._id) {
      Alert.alert("Error", "Note ID is missing");
      return;
    }

    setIsSaving(true);
    try {
      const content = await editor.getHTML();
      const token = await AsyncStorage.getItem(TOKEN);

      if (!token) {
        Alert.alert(
          "Error",
          "Authentication token not found. Please login again."
        );
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/user/folders/${note.folderId}/notes/${note._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            title: note.title,
          }),
        }
      );

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          "Server returned invalid response. Please check if the backend is running."
        );
      }

      if (!response.ok) {
        throw new Error(data.Error || data.error || "Failed to save note");
      }

      setLastSaved(new Date());
      if (onSave) {
        onSave({ ...note, content });
      }
      Alert.alert("Success", "Note saved successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading note...</Text>
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <View style={styles.editorContainer}>
              <RichText editor={editor} style={styles.richText} />
            </View>
          </KeyboardAvoidingView>

          <View
            style={[
              styles.toolbarContainer,
              keyboardHeight > 0 && {
                transform: [{ translateY: -keyboardHeight }],
              },
            ]}
          >
            <Toolbar editor={editor} style={styles.toolbar} />

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={saveNote}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {lastSaved && (
            <View style={styles.savedIndicator}>
              <Text style={styles.savedText}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  flex: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  richText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  toolbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  toolbar: {
    flex: 1,
    backgroundColor: "transparent",
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#a0c4e8",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  savedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savedText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default NoteEditor;
