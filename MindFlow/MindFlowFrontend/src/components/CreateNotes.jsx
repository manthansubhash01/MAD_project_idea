import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';

const CreateNote = ({ visible, title, setTitle, onCancel, onSubmit }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Create New Note</Text>

          <TextInput
            placeholder="Note title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.modalBtn} onPress={onCancel}>
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
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top', 
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    padding: 10,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  }
})

export default CreateNote;