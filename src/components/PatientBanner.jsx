import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';

const PatientBanner = ({ patient }) => {
  if (!patient) return null;
  const { name, age, species, breed, clientFirst, clientLast, phone } = patient;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--primary-color)',
        color: '#fff',
        padding: '4px 12px',
        height: 36,
      }}
    >
      <Avatar sx={{ width: 28, height: 28 }}>{name.charAt(0)}</Avatar>
      <div style={{ fontSize: 12 }}>
        <strong>{name}</strong> ({age}) – {species}/{breed}
        {' | '}Owner: {clientFirst} {clientLast} {phone && `(${phone})`}
      </div>
    </div>
  );
};

PatientBanner.propTypes = { patient: PropTypes.object };
export default PatientBanner; 