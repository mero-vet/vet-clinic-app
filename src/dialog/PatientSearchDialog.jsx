import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DataGrid from '@mui/x-data-grid';
import { usePatientStore } from '../stores/usePatientStore';

const PatientSearchDialog = ({ open, onClose, onSelect }) => {
  const patients = usePatientStore(s => s.patients);
  const rows = patients.map(p => ({ id: p.id, last: p.clientLast, first: p.clientFirst, patient: p.name, phone: p.phone }));
  const columns = [
    { field:'last', headerName:'Last', width:130 },
    { field:'first', headerName:'First', width:130 },
    { field:'patient', headerName:'Patient', width:150 },
    { field:'phone', headerName:'Phone', width:130 },
  ];
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Patient Search</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Last Name" sx={{ my:1 }} />
        <div style={{ height:300 }}>
          <DataGrid rows={rows} columns={columns} onRowDoubleClick={params => { onSelect(params.id); }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PatientSearchDialog; 