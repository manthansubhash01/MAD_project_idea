import React,{useEffect, useState} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTodo from '../components/CreateTodoModal';

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
    <View>
        <ScrollView style = {styles.scrollContainer}>
            {
                todos.map((ele,index) => {
                    return (
                        <View key={index} style = {styles.taskContainer}>
                            <TouchableOpacity onPress={() => handleComplete(index)}>
                                <Text>Done</Text>
                            </TouchableOpacity>
                            <Text style = {styles.text}>{ele.title}</Text>
                            <Text style = {styles.text}>{ele.description}</Text>
                            <TouchableOpacity onPress={() => handleDelete(index)}> 
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </ScrollView>
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            >
            <Text style={styles.addButtonText}>+ Create Task</Text>
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

const styles = StyleSheet.create({
    scrollContainer : {
        padding : 15
    },
    taskContainer : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : 60,
        backgroundColor : '#dfdfdf',
        borderRadius : 10,
        padding : 10,
        margin : 7
    },
    text : {
        fontSize : 18,
    },
    checkButton : {
        height : 30,
        width : 30,
        backgroundColor : 'lightgreen'
    },
    delete : {
        height : 30,
        width : 30,
        backgroundColor : 'red'
    },
    addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin : 15
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign : 'center'
  },
})

export default AllTodoScreen