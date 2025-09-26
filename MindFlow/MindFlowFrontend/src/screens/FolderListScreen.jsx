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
                const data = await fetch('http://localhost:3000/user/folders',{
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
            const res = await fetch('http://localhost:3000/user/folders', {
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
        console.log(folderName)
        if(folderName != ''){
            createFolder(folderName,description)
            setModalVisible(false)
            setFolderName('')
            setDescription('')
        }
    }


  return (
    <View>
        {
            notes.length === 0 ? 
            <View>
                <EmptyNotes onCreate = {createFolder}/>
            </View> 
            : 
            <View>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>My Folders</Text>
                    <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                    >
                    <Text style={styles.addButtonText}>+ Create Folder</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.listContainer}>
                    {
                        notes.map((ele,idx) => (
                            <TouchableOpacity key={idx} style={styles.folderCard} onPress={() => navigation.navigate("Folder", { folder: ele })}>
                            <Text style={styles.folderName}>{ele.name}</Text>
                            <Text style={styles.folderDesc}>{ele.description}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>


                <CreateFolder
                    visible={modalVisible}
                    folderName={folderName}
                    description={description}
                    setFolderName={setFolderName}
                    setDescription={setDescription}
                    onCancel={() => setModalVisible(false)}
                    onSubmit={handleSubmit}
                >
                </CreateFolder>
            </View>
        }
    </View>
  )
}

const Notes = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name = 'Folder List' component={FolderListScreen} ></Stack.Screen>
            <Stack.Screen name = "Folder" component={NotesListScreen}></Stack.Screen>
            <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  toolbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  folderCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,              
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  folderDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});


export default Notes