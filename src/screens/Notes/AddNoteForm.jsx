import React, { useState } from 'react';
import { useNotes } from './NoteContext';
import { usePatient } from '@/context/PatientContext';

function AddNoteForm() {
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = useState('');
  const [patientId, setPatientId] = useState('');
  const { addNote } = useNotes();
  const { currentPatient } = usePatient();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !clientId.trim() || !patientId.trim()) return;

    addNote(noteContent, clientId, patientId, noteDate);
    setNoteContent('');
  };

  return (
    <fieldset style={{ marginBottom: '15px', color: '#000000' }}>
      <legend>Add New Note</legend>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div className="form-row">
            <label style={{ minWidth: '80px', fontSize: '12px' }}>Client ID:</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              onFocus={(e) => e.target.select()}
              onClick={(e) => e.target.select()}
              required
              style={{
                fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
                fontSize: '12px',
                padding: '4px',
                border: '2px solid',
                borderColor: '#404040 #dfdfdf #dfdfdf #404040'
              }}
            />
          </div>
          <div className="form-row">
            <label style={{ minWidth: '80px', fontSize: '12px' }}>Patient ID:</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onFocus={(e) => e.target.select()}
              onClick={(e) => e.target.select()}
              required
              style={{
                fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
                fontSize: '12px',
                padding: '4px',
                border: '2px solid',
                borderColor: '#404040 #dfdfdf #dfdfdf #404040'
              }}
            />
          </div>
        </div>
        <div className="form-row" style={{ marginBottom: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '12px' }}>Date:</label>
          <input
            type="date"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
            onMouseUp={(e) => {
              e.preventDefault();
              e.target.select();
            }}
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
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
              fontSize: '12px',
              padding: '4px',
              border: '2px solid',
              borderColor: '#404040 #dfdfdf #dfdfdf #404040',
              resize: 'vertical',
              whiteSpace: 'pre-wrap',
              minHeight: '100px'
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