import React,{useEffect, useState, useContext} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
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
            console.log(result)
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
            console.log("Deleted:", result);

            setTodos((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.log("Error deleting task:", err);
        }
    }


  return (
    <View className="flex-1 relative">
        <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="bg-black h-60 flex m-5 rounded-3xl pt-5 pb-5 pl-10 pr-10 justify-evenly items-center">
                <View className="bg-golden-gate-bridge m-3 flex flex-row w-32 h-32 rounded-full justify-center items-center">
                    <Text className="text-white text-5xl font-bold">{todos.filter(ele => ele.priority == "high").length}</Text>
                    <Text className="text-white text-5xl font-bold">/</Text>
                    <Text className="text-white text-5xl font-bold">{todos.length}</Text>
                </View>
                <View>
                    <Text className="text-white text-3xl font-bold">High</Text>
                </View>
            </View>
            <View className="bg-golden-gate-bridge h-60 flex m-5 rounded-3xl pt-5 pb-5 pl-10 pr-10 justify-evenly items-center">
                <View className="bg-black flex flex-row m-3 w-32 h-32 rounded-full justify-center items-center">
                    <Text className="text-white text-5xl font-bold">{todos.filter(ele => ele.priority == "medium").length}</Text>
                    <Text className="text-white text-5xl font-bold">/</Text>
                    <Text className="text-white text-5xl font-bold">{todos.length}</Text>
                </View>
                <View>
                    <Text className="text-white text-3xl font-bold">Medium</Text>
                </View>
            </View>
            <View className="bg-black h-60 flex m-5 rounded-3xl pt-5 pb-5 pl-10 pr-10 justify-evenly items-center">
                <View className="bg-golden-gate-bridge m-3 flex flex-row  w-32 h-32 rounded-full justify-center items-center">
                    <Text className="text-white text-5xl font-bold">{todos.filter(ele => ele.priority == "low").length}</Text>
                    <Text className="text-white text-5xl font-bold">/</Text>
                    <Text className="text-white text-5xl font-bold">{todos.length}</Text>
                </View>
                <View>
                    <Text className="text-white text-3xl font-bold">Low</Text>
                </View>
            </View>
        </ScrollView>

        <ScrollView className="p-4">
            {
                todos.map((ele,index) => {
                    return (
                        <View 
                            key={index} 
                            className="flex-row justify-between items-center bg-french-gray rounded-2xl p-4 my-2 shadow-md"
                        >
                            <View className="flex-1">
                                <Text className="text-black text-lg font-bold">{ele.title}</Text>
                                <Text className="text-black text-sm mt-1">{ele.description}</Text>
                            </View>

                            <View className="flex-row space-x-2 ml-4">
                                <TouchableOpacity
                                className="m-2 px-3 py-1 rounded-xl justify-center items-center"
                                onPress={() => handleComplete(index)}
                                >
                                <Ionicons name="checkmark-circle" size={30} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                className="m-2 px-3 py-1 rounded-xl justify-center items-center"
                                onPress={() => handleDelete(index)}
                                >
                                <MaterialIcons name="delete" size={30} color="#3a3a3aff" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
        </View>

        <TouchableOpacity
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-golden-gate-bridge w-16 h-16 rounded-full justify-center items-center shadow-lg"
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