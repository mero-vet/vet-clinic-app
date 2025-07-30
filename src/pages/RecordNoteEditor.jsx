import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecordNoteStore } from '../stores/useRecordNoteStore';
import PatientBanner from '../components/PatientBanner';
import Ribbon from '../components/Ribbon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useUnsavedGuard from '../hooks/useUnsavedGuard';

const RecordNoteEditor = () => {
  const { id } = useParams();
  const { draft, setField, dirty, save } = useRecordNoteStore();
  const [body, setBody] = useState(draft.body);
  useUnsavedGuard(dirty);

  const ribbonButtons = [
    { label:'Save', onClick: () => save() },
    { label:'Cancel', onClick: () => window.history.back() },
  ];

  return (
    <div>
      <Ribbon buttons={ribbonButtons} />
      <PatientBanner patient={{ name:'Patient '+id }} />
      <TextField fullWidth label="Title" value={draft.title} onChange={e=>setField('title', e.target.value)} sx={{ my:1 }} />
      <TextField fullWidth multiline minRows={10} value={body} onChange={e => { setBody(e.target.value); setField('body', e.target.value); }} />
      <Button variant="contained" sx={{ mt:1 }} onClick={() => save()}>Save</Button>
    </div>
  );
};
export default RecordNoteEditor; 