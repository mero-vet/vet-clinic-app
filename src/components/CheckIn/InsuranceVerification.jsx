import React, { useState } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './InsuranceVerification.css';

const InsuranceVerification = ({ checkInId, clientId, onComplete }) => {
  const { verifyInfo } = useCheckIn();
  const [verificationData, setVerificationData] = useState({
    hasInsurance: false,
    provider: '',
    policyNumber: '',
    groupNumber: '',
    verified: false,
    cardOnFile: false,
    coverageActive: null,
    deductibleMet: false,
    copayAmount: '',
    notes: ''
  });
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const insuranceProviders = [
    'Trupanion',
    'Healthy Paws',
    'Embrace Pet Insurance',
    'Pets Best',
    'ASPCA Pet Health Insurance',
    'Nationwide Pet Insurance',
    'Figo Pet Insurance',
    'PetPlan',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerifyInsurance = async () => {
    setIsVerifying(true);
    
    // Simulate insurance verification API call
    setTimeout(() => {
      const mockVerification = {
        coverageActive: Math.random() > 0.2,
        deductibleMet: Math.random() > 0.5,
        coverageDetails: {
          annualLimit: '$10,000',
          deductible: '$250',
          reimbursement: '80%',
          waitingPeriod: 'Completed'
        }
      };
      
      setVerificationData(prev => ({
        ...prev,
        verified: true,
        coverageActive: mockVerification.coverageActive,
        deductibleMet: mockVerification.deductibleMet,
        ...mockVerification.coverageDetails
      }));
      
      setIsVerifying(false);
    }, 2000);
  };

  const handleSubmit = () => {
    try {
      verifyInfo(checkInId, 'insurance');
      onComplete?.(verificationData);
    } catch (err) {
      console.error('Failed to save insurance verification:', err);
    }
  };

  const getVerificationStatus = () => {
    if (!verificationData.hasInsurance) {
      return { status: 'no-insurance', message: 'No Insurance' };
    }
    if (!verificationData.verified) {
      return { status: 'pending', message: 'Pending Verification' };
    }
    if (!verificationData.coverageActive) {
      return { status: 'inactive', message: 'Coverage Inactive' };
    }
    return { status: 'active', message: 'Coverage Active' };
  };

  const status = getVerificationStatus();

  return (
    <div className="insurance-verification">
      <h3>Insurance Verification</h3>
      
      <div className="insurance-status">
        <div className={`status-indicator ${status.status}`}>
          {status.message}
        </div>
      </div>

      <div className="insurance-form">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={verificationData.hasInsurance}
              onChange={(e) => handleInputChange('hasInsurance', e.target.checked)}
            />
            <span>Client has pet insurance</span>
          </label>
        </div>

        {verificationData.hasInsurance && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Insurance Provider</label>
                <select
                  value={verificationData.provider}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                >
                  <option value="">Select provider...</option>
                  {insuranceProviders.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Policy Number</label>
                <input
                  type="text"
                  value={verificationData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  placeholder="Enter policy number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Group Number (if applicable)</label>
                <input
                  type="text"
                  value={verificationData.groupNumber}
                  onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                  placeholder="Enter group number"
                />
              </div>
              
              <div className="form-group">
                <label>Copay Amount</label>
                <input
                  type="text"
                  value={verificationData.copayAmount}
                  onChange={(e) => handleInputChange('copayAmount', e.target.value)}
                  placeholder="$0.00"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={verificationData.cardOnFile}
                  onChange={(e) => handleInputChange('cardOnFile', e.target.checked)}
                />
                <span>Insurance card on file</span>
              </label>
            </div>

            <div className="verification-actions">
              <button
                className="btn-verify"
                onClick={handleVerifyInsurance}
                disabled={!verificationData.provider || !verificationData.policyNumber || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Coverage'}
              </button>
              
              {verificationData.verified && (
                <button
                  className="btn-details"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </button>
              )}
            </div>

            {verificationData.verified && showDetails && (
              <div className="coverage-details">
                <h4>Coverage Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Annual Limit:</span>
                    <span className="detail-value">{verificationData.annualLimit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deductible:</span>
                    <span className="detail-value">{verificationData.deductible}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reimbursement:</span>
                    <span className="detail-value">{verificationData.reimbursement}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deductible Met:</span>
                    <span className="detail-value">
                      {verificationData.deductibleMet ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={verificationData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional insurance notes..."
            rows={3}
          />
        </div>
      </div>

      <div className="insurance-actions">
        <button 
          className="btn-secondary"
          onClick={() => onComplete?.(null)}
        >
          Skip
        </button>
        <button 
          className="btn-primary"
          onClick={handleSubmit}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default InsuranceVerification;