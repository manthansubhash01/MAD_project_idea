import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal,TextInput,Button } from 'react-native';
import { Picker } from "@react-native-picker/picker";

const CreateTodo = ({visible,title,description,priority,setTitle,setDescription,setPriority,onCancel,onSubmit}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Create New Folder</Text>

            <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            />

            <TextInput
            placeholder="Description (optional)"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            />
            
            <View>
                <Text style={styles.label}>Select Priority:</Text>
                <Picker
                    selectedValue={priority}
                    onValueChange={(itemValue) => setPriority(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Low" value="low" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="High" value="high" />
                </Picker>
                {/* <Text style={styles.selected}>Selected: {priority}</Text> */}
            </View>

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

export default CreateTodo