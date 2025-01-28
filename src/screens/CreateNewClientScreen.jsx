import React, { useState } from 'react';
import NewClientForm from './CreateNewClient/components/NewClientForm';
import ClientCreationSuccess from './ClientCreationSuccessScreen';
import { createClient } from '../services/ClientService';

function CreateNewClientScreen() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (clientData) => {
    try {
      const response = await createClient(clientData);
      if (response.success) {
        setSubmitted(true);
      } else {
        alert('Failed to create client.');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('An unexpected error occurred.');
    }
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

export default CreateNewClientScreen;