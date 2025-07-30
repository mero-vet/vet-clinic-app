import React, { useState } from 'react';
import { MdClose, MdMinimize } from 'react-icons/md';

const PerformSearchModal = ({ isOpen, onClose }) => {
  const [selectedSearch, setSelectedSearch] = useState('');
  const [comment, setComment] = useState('');
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [searchResults, setSearchResults] = useState('');

  const searchOptions = [
    {
      name: 'All Reminders',
      description: 'Reminders for all species and all reminders less than the maximum reminder count.'
    },
    {
      name: 'All Reminders - All Species and Just Juveniles',
      description: 'All species not deceased, reminder flag set to yes, reminder count less than the maximum.'
    },
    {
      name: 'All Reminders - Per Species',
      description: 'All species not deceased, reminder flag set to yes, reminder count less than the maximum.'
    },
    {
      name: 'All Reminders Emails Only',
      description: 'Reminders for all species and all reminders less than the maximum reminder count.'
    },
    {
      name: 'All Reminders Emails Postal Correct',
      description: 'Reminders for all species and all reminders less than the maximum reminder count.'
    },
    {
      name: 'All Reminders Text Only',
      description: 'Reminders for all species and all reminders less than the maximum reminder count.'
    },
    {
      name: 'All Reminders with Monetary Flags',
      description: 'Reminders for all species and all reminders less than the maximum reminder count.'
    },
    {
      name: 'All Specific Reminders',
      description: 'All species with send reminder flag yes, reminder count less than the maximum reminder count.'
    },
    {
      name: 'C- EMail Address',
      description: 'All clients who have an e-mail address, sorted by last name.'
    },
    {
      name: 'C- EMail Address CURRENT',
      description: 'All clients who have an e-mail address, sorted by last name.'
    },
    {
      name: 'C-All Active Clients',
      description: 'All clients who have been in the clinic during the last three years.'
    },
    {
      name: 'C-All Active Clients PetDesk',
      description: 'All clients who have been in the clinic during the last three years.'
    },
    {
      name: 'C-All Clients',
      description: 'All clients sorted by last name.'
    },
    {
      name: 'C-All Patients',
      description: 'All patients sorted by client, then by pet name.'
    },
    {
      name: 'C-Avian Clients',
      description: 'All clients with living avians.'
    },
    {
      name: 'C-Cat Clients',
      description: 'All clients with living cats.'
    },
    {
      name: 'C-City',
      description: 'All clients who live in a particular city.'
    },
    {
      name: 'C-Client Types',
      description: 'All clients who have a particular client type.'
    },
    {
      name: 'C-Dog Clients',
      description: 'All clients with living dogs.'
    },
    {
      name: 'C-Exotic Clients',
      description: 'All clients with living exotic pets.'
    },
    {
      name: 'C-Horse Clients',
      description: 'All clients with living horses.'
    },
    {
      name: 'C-Inactive Clients',
      description: 'All clients who have NOT been in the clinic during the last three years.'
    },
    {
      name: 'C-Large Animal Clients',
      description: 'All clients with living large animals.'
    },
    {
      name: 'C-Multiple Pet Clients',
      description: 'All clients who own more than one pet.'
    },
    {
      name: 'C-New Clients',
      description: 'All clients who became clients during a specified date range.'
    },
    {
      name: 'C-Single Pet Clients',
      description: 'All clients who own exactly one pet.'
    },
    {
      name: 'C-Zip Code',
      description: 'All clients who live in a particular zip code area.'
    }
  ];

  const handlePerformSearch = () => {
    if (selectedSearch) {
      // Generate a random number of records returned
      const recordCount = Math.floor(Math.random() * 20000) + 5000;
      setSearchResults(`Search '${selectedSearch}' complete: ${recordCount.toLocaleString()} records returned`);
      setSearchCompleted(true);
    }
  };

  const handleClose = () => {
    setSelectedSearch('');
    setComment('');
    setSearchCompleted(false);
    setSearchResults('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="perform-search-modal">
        {/* Title Bar */}
        <div className="modal-title-bar">
          <div className="title-left">
            <div className="app-icon"></div>
            <span>Perform Search</span>
          </div>
          <div className="title-buttons">
            <button className="title-btn minimize-btn">
              <MdMinimize size={12} />
            </button>
            <button className="title-btn">□</button>
            <button className="title-btn close-btn" onClick={handleClose}>
              <MdClose size={12} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <div className="search-label">Search to Perform:</div>
          
          <div className="search-table-container">
            <table className="search-table">
              <thead>
                <tr>
                  <th>Search Definition</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {searchOptions.map((option, index) => (
                  <tr 
                    key={index}
                    className={selectedSearch === option.name ? 'selected' : ''}
                    onClick={() => setSelectedSearch(option.name)}
                  >
                    <td>{option.name}</td>
                    <td>{option.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="history-section">
            <button className="history-btn">History</button>
          </div>

          <div className="comment-section">
            <label>Comment for This Search Result:</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-textarea"
              rows={4}
            />
          </div>

          <div className="modal-actions">
            {searchCompleted && (
              <div className="search-status">
                {searchResults}
              </div>
            )}
            <div className="action-buttons">
              <button 
                className="perform-btn" 
                disabled={!selectedSearch}
                onClick={handlePerformSearch}
              >
                Perform Search
              </button>
              <button className="close-modal-btn" onClick={handleClose}>Close</button>
            </div>
          </div>

          <div className="note-text">
            Note: your last search result, if there is one, will be deleted when you perform a search. Other users' search results will not be deleted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformSearchModal;
