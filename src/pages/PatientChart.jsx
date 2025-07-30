import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientStore } from '../stores/usePatientStore';
import PatientBanner from '../components/PatientBanner';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DataGrid } from '@mui/x-data-grid';

const PatientChart = () => {
  const { id } = useParams();
  const patient = usePatientStore(s => s.patients.find(p => String(p.id) === id));

  const rows = [
    { id:1, date:'2025-07-30', title:'Vaccination', author:'Dr. Smith', charges:'Yes' },
  ];
  const columns = [
    { field:'date', headerName:'Date', width:120 },
    { field:'title', headerName:'Title', width:180 },
    { field:'author', headerName:'Author', width:130 },
    { field:'charges', headerName:'Charges Posted', width:160 },
  ];

  return (
    <div>
      <PatientBanner patient={patient} />
      <Tabs orientation="vertical" value={0} sx={{ height:300 }}>
        <Tab label="Medical Records" />
      </Tabs>
      <div style={{ height:300 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
};
export default PatientChart; 