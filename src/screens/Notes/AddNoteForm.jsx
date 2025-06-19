import React, { useState } from 'react';
import { useNotes } from './NoteContext';
import { usePatient } from '@/context/PatientContext';
import { usePIMS } from '@/context/PIMSContext';

function AddNoteForm() {
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = useState('');
  const [patientId, setPatientId] = useState('');
  const { addNote } = useNotes();
  const { currentPatient } = usePatient();
  const { currentPIMS } = usePIMS();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addNote(noteContent, patientId, noteDate);
    setNoteContent('');
  };

  // Get styles based on current PIMS
  const getFieldsetStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        marginBottom: '10px',
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        padding: '15px',
        backgroundColor: 'white',
        color: '#333333',
        display: 'inline-block',
        width: '100%',
        height: 'auto',
        alignSelf: 'flex-start'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        marginBottom: '15px',
        border: '2px inset #d0d0d0',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        color: '#000000'
      };
    } else {
      // Default styles for other PIMS
      return {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '15px',
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

  const getInputStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        padding: '6px 10px',
        fontSize: '13px',
        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif"
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
        fontSize: '12px',
        padding: '4px',
        border: '2px inset #d0d0d0'
      };
    } else {
      // Default styles for other PIMS
      return {
        border: '1px solid #ccc',
        padding: '6px',
        fontSize: '14px',
        borderRadius: '2px'
      };
    }
  };

  const getTextareaStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
        fontSize: '13px',
        padding: '8px 10px',
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        resize: 'vertical',
        minHeight: '120px'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
        fontSize: '12px',
        padding: '4px',
        border: '2px inset #d0d0d0',
        resize: 'vertical',
        minHeight: '100px'
      };
    } else {
      // Default styles for other PIMS
      return {
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '14px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '2px',
        resize: 'vertical',
        minHeight: '120px'
      };
    }
  };

  const getButtonStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        background: 'linear-gradient(to bottom, #2196F3, #1565C0)',
        color: 'white',
        border: 'none',
        padding: '6px 14px',
        fontSize: '13px',
        cursor: 'pointer',
        borderRadius: '3px'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        backgroundColor: '#c0c0c0',
        color: '#000000',
        border: '2px outset #ffffff',
        boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff',
        padding: '3px 10px',
        fontSize: '12px',
        cursor: 'pointer'
      };
    } else {
      // Default styles for other PIMS - use minimal styling to let global styles take effect
      return {
        cursor: 'pointer'
      };
    }
  };

  // Get the right font size for labels based on PIMS
  const getLabelFontSize = () => {
    if (currentPIMS === 'intravet') return '13px';
    if (currentPIMS === 'cornerstone') return '12px';
    return '14px'; // Default for other PIMS
  };

  return (
    <fieldset style={getFieldsetStyles()}>
      <legend style={getLegendStyles()}>Add New Note</legend>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
          <div className="form-row">
            <label style={{ minWidth: '80px', fontSize: getLabelFontSize() }}>Client ID:</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              onFocus={(e) => e.target.select()}
              style={getInputStyles()}
            />
          </div>
          <div className="form-row">
            <label style={{ minWidth: '80px', fontSize: getLabelFontSize() }}>Patient ID:</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onFocus={(e) => e.target.select()}
              style={getInputStyles()}
            />
          </div>
        </div>
        <div className="form-row" style={{ marginBottom: '6px' }}>
          <label style={{ minWidth: '80px', fontSize: getLabelFontSize() }}>Date:</label>
          <input
            type="date"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            onFocus={(e) => e.target.select()}
            style={getInputStyles()}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <textarea
            rows="4"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onFocus={(e) => e.target.select()}
            style={getTextareaStyles()}
            placeholder="Enter your note here..."
          />
          <div style={{ textAlign: 'right', marginTop: '2px' }}>
            <button type="submit" style={getButtonStyles()}>
              Add Note
            </button>
          </div>
        </div>
      </form>
    </fieldset>
  );
}

export default AddNoteForm;