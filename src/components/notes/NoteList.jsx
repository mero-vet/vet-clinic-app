import React from 'react';
import { useNotes } from './NoteContext';
import NoteItem from './NoteItem';

function NoteList() {
  const { notes } = useNotes();

  if (!notes || notes.length === 0) {
    return <p>No notes yet.</p>;
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <h3>Existing Notes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: '8px' }}>
            <NoteItem note={note} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;