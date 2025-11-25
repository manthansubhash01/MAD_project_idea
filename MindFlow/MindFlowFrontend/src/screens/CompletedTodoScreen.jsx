import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { TodoContext } from "../contexts/TodoContext";

const API_URL = "https://mad-project-idea.onrender.com/user/tasks";
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

      setTodos((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-azure"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="bg-powderBlue pt-12 pb-6 px-6 rounded-b-3xl mb-6">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-1">
              Completed
            </Text>
            <Text className="text-white/80 text-sm">
              Keep up the great work!
            </Text>
          </View>
          <View className="bg-white h-20 w-20 rounded-2xl items-center justify-center">
            <Text className="text-powderBlue text-3xl font-bold">
              {todos.length}
            </Text>
            <Text className="text-french-gray text-xs">of {total}</Text>
          </View>
        </View>
      </View>

      <View className="px-4">
        {todos.map((ele, index) => {
          return (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 shadow-md"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-azure h-6 w-6 rounded-full items-center justify-center mr-2">
                      <Ionicons name="checkmark" size={16} color="#7284BE" />
                    </View>
                    <Text className="text-jet text-lg font-bold flex-1">
                      {ele.title}
                    </Text>
                  </View>
                  {ele.priority === "high" ? (
                    <View className="bg-highBg px-3 py-1 rounded-full self-start">
                      <Text className="text-highText text-xs font-semibold">
                        🔴 Urgent
                      </Text>
                    </View>
                  ) : ele.priority === "medium" ? (
                    <View className="bg-mediumBg px-3 py-1 rounded-full self-start">
                      <Text className="text-mediumText text-xs font-semibold">
                        🟡 Important
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-lowBg px-3 py-1 rounded-full self-start">
                      <Text className="text-lowText text-xs font-semibold">
                        🟢 Minor
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  className="bg-highBg h-10 w-10 rounded-xl justify-center items-center"
                  onPress={() => handleDelete(index)}
                >
                  <MaterialIcons name="delete" size={22} color="#F63737" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
