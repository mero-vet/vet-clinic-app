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
    <div style={{ border: '1px solid #ddd', padding: '8px' }}>
      {isEditing ? (
        <>
          <textarea
            rows="3"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            style={{ width: '100%' }}
          />
          <button onClick={handleSave} style={{ marginRight: '5px' }}>
            Save
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>{note.content}</p>
          {note.updatedAt && <small>Last updated: {new Date(note.updatedAt).toLocaleString()}</small>}
          <div style={{ marginTop: '5px' }}>
            <button onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>
              Edit
            </button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;