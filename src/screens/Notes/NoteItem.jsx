import React, { useState } from 'react';
import { useNotes } from './NoteContext';
import { usePIMS } from '@/context/PIMSContext';

function NoteItem({ note }) {
  const { editNote, deleteNote } = useNotes();
  const { currentPIMS } = usePIMS();
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(note.content);

  const handleSave = () => {
    editNote(note.id, tempContent);
    setIsEditing(false);
  };

  // Get styles based on current PIMS
  const getNoteItemStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: 'white',
        color: '#333333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: 'auto',
        minHeight: 'fit-content'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        border: '2px solid',
        borderColor: '#919191 #dfdfdf #dfdfdf #919191',
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#ffffff',
        color: '#000000',
        height: 'auto',
        minHeight: 'fit-content'
      };
    } else {
      // Default styles for other PIMS
      return {
        border: '1px solid #ccc',
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#ffffff',
        color: '#000000',
        height: 'auto',
        minHeight: 'fit-content'
      };
    }
  };

  const getTextareaStyles = () => {
    if (currentPIMS === 'intravet') {
      return {
        width: '100%',
        marginBottom: '10px',
        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
        fontSize: '13px',
        padding: '8px 10px',
        border: '1px solid #BBBBBB',
        borderRadius: '3px',
        minHeight: '120px',
        resize: 'vertical'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        width: '100%',
        marginBottom: '8px',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
        fontSize: '12px',
        padding: '4px',
        border: '2px solid',
        borderColor: '#404040 #dfdfdf #dfdfdf #404040',
        minHeight: '100px',
        resize: 'vertical'
      };
    } else {
      // Default styles for other PIMS
      return {
        width: '100%',
        marginBottom: '8px',
        fontSize: '14px',
        padding: '8px',
        border: '1px solid #ccc',
        minHeight: '100px',
        resize: 'vertical'
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
        borderRadius: '3px',
        marginLeft: '8px'
      };
    } else if (currentPIMS === 'cornerstone') {
      return {
        marginRight: '5px',
        cursor: 'pointer',
        backgroundColor: '#c0c0c0',
        color: '#000000',
        border: '2px outset #ffffff',
        boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff',
        padding: '3px 10px',
        fontSize: '12px'
      };
    } else {
      // Default styles for other PIMS - use minimal styling to let global styles take effect
      return {
        cursor: 'pointer',
        marginRight: '5px'
      };
    }
  };

  // Get the correct font size based on PIMS
  const getContentFontSize = () => {
    if (currentPIMS === 'intravet') return '13px';
    if (currentPIMS === 'cornerstone') return '12px';
    return '14px'; // Default for other PIMS
  };

  return (
    <div style={getNoteItemStyles()}>
      {isEditing ? (
        <>
          <textarea
            rows="4"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            onFocus={(e) => e.target.select()}
            style={getTextareaStyles()}
          />
          <div style={{ textAlign: 'right' }}>
            <button onClick={handleSave} style={getButtonStyles()}>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} style={getButtonStyles()}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#666' }}>
            <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
            {note.updatedAt && <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>}
          </div>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: getContentFontSize(),
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            height: 'auto',
            minHeight: 'fit-content',
            overflow: 'visible'
          }}>{note.content}</p>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setIsEditing(true)} style={getButtonStyles()}>
              Edit
            </button>
            <button onClick={() => deleteNote(note.id)} style={getButtonStyles()}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;