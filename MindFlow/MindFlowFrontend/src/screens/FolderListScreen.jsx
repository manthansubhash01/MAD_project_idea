import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyNotes from '../components/EmptyNotes';
import CreateFolder from '../components/CreateFolder';
import NotesListScreen from './NotesListScreen';
import NoteDetailsScreen from './NoteDetailsScreen';

const Stack = createStackNavigator()
const TOKEN = 'authToken'

const FolderListScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState([])

    useEffect(() => {
        const loadNotes = async() => {
            try{
                const token = await AsyncStorage.getItem(TOKEN)
                // console.log(token)
                const data = await fetch('https://mad-project-idea.onrender.com/user/folders',{
                    headers: { "Authorization": `Bearer ${token}` }
                })
                const result = await data.json()
                setNotes(result)
                // console.log(result)
            }catch(err){
                console.log(err)
            }
        }
        loadNotes()
    },[])

    const createFolder = async(folderName, description) => {
        try{
            const token = await AsyncStorage.getItem(TOKEN)
            const res = await fetch('https://mad-project-idea.onrender.com/user/folders', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: folderName, description }),
            })

            const newFolder = await res.json()
            setNotes((prev) => [...prev, newFolder])
        }catch(err){
            console.log(err)
        }
    }

      const handleSubmit = () => {
        // console.log(folderName)
        if(folderName != ''){
            createFolder(folderName,description)
            setModalVisible(false)
            setFolderName('')
            setDescription('')
        }
    }


  return (
    <View className="flex-1 p-4">
      {notes.length === 0 ? (
        <EmptyNotes onCreate={createFolder} />
      ) : (
        <>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-jet">My Folders</Text>
            <TouchableOpacity
              className="bg-powderBlue px-4 py-2 rounded-full"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-semibold">Create Folder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="mt-2">
            {notes.map((ele, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-white p-5 m-3 rounded-xl border border-gray-200 shadow"
                onPress={() => navigation.navigate('Folder', { folder: ele })}
              >
                <Text className="text-lg font-semibold text-jet">{ele.name}</Text>
                {ele.description ? (
                  <Text className="text-gray-600 mt-1">{ele.description}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <CreateFolder
            visible={modalVisible}
            folderName={folderName}
            description={description}
            setFolderName={setFolderName}
            setDescription={setDescription}
            onCancel={() => setModalVisible(false)}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </View>
  )
}

const Notes = () => {
    return (
        <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { fontWeight: 'bold', color: '#3a3a3a' }, 
        headerTintColor: '#71A5E9',
        headerTitleAlign: 'center', 
        headerShadowVisible: false, 
      }}
    >
      <Stack.Screen
        name="Folder List"
        component={FolderListScreen}
        options={{ title: 'My Folders' }}
      />
      <Stack.Screen
        name="Folder"
        component={NotesListScreen}
        options={({ route }) => ({ title: route.params.folder.name })}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={{ title: 'Note Details' }}
      />
    </Stack.Navigator>
    )
}


export default Notes