import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal,TextInput,Button } from 'react-native';

const CreateFolder = ({visible,folderName,description,setFolderName,setDescription,onCancel,onSubmit}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Create New Folder</Text>

            <TextInput
            placeholder="Folder name"
            style={styles.input}
            value={folderName}
            onChangeText={setFolderName}
            />

            <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            />

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={onCancel}
                >
                    <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalBtn} onPress={onSubmit}>
                    <Text style={styles.modalBtnText}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
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

export default CreateFolder