import React from 'react';
import { usePatientStore } from '../stores/usePatientStore';
import Avatar from '@mui/material/Avatar';

/**
 * RecentPatientsSidebar - Left sidebar showing last 6 accessed patients
 * Matches Impromed Infinity's Recent Patients strip
 */
const RecentPatientsSidebar = () => {
  const recentPatients = usePatientStore(s => s.recentPatients);
  const addToRecent = usePatientStore(s => s.addToRecent);

  const handlePatientClick = (patient) => {
    addToRecent(patient);
    // Navigate to patient chart (placeholder)
    console.log('Navigate to patient:', patient.name);
  };

  return (
    <div className="recent-patients-sidebar">
      <div className="sidebar-header">
        <h4>Recent Patients</h4>
      </div>
      <div className="patients-list">
        {recentPatients.map((patient) => (
          <div
            key={patient.id}
            className="patient-item"
            onClick={() => handlePatientClick(patient)}
            title={`${patient.species} - ID: ${patient.id}`}
          >
            <Avatar 
              sx={{ width: 24, height: 24, fontSize: 12 }}
              className="patient-avatar"
            >
              {patient.name.charAt(0)}
            </Avatar>
            <div className="patient-info">
              <div className="patient-name">{patient.name}</div>
              <div className="client-surname">{patient.clientLast}</div>
            </div>
          </div>
        ))}
        {recentPatients.length === 0 && (
          <div className="no-recent">
            No recent patients
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPatientsSidebar;
