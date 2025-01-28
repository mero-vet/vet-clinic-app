import React from 'react';
import { NoteProvider } from './Notes/NoteContext';
import AddNoteForm from './Notes/AddNoteForm';
import NoteList from './Notes/NoteList';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

/**
 * NoteScreen
 * Wraps everything in a NoteProvider. Uses AddNoteForm and NoteList.
 */
function NoteScreen() {
  return (
    <NoteProvider>
      <div className="windows-classic">
        <div className="window" style={{ margin: '0' }}>
          <div className="title-bar">
            <div className="title-bar-text">Notes</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body" style={{ padding: '16px' }}>
            <AddNoteForm />
            <NoteList />
          </div>
        </div>
      </div>
    </NoteProvider>
  );
}

export default NoteScreen;