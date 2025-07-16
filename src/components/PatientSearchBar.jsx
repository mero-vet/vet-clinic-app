import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../context/PatientContext';

const PatientSearchBar = () => {
  const { searchPatients, setActivePatient, patientData } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchPatients(searchTerm);
      setSearchResults(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, searchPatients]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchResults.length > 0) {
      const patientToLoad = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      setActivePatient(patientToLoad);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setActivePatient(patient);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectPatient(searchResults[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="patient-search-bar" style={{ position: 'relative', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="patient-search">Patient Search:</label>
        <input
          ref={searchInputRef}
          id="patient-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          placeholder="Search by patient or owner name..."
          data-testid="patient-search-field"
          aria-label="Search patients by name or owner name"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="patient-search-results"
          aria-activedescendant={selectedIndex >= 0 ? `patient-result-${searchResults[selectedIndex]?.patientId}` : undefined}
          style={{ 
            padding: '4px 8px',
            width: '300px',
            border: '2px inset #dfdfdf',
            backgroundColor: 'white'
          }}
        />
        <button 
          id="patient-search-button"
          onClick={handleSearch}
          disabled={searchResults.length === 0}
          className="windows-button"
          data-testid="patient-search-submit"
          aria-label="Search for patients"
          style={{ padding: '4px 16px' }}
        >
          Search
        </button>
        {patientData.patientName && (
          <span style={{ marginLeft: '20px', color: '#333' }}>
            Current Patient: <strong>{patientData.patientName}</strong> ({patientData.clientFirstName} {patientData.clientLastName})
          </span>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && searchResults.length > 0 && (
        <div 
          ref={suggestionsRef}
          id="patient-search-results"
          className="search-suggestions"
          role="listbox"
          aria-label="Patient search results"
          data-testid="patient-search-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: '100px',
            width: '300px',
            backgroundColor: 'white',
            border: '2px solid #000',
            borderTop: 'none',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {searchResults.map((patient, index) => (
            <div
              key={patient.patientId}
              id={`patient-result-${patient.patientId}`}
              className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelectPatient(patient)}
              role="option"
              aria-selected={index === selectedIndex}
              data-testid={`patient-search-result-${index}`}
              data-patient-id={patient.patientId}
              data-patient-name={patient.patientName}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #ccc',
                backgroundColor: index === selectedIndex ? '#0000FF' : 'white',
                color: index === selectedIndex ? 'white' : 'black'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div style={{ fontWeight: 'bold' }}>
                {patient.patientName} - {patient.species}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Owner: {patient.clientFirstName} {patient.clientLastName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;