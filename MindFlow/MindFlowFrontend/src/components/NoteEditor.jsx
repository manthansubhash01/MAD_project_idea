import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';


const NoteEditor = ({ note: initialNote, onSave }) => {
  const [note, setNote] = useState(initialNote || { title: 'Untitled', blocks: [] });
  const [blocks, setBlocks] = useState(initialNote?.blocks || []);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.titleBar}>
        <TextInput
          value={note.title}
          onChangeText={(t) => setNote({ ...note, title: t })}
          placeholder="Title"
          style={styles.titleInput}
        />
      </View>
    </View>
    )
};

const styles = StyleSheet.create({
  titleBar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
  },
  paragraph: {
    fontSize: 16,
    minHeight: 36,
    textAlignVertical: 'top',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todo: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    marginRight: 10,
  },
});

export default NoteEditor;
