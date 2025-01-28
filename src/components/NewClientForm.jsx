import React, { useState } from 'react';

/**
 * NewClientForm
 * A controlled form that collects basic new client information.
 */
function NewClientForm({ onSubmit }) {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(clientData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', textAlign: 'left' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="firstName">First Name:</label><br />
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={clientData.firstName}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="lastName">Last Name:</label><br />
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={clientData.lastName}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={clientData.email}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="phone">Phone:</label><br />
        <input
          type="tel"
          id="phone"
          name="phone"
          value={clientData.phone}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <button type="submit" style={{ marginTop: '1rem' }}>
        Create Client
      </button>
    </form>
  );
}

export default NewClientForm;