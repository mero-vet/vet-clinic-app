import { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import '../styles/WindowsClassic.css';

const PatientCheckin = () => {
  const [formData, setFormData] = useState({
    // Client Information
    clientId: '',
    clientName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    stateProv: '',
    postalCode: '',
    balanceDue: '',

    // Patient Information
    patientId: '',
    patientName: '',
    species: 'Canine',
    sex: 'Male',
    breed: '',
    birthDate: '',
    weightDate: '',
    weight: '',
    additionalNotes: '',
    alertNotes: '',

    // Visit Information
    primaryReason: '',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    rdvmName: '',

    // Staff Information
    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="windows-classic">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Patient Check-in/out</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body">
          <div className="section-grid">
            {/* Client Information Section */}
            <fieldset>
              <legend>Client Information</legend>
              <div className="form-row">
                <label>Client ID:</label>
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                />
                <label>Balance Due:</label>
                <input
                  type="text"
                  name="balanceDue"
                  value={formData.balanceDue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Name:</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <label>State/Prov:</label>
                <input
                  type="text"
                  name="stateProv"
                  value={formData.stateProv}
                  onChange={handleInputChange}
                />
                <label>Postal Code:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>

            {/* Patient Information Section */}
            <fieldset>
              <legend>Patient Information</legend>
              <div className="form-row">
                <label>Patient ID:</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Name:</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Species:</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                >
                  <option value="Canine">Canine</option>
                  <option value="Feline">Feline</option>
                  <option value="Other">Other</option>
                </select>
                <label>Sex:</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-row">
                <label>Breed:</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Birth Date:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Weight:</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
                <label>Date:</label>
                <input
                  type="date"
                  name="weightDate"
                  value={formData.weightDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Additional Notes:</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Alert Notes:</label>
                <textarea
                  name="alertNotes"
                  value={formData.alertNotes}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>

            {/* Visit Information Section */}
            <fieldset>
              <legend>Reason for Visit</legend>
              <div className="form-row">
                <label>Primary:</label>
                <input
                  type="text"
                  name="primaryReason"
                  value={formData.primaryReason}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Secondary:</label>
                <input
                  type="text"
                  name="secondaryReason"
                  value={formData.secondaryReason}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Room:</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Type:</label>
                <select
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleInputChange}
                >
                  <option value="Outpatient">Outpatient</option>
                  <option value="Inpatient">Inpatient</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-row">
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>RDVM:</label>
                <input
                  type="text"
                  name="rdvmName"
                  value={formData.rdvmName}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>

            {/* Check-In Information */}
            <fieldset>
              <legend>Check-In/Out Information</legend>
              <div className="form-row">
                <label>Staff ID:</label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Checked In By:</label>
                <input
                  type="text"
                  name="checkedInBy"
                  value={formData.checkedInBy}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Check-In Date:</label>
                <input
                  type="datetime-local"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>Check-Out Date:</label>
                <input
                  type="datetime-local"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>
          </div>

          <div className="button-row">
            <button className="windows-button">Check-in</button>
            <button className="windows-button">Check-out</button>
            <button className="windows-button">Travel Sheet</button>
            <button className="windows-button">Make Appt</button>
            <button className="windows-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCheckin;