import React, { useState } from 'react';
import { useNotes } from './NoteContext';
import { usePatient } from '@/context/PatientContext';

function AddNoteForm() {
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const { addNote } = useNotes();
  const { currentPatient } = usePatient();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    // Pass patientId and date if we have a current patient
    addNote(noteContent, currentPatient ? currentPatient.id : null, noteDate);
    setNoteContent('');
  };

  return (
    <fieldset style={{ marginBottom: '15px', color: '#000000' }}>
      <legend>Add New Note</legend>
      <form onSubmit={handleSubmit}>
        <div className="form-row" style={{ marginBottom: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '12px' }}>Date:</label>
          <input
            type="date"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            style={{
              fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
              fontSize: '12px',
              padding: '4px',
              border: '2px solid',
              borderColor: '#404040 #dfdfdf #dfdfdf #404040'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            rows="4"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
              fontSize: '12px',
              padding: '4px',
              border: '2px solid',
              borderColor: '#404040 #dfdfdf #dfdfdf #404040',
              resize: 'vertical'
            }}
            placeholder="Enter your note here..."
          />
          <div style={{ textAlign: 'right' }}>
            <button className="windows-button" type="submit">
              Add Note
            </button>
          </div>
        </div>
      </form>
    </fieldset>
  );
}

export default AddNoteForm;