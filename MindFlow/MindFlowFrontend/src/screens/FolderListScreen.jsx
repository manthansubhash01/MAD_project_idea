import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator()
const TOKEN = 'authToken'

const FolderListScreen = () => {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        const loadNotes = async() => {
            try{
                const token = await AsyncStorage.getItem(TOKEN)
                console.log(token)
                const data = await fetch('http://localhost:3000/user/folders',{
                    headers: { "Authorization": `Bearer ${token}` }
                })
                const result = await data.json()
                setNotes(result)
                console.log(result)
            }catch(err){
                console.log(err)
            }
        }
        loadNotes()
    },[])


  return (
    <View>
        {
            notes.length === 0 ? 
            <View>
                <Text>Create new Note</Text>
            </View> 
            : 
            <View>
                {
                    notes.map((ele) => {
                        return (
                            <Text>{ele.name}</Text>
                        )
                    })
                }
            </View>
        }
    </View>
  )
}

const Notes = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name = 'Folder List' component={FolderListScreen} ></Stack.Screen>
        </Stack.Navigator>
    )
}

export default Notes