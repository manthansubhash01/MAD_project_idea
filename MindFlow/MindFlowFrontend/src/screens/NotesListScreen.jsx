import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateNote from '../components/CreateNotes';

const TOKEN = 'authToken';

const NotesListScreen = ({route}) => {
  const { folder } = route.params
  console.log(folder)
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState([])

  const loadNotes = async() => {
    try{
        const token = await AsyncStorage.getItem(TOKEN)
        console.log(token)
        const data = await fetch(`http://localhost:3000/user/folders/${folder._id}/note`,{
            headers: { "Authorization": `Bearer ${token}` }
        })
        const result = await data.json()
        setNotes(result)
        console.log(result)
    }catch(err){
        console.log(err)
    }
  }

  useEffect(() => {
    loadNotes()
  },[])

  const createNote = async (title) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      console.log(folder._id)
      const res = await fetch(`http://localhost:3000/user/folders/${folder._id}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, folderId : folder._id}),
      });

      const newNote = await res.json();
      // console.log(newNote)

      setNotes((prev) => [...prev, newNote]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
  if (title.trim() !== '') {
    createNote(title);
    setModalVisible(false); 
    setTitle('');        
  }
};


  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate("NoteDetails", { note: item })}
    >
      <Text style={styles.noteTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder.name}</Text>
      <Text style={styles.desc}>{folder.description}</Text>
      <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>My Notes</Text>
          <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          >
          <Text style={styles.addButtonText}>+ Create Note</Text>
          </TouchableOpacity>
      </View>

      {
        notes && (
          <FlatList
            data={notes}
            renderItem={renderNote}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ padding: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )
      }

      <CreateNote
      visible = {modalVisible}
      title = {title}
      setTitle = {setTitle}
      onCancel = {() => setModalVisible(false)}
      onSubmit = {handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  desc: {
    fontSize: 16,
    marginTop: 10,
    color: '#666'
  },toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex : 300
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
  },noteCard: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 5,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default NotesListScreen