import React, { useState } from 'react';
import { useNotes } from './NoteContext';

function NoteItem({ note }) {
  const { editNote, deleteNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(note.content);

  const handleSave = () => {
    editNote(note.id, tempContent);
    setIsEditing(false);
  };

  return (
    <div style={{
      border: '2px solid',
      borderColor: '#919191 #dfdfdf #dfdfdf #919191',
      padding: '8px',
      marginBottom: '8px',
      backgroundColor: '#ffffff',
      color: '#000000',
      height: 'auto',
      minHeight: 'fit-content'
    }}>
      {isEditing ? (
        <>
          <textarea
            rows="4"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
            style={{
              width: '100%',
              marginBottom: '8px',
              fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
              fontSize: '12px',
              padding: '4px',
              border: '2px solid',
              borderColor: '#404040 #dfdfdf #dfdfdf #404040',
              minHeight: '100px',
              resize: 'vertical'
            }}
          />
          <div style={{ textAlign: 'right' }}>
            <button className="windows-button" onClick={handleSave} style={{ marginRight: '5px' }}>
              Save
            </button>
            <button className="windows-button" onClick={() => setIsEditing(false)}>
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
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            height: 'auto',
            minHeight: 'fit-content',
            overflow: 'visible'
          }}>{note.content}</p>
          <div style={{ textAlign: 'right' }}>
            <button className="windows-button" onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>
              Edit
            </button>
            <button className="windows-button" onClick={() => deleteNote(note.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;