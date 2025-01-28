import React from 'react';

function DocumentsList() {
  // Example docs to mimic screenshot data
  const documents = [
    { id: 4676, description: 'Wellness_in_Dogs.doc' },
    { id: 3791, description: 'Parasite Prevention handout' },
  ];

  return (
    <fieldset>
      <legend>Documents</legend>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Doc ID</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '4px' }} colSpan={2}>
                No Documents
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{doc.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{doc.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </fieldset>
  );
}

export default DocumentsList;