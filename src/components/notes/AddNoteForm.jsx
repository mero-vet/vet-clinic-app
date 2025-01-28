import React, { useState } from 'react';
import { useNotes } from './NoteContext';

function AddNoteForm() {
  const [noteContent, setNoteContent] = useState('');
  const { addNote } = useNotes();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addNote(noteContent);
    setNoteContent('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
      <h3>Add New Note</h3>
      <textarea
        rows="3"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        style={{ width: '100%', marginBottom: '5px' }}
      />
      <br />
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNoteForm;