import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";

const CreateEventModal = ({
  visible,
  onClose,
  onSave,
  initialEvent = null,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [duration, setDuration] = useState("1h");

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setDescription(initialEvent.description || "");
      setDate(initialEvent.date || "");
      setHour(initialEvent.hour || "");
      setDuration(initialEvent.duration || "1h");
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [initialEvent, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }
    if (!date) {
      Alert.alert("Error", "Please enter a date");
      return;
    }
    if (!hour) {
      Alert.alert("Error", "Please enter a time");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert(
        "Error",
        "Date must be in format YYYY-MM-DD (e.g., 2025-11-10)"
      );
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      date,
      hour,
      duration,
    };

    if (initialEvent) {
      eventData.id = initialEvent._id || initialEvent.id;
    }

    onSave(eventData);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setHour("");
    setDuration("1h");
    onClose();
  };

  const hours = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];

  const durations = [
    "30min",
    "1h",
    "1.5h",
    "2h",
    "2.5h",
    "3h",
    "4h",
    "5h",
    "6h",
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialEvent ? "Edit Event" : "Create New Event"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Event title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Event description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-11-10"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time *</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}
              >
                {hours.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.chip, hour === h && styles.chipSelected]}
                    onPress={() => setHour(h)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        hour === h && styles.chipTextSelected,
                      ]}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}
              >
                {durations.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, duration === d && styles.chipSelected]}
                    onPress={() => setDuration(d)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        duration === d && styles.chipTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {initialEvent ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    backgroundColor: "#f9f9f9",
  },
  chipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default CreateEventModal;
