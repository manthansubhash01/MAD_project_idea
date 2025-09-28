import React,{useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000/user/tasks";
const TOKEN = 'authToken'

const PendingTodoScreen = () => {
  const [todos, setTodos] = useState([])

    async function loadTodos(){
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const data = await fetch(API_URL,{
                headers: { "Authorization": `Bearer ${token}` }
            })
            const result = await data.json()
            setTodos(result.filter((ele) => !ele.isCompleted))
            console.log(result)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        loadTodos()
    },[todos])


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

export default PendingTodoScreen