import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RichText, Toolbar, useEditorBridge,DEFAULT_TOOLBAR_ITEMS } from '@10play/tentap-editor';

const NoteEditor = () => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
  });

  return (
    <View style={styles.container}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  toolbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fafafa',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  toolbar: {
    flex: 1,
    zIndex: 1100,
    backgroundColor: '#fafafa',
    width: '100%', 
  },
  editor: {
    flex: 1,
  },
});

export default NoteEditor;
