import React from 'react';
import { NoteProvider } from './NoteContext';
import NoteList from './NoteList';
import AddNoteForm from './AddNoteForm';

function NoteTaking() {
  // This component wraps note management context and displays the UI
  return (
    <NoteProvider>
      <div style={{ border: '2px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <h2>Note-Taking</h2>
        <AddNoteForm />
        <NoteList />
      </div>
    </NoteProvider>
  );
}

export default NoteTaking;