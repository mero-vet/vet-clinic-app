import React, { useState, useEffect } from 'react';
import { MdClose, MdMinimize, MdCropSquare } from 'react-icons/md';

const PatientSearchModal = ({ isOpen, onClose, searchTerm = '' }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Dummy patient data - reordered to put Bean-Betsy Marshall around position 11
  const allPatients = [
    { id: 'C', accountId: 'Beans', name: 'Brian', firstName: 'Brian', lastName: 'Maniscalco', sex: 'MN', breed: 'French Bulldog', species: 'Canine', coatColor: 'Fawn', clientNum: '( )' },
    { id: 'D', accountId: 'Beanie', name: 'Rachel', firstName: 'Rachel', lastName: 'Rieman', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Tabby', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Justin', firstName: 'Justin', lastName: 'Padilla', sex: 'M', breed: 'Pomeranian', species: 'Canine', coatColor: 'Black', clientNum: '( )' },
    { id: 'K', accountId: 'Jelly Bean', name: 'Aaron', firstName: 'Aaron', lastName: 'Friketich', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Calico', clientNum: '( )' },
    { id: 'A', accountId: 'Coco-Bean', name: 'Rebecca', firstName: 'Rebecca', lastName: 'Coffey', sex: 'FS', breed: 'DLH', species: 'Feline', coatColor: 'Black', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Ryan', firstName: 'Ryan', lastName: 'Simpson', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Black/White', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Tyler', firstName: 'Tyler', lastName: 'Nolan', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Gray/Brown/White', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Caitie', firstName: 'Caitie', lastName: 'Van Dore', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Brown Tabby', clientNum: '( )' },
    { id: 'B', accountId: 'Cocoa Bean', name: 'Tiara', firstName: 'Tiara', lastName: 'Crawford', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Tortie', clientNum: '(804)' },
    { id: 'C', accountId: 'Beanie', name: 'Robin', firstName: 'Robin', lastName: 'Bernath', sex: 'FS', breed: 'Terrier Mx', species: 'Canine', coatColor: 'Black/Grey', clientNum: '(757)' },
    { id: 'B', accountId: 'Jellybean', name: 'Sarah', firstName: 'Sarah', lastName: 'Hill', sex: 'FS', breed: 'DSH', species: 'Feline', coatColor: 'Calico', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Betsy', firstName: 'Betsy', lastName: 'Marshall', sex: 'MN', breed: 'Beagle Mix', species: 'Canine', coatColor: 'Tri-Color', clientNum: '( )' },
    { id: 'A', accountId: 'Jelly Bean', name: 'Emily', firstName: 'Emily', lastName: 'Burnett', sex: 'FS', breed: 'Australian Cattle Dog', species: 'Canine', coatColor: 'Blue', clientNum: '( )' },
    { id: 'A', accountId: 'Bean', name: 'Samantha', firstName: 'Samantha', lastName: 'Gutierrez', sex: 'FS', breed: 'Chihuahua Mix', species: 'Canine', coatColor: 'Tan/White/Brown', clientNum: '( )' },
    { id: 'B', accountId: 'Beans', name: 'Emily', firstName: 'Emily', lastName: 'Bachardy', sex: 'MN', breed: 'DLH', species: 'Feline', coatColor: 'Gray/White', clientNum: '( )' },
    { id: 'B', accountId: 'Bean', name: 'Raven', firstName: 'Raven', lastName: 'Kortyka', sex: 'MN', breed: 'Dachshund', species: 'Canine', coatColor: 'Red', clientNum: '(816)' },
    { id: 'B', accountId: 'Beans', name: 'Chris', firstName: 'Chris', lastName: 'Dillon', sex: 'FS', breed: 'DMH', species: 'Feline', coatColor: 'Gray/Black', clientNum: '(765)' }
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = allPatients.filter(patient =>
        patient.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
      if (filtered.length > 0) {
        setSelectedPatient(null); // Don't auto-select any patient
      }
    } else {
      setFilteredPatients(allPatients);
      setSelectedPatient(null); // Don't auto-select any patient
    }
  }, [searchTerm]);

  const handleRowClick = (index) => {
    setSelectedPatient(index);
  };

  const handleSelect = () => {
    if (selectedPatient !== null && filteredPatients[selectedPatient]) {
      const selectedPatientData = filteredPatients[selectedPatient];
      console.log('Selected patient:', selectedPatientData);
      onClose();
      // Dispatch event to open client modal with selected patient data
      window.dispatchEvent(new CustomEvent('openClientModal', {
        detail: selectedPatientData
      }));
    }
  };

  const getRowColor = (patient) => {
    if (patient.accountId.toLowerCase().includes('bean')) {
      if (patient.accountId.toLowerCase().includes('jelly')) {
        return '#ff9999'; // Light red for Jelly Bean variants
      } else if (patient.accountId.toLowerCase().includes('cocoa')) {
        return '#ff9999'; // Light red for Cocoa Bean
      } else if (patient.accountId === 'Beans') {
        return '#9999ff'; // Light blue for Beans
      } else if (patient.accountId === 'Bean') {
        return '#ff9999'; // Light red for Bean
      }
    }
    if (patient.accountId === 'Beanie') {
      return '#ff9999'; // Light red for Beanie
    }
    return '#9999ff'; // Default blue
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-search-modal">
        {/* Title Bar */}
        <div className="patient-search-title-bar">
          <div className="title-left">
            <span className="search-icon">🔍</span>
            <span className="title-text">Patient Search Results</span>
          </div>
          <div className="title-buttons">
            <button className="title-btn minimize-btn">
              <MdMinimize size={12} />
            </button>
            <button className="title-btn maximize-btn">
              <MdCropSquare size={12} />
            </button>
            <button className="title-btn close-btn" onClick={onClose}>
              <MdClose size={12} />
            </button>
          </div>
        </div>

        {/* Search Header */}
        <div className="search-header">
          <div className="search-info">
            <span className="patient-icon">
              {selectedPatient !== null && filteredPatients[selectedPatient]
                ? (filteredPatients[selectedPatient].species === 'Canine' ? '🐕' : '🐱')
                : '🐕'
              }
            </span>
            <span className="patient-name">
              {selectedPatient !== null && filteredPatients[selectedPatient]
                ? `${filteredPatients[selectedPatient].firstName} ${filteredPatients[selectedPatient].lastName} #${selectedPatient + 1}`
                : 'No Patient Selected'
              }
            </span>
          </div>
          <div className="search-options">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Active patient(s) only</span>
            </label>
            <div className="action-buttons">
              <button className="action-btn details-btn">Show Patient Details</button>
              <button className="action-btn select-btn" onClick={handleSelect}>Select</button>
              <button className="action-btn cancel-btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="patient-table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient - Patient Account ID</th>
                <th>Patient - Patient Name</th>
                <th>Client - First Name</th>
                <th>Client - Last Name</th>
                <th>Patient - Sex</th>
                <th>Patient - Breed</th>
                <th>Patient - Species</th>
                <th>Patient - Coat Color</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr
                  key={index}
                  className={selectedPatient === index ? 'selected' : ''}
                  onClick={() => handleRowClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ backgroundColor: getRowColor(patient), fontWeight: 'bold' }}>
                    {patient.accountId}
                  </td>
                  <td>{patient.name}</td>
                  <td>{patient.firstName}</td>
                  <td>{patient.lastName}</td>
                  <td>{patient.sex}</td>
                  <td>{patient.breed}</td>
                  <td>{patient.species}</td>
                  <td>{patient.coatColor}</td>
                  <td>{patient.clientNum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="search-footer">
          <span className="search-results">Located {filteredPatients.length} Patient(s) in 0.09 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default PatientSearchModal; 