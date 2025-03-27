import React from 'react';
import { NoteProvider } from './Notes/NoteContext';
import AddNoteForm from './Notes/AddNoteForm';
import NoteList from './Notes/NoteList';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import { usePIMS } from '../context/PIMSContext';

/**
 * NoteScreen
 * Wraps everything in a NoteProvider. Uses AddNoteForm and NoteList.
 */
function NoteScreen() {
  const { config } = usePIMS();

  return (
    <NoteProvider>
      <PIMSScreenWrapper title={config.screenLabels.notes}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <AddNoteForm />
          <NoteList />
        </div>
      </PIMSScreenWrapper>
    </NoteProvider>
  );
}

export default NoteScreen;