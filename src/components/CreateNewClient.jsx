import React, { useState } from 'react';
import NewClientForm from './NewClientForm';
import ClientCreationSuccess from './ClientCreationSuccess';

/**
 * CreateNewClient
 * This component manages the state to show either the NewClientForm or a success message.
 */
function CreateNewClient() {
  const [submitted, setSubmitted] = useState(false);

  // Placeholder submit handler
  const handleFormSubmit = (clientData) => {
    // In a real app, we'd call an API or context function here.
    // For now, we simply toggle the submitted state to show a success message.
    console.log('Submitted Client:', clientData);
    setSubmitted(true);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Create New Client</h1>
      {submitted ? (
        <ClientCreationSuccess />
      ) : (
        <NewClientForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}

export default CreateNewClient;