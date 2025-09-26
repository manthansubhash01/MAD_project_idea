import React from 'react';
import NoteEditor from '../components/NoteEditor';

const NoteDetailsScreen = ({ route }) => {
  const { note } = route.params;

  const handleSave = (updatedNote) => {
    console.log("Auto-saved:", updatedNote);
  };

  return <NoteEditor note={note} onSave={handleSave} />;
};

export default NoteDetailsScreen;
