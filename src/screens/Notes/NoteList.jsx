import React from 'react';
import { useNotes } from './NoteContext';
import NoteItem from './NoteItem';
import { usePatient } from '@/context/PatientContext';
import { usePIMS } from '@/context/PIMSContext';

function NoteList() {
  const { notes } = useNotes();
  const { currentPatient } = usePatient();
  const { currentPIMS, config } = usePIMS();

  // Filter to show only notes for the current patient if we have one
  const filteredNotes = currentPatient
    ? notes.filter((n) => n.patientId === currentPatient.id)
    : notes;

  // Sort notes by creation date, most recent first
  const sortedNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Get styles based on current PIMS
  const getFieldsetStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: 'white',
        color: '#333333'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        border: '2px inset #d0d0d0',
        padding: '10px',
        marginBottom: '15px',
        backgroundColor: '#f5f5f5',
        color: '#000000'
      };
    } else {
      // Default styles for other PIMS
      return {
        border: '1px solid #ccc',
        padding: '15px',
        marginBottom: '20px',
        color: '#333333'
      };
    }
  };

  const getLegendStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1565C0',
        padding: '0 5px'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#000080'
      };
    } else {
      // Default styles for other PIMS
      return {
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '0 5px'
      };
    }
  };

  const getContainerStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '4px'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '4px',
        backgroundColor: '#ffffff',
        border: '1px inset #d0d0d0'
      };
    } else {
      // Default styles for other PIMS
      return {
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '4px',
        backgroundColor: '#ffffff'
      };
    }
  };

  return (
    <fieldset style={getFieldsetStyles()}>
      <legend style={getLegendStyles()}>Existing Notes</legend>
      {!sortedNotes || sortedNotes.length === 0 ? (
        <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>No notes yet.</p>
      ) : (
        <div style={getContainerStyles()}>
          {sortedNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </fieldset>
  );
}

export default NoteList;