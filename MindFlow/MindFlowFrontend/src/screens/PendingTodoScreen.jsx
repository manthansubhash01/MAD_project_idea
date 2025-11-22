import React, { useEffect, useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTodo from "../components/CreateTodoModal";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { TodoContext } from "../contexts/TodoContext";

const API_URL = "https://mad-project-idea.onrender.com/user/tasks";
const TOKEN = "authToken";

const PendingTodoScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const { todos, setTodos } = useContext(TodoContext);
  // const [todos, setTodos] = useState([])

  // async function loadTodos(){
  //     try{
  //         const token = await AsyncStorage.getItem(TOKEN)

  //         const data = await fetch(API_URL,{
  //             headers: { "Authorization": `Bearer ${token}` }
  //         })
  //         const result = await data.json()
  //         setTodos(result.filter((ele) => !ele.isCompleted))
  //         console.log(result)
  //     }catch(err){
  //         console.log(err)
  //     }
  // }

  // useEffect(() => {
  //     loadTodos()
  // },[todos])

  const createTask = async (title, description, priority) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          isCompleted: false,
        }),
      });

      const newTask = await res.json();
      setTodos((prev) => [newTask, ...prev]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (title.trim() !== "") {
      createTask(title, description, priority);
      setModalVisible(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  async function handleComplete(index) {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      const res = await fetch(`${API_URL}/${todos[index]._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...todos[index], isCompleted: true }),
      });
      const result = await res.json();
      // console.log(result)
      setTodos((prev) => prev.filter((task, i) => i !== index));
    } catch (err) {
      console.log(err);
    }
  }

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
      // console.log("Deleted:", result);

      setTodos((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  }

  return (
    <View className="flex-1 bg-azure">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View className="bg-powderBlue pt-12 pb-6 px-6 rounded-b-3xl mb-4">
          <Text className="text-3xl font-bold text-white mb-1">My Tasks</Text>
          <Text className="text-white/80 text-sm">
            {todos.length} pending task{todos.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Priority Stats Cards */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 shadow-md mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-highBg h-14 w-14 rounded-xl items-center justify-center mr-3">
                  <Text className="text-highText text-2xl font-bold">
                    {todos.filter((ele) => ele.priority == "high").length}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-jet text-lg font-bold">
                    High Priority
                  </Text>
                  <Text className="text-french-gray text-xs">Urgent tasks</Text>
                </View>
              </View>
              <View className="bg-highBg px-3 py-1 rounded-full">
                <Text className="text-highText text-xs font-semibold">
                  {todos.filter((ele) => ele.priority == "high").length}/
                  {todos.length}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-md mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-mediumBg h-14 w-14 rounded-xl items-center justify-center mr-3">
                  <Text className="text-mediumText text-2xl font-bold">
                    {todos.filter((ele) => ele.priority == "medium").length}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-jet text-lg font-bold">
                    Medium Priority
                  </Text>
                  <Text className="text-french-gray text-xs">
                    Important tasks
                  </Text>
                </View>
              </View>
              <View className="bg-mediumBg px-3 py-1 rounded-full">
                <Text className="text-mediumText text-xs font-semibold">
                  {todos.filter((ele) => ele.priority == "medium").length}/
                  {todos.length}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-md">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-lowBg h-14 w-14 rounded-xl items-center justify-center mr-3">
                  <Text className="text-lowText text-2xl font-bold">
                    {todos.filter((ele) => ele.priority == "low").length}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-jet text-lg font-bold">
                    Low Priority
                  </Text>
                  <Text className="text-french-gray text-xs">Minor tasks</Text>
                </View>
              </View>
              <View className="bg-lowBg px-3 py-1 rounded-full">
                <Text className="text-lowText text-xs font-semibold">
                  {todos.filter((ele) => ele.priority == "low").length}/
                  {todos.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tasks List */}
        <View className="px-4">
          {todos.map((ele, index) => {
            return (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 mb-3 shadow-md"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-jet text-lg font-bold mb-2">
                      {ele.title}
                    </Text>
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

                  <View className="flex-row">
                    <TouchableOpacity
                      className="bg-azure h-10 w-10 rounded-xl justify-center items-center mr-2"
                      onPress={() => handleComplete(index)}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#7284BE"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-highBg h-10 w-10 rounded-xl justify-center items-center"
                      onPress={() => handleDelete(index)}
                    >
                      <MaterialIcons name="delete" size={22} color="#F63737" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-powderBlue w-16 h-16 rounded-full justify-center items-center shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>

      <CreateTodo
        visible={modalVisible}
        title={title}
        description={description}
        priority={priority}
        setTitle={setTitle}
        setDescription={setDescription}
        setPriority={setPriority}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default PendingTodoScreen;
