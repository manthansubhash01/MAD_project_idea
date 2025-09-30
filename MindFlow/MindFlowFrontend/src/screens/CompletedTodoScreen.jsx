import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

const API_URL = "http://localhost:3000/user/tasks";
const TOKEN = "authToken";

const CompletedTodoScreen = () => {
  const [todos, setTodos] = useState([]);
  const [total, setTotal] = useState(0);

  async function loadTodos() {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      const data = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await data.json();
      setTotal(result.length);
      setTodos(result.filter((ele) => ele.isCompleted));
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadTodos();
  }, [todos]);

  async function handleDelete(index) {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      const res = await fetch(`${API_URL}/${todos[index]._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("Deleted:", result);

      setTodos((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  }

  return (
    <View>
      <View className="bg-black flex flex-row m-5 rounded-3xl p-10 justify-evenly items-center">
        <View>
          <Text className="text-white text-3xl font-bold">Todo Done</Text>
          <Text className="text-gray-200 text-lg">Keep it up</Text>
        </View>
        <View className="bg-golden-gate-bridge flex flex-row m-5 w-32 h-32 rounded-full justify-center items-center">
          <Text className="text-white text-5xl font-bold">{todos.length}</Text>
          <Text className="text-white text-5xl font-bold">/</Text>
          <Text className="text-white text-5xl font-bold">{total}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {todos.map((ele, index) => {
          return (
            <View
              key={index}
              className="flex-row justify-between items-center bg-french-gray rounded-2xl p-4 my-2 shadow-md"
            >
              <View className="flex-1">
                <Text className="text-black text-lg font-bold">
                  {ele.title}
                </Text>
                <Text className="text-black text-sm mt-1">
                  {ele.description}
                </Text>
              </View>

              <View className="flex-row space-x-2 ml-4">
                <TouchableOpacity
                  className="m-2 px-3 py-1 rounded-xl justify-center items-center"
                  onPress={() => handleDelete(index)}
                >
                  <MaterialIcons name="delete" size={30} color="#3a3a3aff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
  },
  taskContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#dfdfdf",
    borderRadius: 10,
    padding: 10,
    margin: 7,
  },
  text: {
    fontSize: 18,
  },
  checkButton: {
    height: 30,
    width: 30,
    backgroundColor: "lightgreen",
  },
  delete: {
    height: 30,
    width: 30,
    backgroundColor: "red",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CompletedTodoScreen;
