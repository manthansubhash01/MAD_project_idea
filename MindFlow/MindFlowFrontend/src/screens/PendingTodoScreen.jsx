import React,{useEffect, useState, useContext} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTodo from '../components/CreateTodoModal';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { TodoContext } from '../contexts/TodoContext';

const API_URL = "https://mad-project-idea.onrender.com/user/tasks";
const TOKEN = 'authToken'

const PendingTodoScreen = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')

    const {todos, setTodos} = useContext(TodoContext)
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
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const res = await fetch(API_URL,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, priority, isCompleted : false }),
            })

            const newTask = await res.json()
            setTodos((prev) => [newTask, ...prev])

        }catch(err){
            console.log(err)
        }
    }

    const handleSubmit = () => {
        if(title.trim() !== ''){
            createTask(title, description, priority)
            setModalVisible(false)
            setTitle('')
            setDescription('')
            setPriority('medium')
        }
    }

    async function handleComplete(index){
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const res = await fetch(`${API_URL}/${todos[index]._id}`,{
                method : "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}` 
                },
                body : JSON.stringify({...todos[index],isCompleted : true})
            })
            const result = await res.json()
            // console.log(result)
            setTodos((prev) =>
                prev.filter((task, i) => i !== index)
            );
            
        }catch(err){
            console.log(err)
        }
    }

    async function handleDelete(index) {
        try {
            const token = await AsyncStorage.getItem(TOKEN);

            const res = await fetch(`${API_URL}/${todos[index]._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
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
    <View className="flex-1 relative">
        <View className="flex-1"> 
            <View className="flex flex-row mb-5">
                <View className = "w-1/2">
                    <View className="bg-highBg h-15 flex-row m-5 mt-5 mb-1 rounded-3xl  justify-start items-center">
                        <View className="bg-highText m-3 mr-1 flex flex-row w-11 h-11 rounded-full justify-center items-center">
                            <Text className="text-white text font-semibold">{todos.filter(ele => ele.priority == "high").length}/{todos.length}</Text>
                        </View>
                        <View className = 'm-3 ml-1'>
                            <Text className="text-highText text-xl font-bold">High</Text>
                        </View>
                    </View>
                    <View className="bg-mediumBg h-15 flex-row m-5 mt-1 mb-1 rounded-3xl  justify-start items-center">
                        <View className="bg-mediumText m-3 mr-1 flex flex-row w-11 h-11 rounded-full justify-center items-center">
                            <Text className="text-white text font-bold">{todos.filter(ele => ele.priority == "medium").length}/{todos.length}</Text>
                        </View>
                        <View className = 'm-3 ml-1'>
                            <Text className="text-mediumText text-xl font-bold">Medium</Text>
                        </View>
                    </View>
                    <View className="bg-lowBg h-15 flex-row m-5 mt-1 mb-1 rounded-3xl  justify-start items-center">
                        <View className="bg-lowText m-3 mr-1 flex flex-row w-11 h-11 rounded-full justify-center items-center">
                            <Text className="text-white text font-bold">{todos.filter(ele => ele.priority == "low").length}/{todos.length}</Text>
                        </View>
                        <View className = 'm-3 ml-1'>
                            <Text className="text-lowText text-xl font-bold">Low</Text>
                        </View>
                    </View>
                </View>
                <View className="">
                    <Image source={require("../../assets/9175151-removebg-preview(1).png")}
                    style={{ width: 150, height: 150}} className="mt-14 ml-2"/>
                </View>
            </View>

            <ScrollView className="pl-3 pr-3 mb-3" showsVerticalScrollIndicator={false}>
                {
                    todos.map((ele,index) => {
                        return (
                            <View 
                                key={index} 
                                className="flex-row justify-between items-center bg-white rounded-2xl p-4 my-2 shadow-md"
                            >
                                <View className="flex-1">
                                    <Text className="text-jet text-lg font-bold">{ele.title}</Text>
                                    {/* <Text className="text-jet text-sm mt-1">{ele.description}</Text> */}
                                    {
                                        ele.priority === "high" ? (
                                            <View className = "bg-highBg w-20 items-center rounded-xl">
                                                <Text className = "text-highText">Urgent</Text>
                                            </View>
                                        ) : ele.priority === "medium" ? (
                                            <View className = "bg-mediumBg w-20 items-center rounded-xl">
                                                <Text className = "text-mediumText">Important</Text>
                                            </View>
                                        ) : (
                                            <View className = "bg-lowBg w-20 items-center rounded-xl">
                                                <Text className = "text-lowText">Minor</Text>
                                            </View>
                                        )
                                    }
                                </View>

                                <View className="flex-row space-x-2 ml-4">
                                    <TouchableOpacity
                                    className="m-2 px-3 py-1 rounded-xl justify-center items-center"
                                    onPress={() => handleComplete(index)}
                                    >
                                    <Ionicons name="checkmark-circle" size={30} color="#028A0F" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                    className="m-2 px-3 py-1 rounded-xl justify-center items-center"
                                    onPress={() => handleDelete(index)}
                                    >
                                    <MaterialIcons name="delete" size={30} color="#b2b6bfff" />
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>

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
            priority = {priority}
            setTitle={setTitle}
            setDescription={setDescription}
            setPriority={setPriority}
            onCancel={() => setModalVisible(false)}
            onSubmit={handleSubmit}
        />
    </View>
  )
}



export default PendingTodoScreen