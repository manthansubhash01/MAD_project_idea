import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateNote from '../components/CreateNotes';

const TOKEN = 'authToken';

const NotesListScreen = ({navigation,route}) => {
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
      className="bg-white flex-1 m-2 p-4 rounded-xl border border-gray-200 h-32 justify-center items-center shadow"
      onPress={() => navigation.navigate('NoteDetails', { note: item })}
    >
      <Text className="text-center text-lg font-semibold text-jet" numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold text-jet">{folder.name}</Text>
      {folder.description ? (
        <Text className="text-base text-gray-600 mt-2">{folder.description}</Text>
      ) : null}

      <View className="flex-row justify-between items-center mt-4 mb-2">
        <Text className="text-lg font-bold text-jet">My Notes</Text>
        <TouchableOpacity
          className="bg-golden-gate-bridge px-4 py-2 rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-semibold">Create Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
        numColumns={2}
        columnWrapperClassName="justify-between"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />

      <CreateNote
        visible={modalVisible}
        title={title}
        setTitle={setTitle}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  )
}


export default NotesListScreen