import React,{useEffect, useState} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTodo from '../components/CreateTodoModal';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const API_URL = "http://localhost:3000/user/tasks";
const TOKEN = 'authToken'

const AllTodoScreen = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [todos, setTodos] = useState([])

    async function loadTodos(){
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const data = await fetch(API_URL,{
                headers: { "Authorization": `Bearer ${token}` }
            })
            const result = await data.json()
            setTodos(result)
            console.log(result)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        loadTodos()
    },[todos])

     const createTask = async (title, description, priority) => {
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const res = await fetch(API_URL,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, priority, status : false }),
            })

            const newTask = await res.json()
            setTodos((prev) => [...prev, newTask])

        }catch(err){
            console.log(err)
        }
    }

    const handleSubmit = () => {
        if(title != ''){
            createTask(title, description, priority)
            setModalVisible(false)
            setTitle('')
            setDescription('')
            setPriority('medium')
        }
    }

  return (
    <View className="flex-1 relative">
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
        <TouchableOpacity
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-golden-gate-bridge w-16 h-16 rounded-full justify-center items-center shadow-lg"
            onPress={() => setModalVisible(true)}
        >
            <Text className="text-white text-3xl font-bold">+</Text>
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



export default AllTodoScreen