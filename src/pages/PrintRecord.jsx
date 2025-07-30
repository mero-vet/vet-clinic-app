import React from 'react';
import { useParams } from 'react-router-dom';

const PrintRecord = () => {
  const { noteId } = useParams();
  return (
    <div style={{ padding: 32 }}>
      <h1>Record #{noteId}</h1>
      <p>Printable content placeholder</p>
    </div>
  );
};
export default PrintRecord; 