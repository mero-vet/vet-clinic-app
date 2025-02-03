import React from 'react';
import { useNotes } from './NoteContext';
import NoteItem from './NoteItem';
import { usePatient } from '@/context/PatientContext';

function NoteList() {
  const { notes } = useNotes();
  const { currentPatient } = usePatient();

  // Filter to show only notes for the current patient if we have one
  const filteredNotes = currentPatient
    ? notes.filter((n) => n.patientId === currentPatient.id)
    : notes;

  // Sort notes by creation date, most recent first
  const sortedNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <fieldset style={{ color: '#000000' }}>
      <legend>Existing Notes</legend>
      {!sortedNotes || sortedNotes.length === 0 ? (
        <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>No notes yet.</p>
      ) : (
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '4px',
          backgroundColor: '#ffffff'
        }}>
          {sortedNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </fieldset>
  );
}

export default NoteList;