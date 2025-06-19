import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewClientForm from './CreateNewClient/components/NewClientForm';
import PatientRegistrationForm from './PatientRegistration/PatientRegistrationForm';
import ClientCreationSuccess from './ClientCreationSuccessScreen';
import { createClient, checkDuplicateClients } from '../services/ClientService';
import { createPatient, generateReminders } from '../services/PatientService';
import { usePatient } from '../context/PatientContext';

function CreateNewClientScreen() {
  const navigate = useNavigate();
  const { addPatient } = usePatient();
  const [currentStep, setCurrentStep] = useState('client'); // 'client', 'duplicate-check', 'patient', 'success'
  const [createdClient, setCreatedClient] = useState(null);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [duplicateClients, setDuplicateClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClientFormSubmit = async (clientData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for duplicates first
      const duplicates = await checkDuplicateClients(clientData);
      
      if (duplicates.length > 0) {
        setDuplicateClients(duplicates);
        setCurrentStep('duplicate-check');
        setCreatedClient(clientData); // Store temporarily
      } else {
        // No duplicates, create client
        await createClientAndProceed(clientData);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      setError('Failed to check for duplicate clients.');
    } finally {
      setIsLoading(false);
    }
  };

  const createClientAndProceed = async (clientData) => {
    try {
      const response = await createClient(clientData);
      if (response.success) {
        setCreatedClient(response.data);
        setCurrentStep('patient');
      } else {
        setError('Failed to create client.');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      setError('An unexpected error occurred while creating the client.');
    }
  };

  const handleDuplicateDecision = async (proceed) => {
    if (proceed && createdClient) {
      setIsLoading(true);
      await createClientAndProceed(createdClient);
      setIsLoading(false);
    } else {
      // Go back to edit client form
      setCurrentStep('client');
      setDuplicateClients([]);
    }
  };

  const handlePatientFormSubmit = async (patientData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createPatient(patientData);
      if (response.success) {
        // Generate initial reminders
        const reminders = generateReminders(response.data);
        
        // Convert to PatientContext format and add to context
        const contextPatient = {
          clientId: response.data.clientId,
          clientFirstName: createdClient.firstName,
          clientLastName: createdClient.lastName,
          clientEmail: createdClient.email,
          emailDeclined: false,
          phoneHome: createdClient.phone,
          phoneExt: '',
          phoneDeclined: false,
          balanceDue: '0.00',
          address: createdClient.street,
          city: createdClient.city,
          stateProv: createdClient.state,
          postalCode: createdClient.zip,
          patientId: response.data.patientId,
          patientName: response.data.name,
          species: response.data.species === 'dog' ? 'Canine' : response.data.species === 'cat' ? 'Feline' : 'Other',
          sex: response.data.sex,
          breed: response.data.breed,
          birthDate: response.data.dateOfBirth,
          ageYears: '',
          ageMonths: '',
          ageDays: '',
          weightDate: new Date().toISOString().split('T')[0],
          weight: response.data.weight || '',
          additionalNotes: '',
          alertNotes: response.data.alerts ? response.data.alerts.join(', ') : '',
          microchip: response.data.microchip || '',
          rabiesTag: response.data.rabiesTag || '',
          primaryReason: '',
          secondaryReason: '',
          room: '',
          visitType: 'Outpatient',
          status: '',
          ward: '',
          cage: '',
          rdvmName: '',
          referralRecheck: false,
          staffId: '',
          checkedInBy: '',
          checkInDate: '',
          checkOutDate: '',
          medicalHistory: []
        };
        
        // Add to PatientContext
        addPatient(contextPatient);
        
        setRegisteredPatients([...registeredPatients, { ...response.data, reminders }]);
        
        // Ask if they want to add another pet
        if (window.confirm('Patient registered successfully! Would you like to add another pet for this client?')) {
          // Stay on patient form
          setCurrentStep('patient');
        } else {
          // Go to success screen
          setCurrentStep('success');
        }
      } else {
        setError('Failed to register patient.');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setError('An unexpected error occurred while registering the patient.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPatientRegistration = () => {
    setCurrentStep('success');
  };

  const handleNavigateToPatientCheckin = () => {
    if (registeredPatients.length > 0) {
      // Navigate to patient check-in with the first registered patient
      navigate(`/patient-checkin?patientId=${registeredPatients[0].patientId}`);
    } else {
      navigate('/patient-checkin');
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'client', label: 'Client Info' },
      { key: 'patient', label: 'Add Pets' },
      { key: 'success', label: 'Complete' }
    ];

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        {steps.map((step, index) => (
          <div key={step.key} style={{ textAlign: 'center' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: currentStep === step.key || 
                            (currentStep === 'duplicate-check' && step.key === 'client') ||
                            (currentStep === 'success' && index < 2) ||
                            (currentStep === 'patient' && index < 1) 
                            ? '#000080' : '#ccc',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem'
            }}>
              {index + 1}
            </div>
            <div style={{ fontSize: '0.875rem' }}>{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ margin: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
      <h1>New Client Registration</h1>
      
      {renderStepIndicator()}
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #c00', 
          padding: '1rem', 
          marginBottom: '1rem',
          color: '#c00'
        }}>
          {error}
        </div>
      )}
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Processing...</p>
        </div>
      )}
      
      {!isLoading && currentStep === 'client' && (
        <NewClientForm onSubmit={handleClientFormSubmit} />
      )}
      
      {!isLoading && currentStep === 'duplicate-check' && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #856404', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3>Potential Duplicate Clients Found</h3>
          <p>The following existing clients match some of the information you entered:</p>
          
          <ul style={{ margin: '1rem 0' }}>
            {duplicateClients.map((client, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{client.firstName} {client.lastName}</strong> - 
                {client.email} - {client.phone}
                <br />
                Client ID: {client.clientId}
              </li>
            ))}
          </ul>
          
          <p>Would you like to continue creating a new client anyway?</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => handleDuplicateDecision(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#000080',
                color: '#fff',
                border: '2px solid #000',
                cursor: 'pointer'
              }}
            >
              Yes, Create New Client
            </button>
            <button
              onClick={() => handleDuplicateDecision(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #000',
                cursor: 'pointer'
              }}
            >
              No, Go Back
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && currentStep === 'patient' && createdClient && (
        <div>
          <PatientRegistrationForm
            clientId={createdClient.clientId}
            clientName={`${createdClient.firstName} ${createdClient.lastName}`}
            onSubmit={handlePatientFormSubmit}
            onCancel={handleSkipPatientRegistration}
          />
          
          {registeredPatients.length > 0 && (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc'
            }}>
              <h4>Registered Pets:</h4>
              <ul>
                {registeredPatients.map((patient, index) => (
                  <li key={index}>
                    {patient.name} - {patient.species} ({patient.breed})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={handleSkipPatientRegistration}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #666',
                cursor: 'pointer'
              }}
            >
              Skip to Complete Registration
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && currentStep === 'success' && (
        <ClientCreationSuccess 
          client={createdClient}
          patients={registeredPatients}
          onNavigateToCheckin={handleNavigateToPatientCheckin}
          onAddMorePatients={() => setCurrentStep('patient')}
          onClose={() => navigate('/')}
        />
      )}
    </div>
  );
}

export default CreateNewClientScreen;