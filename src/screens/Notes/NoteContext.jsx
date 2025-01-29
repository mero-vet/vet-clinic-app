import React, { createContext, useState, useContext, useEffect } from 'react';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  // Initialize notes from localStorage if available, otherwise empty array
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('sessionNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Update localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('sessionNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (content, patientId = null, date = new Date().toISOString().split('T')[0]) => {
    const newNote = {
      id: Date.now(),
      content,
      patientId,
      date,
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

  // Add a clear function to reset notes (useful for session end)
  const clearNotes = () => {
    setNotes([]);
    localStorage.removeItem('sessionNotes');
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, clearNotes }}>
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