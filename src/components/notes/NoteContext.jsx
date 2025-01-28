import React, { createContext, useState, useContext } from 'react';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([
    // Example note structure
    // { id: 1, content: 'Check pet vitals', createdAt: '2025-01-27T10:00:00', updatedAt: '' },
  ]);

  const addNote = (content) => {
    const newNote = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const editNote = (id, newContent) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, content: newContent, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};