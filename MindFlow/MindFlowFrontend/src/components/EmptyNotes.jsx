import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal,TextInput,Button } from 'react-native';
import CreateFolder from './CreateFolder';


const EmptyNotes = ({onCreate}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [description, setDescription] = useState('')


    const handleSubmit = () => {
        console.log(folderName)
        if(folderName != ''){
            onCreate(folderName,description)
            setModalVisible(false)
            setFolderName('')
            setDescription('')
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <View style={styles.createEle}>
                    <Image
                        style={styles.image}
                        source={{ uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F7486%2F7486767.png&f=1&nofb=1&ipt=5f3e6c0dc32e70fe7d38a40082dd947b0951328e7fd596c5e277e7f05fc10f5a" }}
                    ></Image>
                    <Text style={styles.text}>Nothing to see here , click to get started.</Text>
                </View>
            </TouchableOpacity>

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
    )
}

export default EmptyNotes

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 300,
    },
    createEle: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20,
        borderColor: '#cdcdcd',
        borderWidth: 1,
        padding: 15,
    },
    image: {
        height: 250,
        width: 250
    },
    text: {
        margin: 20,
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})



