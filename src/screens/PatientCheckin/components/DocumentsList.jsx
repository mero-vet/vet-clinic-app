import React from 'react';

function DocumentsList({ styles = {} }) {
  // Example docs to mimic screenshot data
  const documents = [
    { id: 4676, description: 'Wellness_in_Dogs.doc' },
    { id: 3791, description: 'Parasite Prevention handout' },
  ];

  // Default styles if none are provided
  const defaultStyles = {
    fieldset: {},
    legend: {},
    table: { border: '1px solid #ccc' },
    cell: { border: '1px solid #ccc', padding: '4px' }
  };

  const s = styles || defaultStyles;

  // Determine table cell styles based on PIMS theme
  const tableCellStyle = s.cell || { border: '1px solid #ccc', padding: '4px' };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    ...(s.table || {})
  };

  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>Documents</legend>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableCellStyle}>Doc ID</th>
            <th style={tableCellStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td style={tableCellStyle} colSpan={2}>
                No Documents
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td style={tableCellStyle}>{doc.id}</td>
                <td style={tableCellStyle}>{doc.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </fieldset>
  );
}

export default DocumentsList;