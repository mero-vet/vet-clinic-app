import React from 'react';

/**
 * ClientCreationSuccess
 * Renders a simple confirmation message indicating the client was created.
 */
function ClientCreationSuccess() {
  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '16px' }}>
      <h2>Client Created Successfully!</h2>
      <p>Your new client has been created. You can now view or edit their details as needed.</p>
    </div>
  );
}

export default ClientCreationSuccess;