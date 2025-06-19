import React, { useState, useRef } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './ConsentForms.css';

const ConsentForms = ({ checkInId, onComplete }) => {
  const { addConsent } = useCheckIn();
  const signatureRef = useRef(null);
  const [consents, setConsents] = useState({
    treatment: false,
    anesthesia: false,
    surgery: false,
    boarding: false,
    photography: false,
    emergency: false
  });
  
  const [signatures, setSignatures] = useState({
    treatment: '',
    anesthesia: '',
    surgery: '',
    emergency: ''
  });
  
  const [showSignaturePad, setShowSignaturePad] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const consentDescriptions = {
    treatment: {
      title: 'General Treatment Consent',
      description: 'I authorize the veterinary staff to examine, prescribe medication, and perform diagnostic procedures as deemed necessary for my pet.',
      required: true
    },
    anesthesia: {
      title: 'Anesthesia Consent',
      description: 'I understand that anesthesia carries inherent risks and authorize its use for procedures requiring sedation.',
      required: false
    },
    surgery: {
      title: 'Surgical Consent',
      description: 'I authorize the surgical procedure(s) discussed and understand the associated risks.',
      required: false
    },
    boarding: {
      title: 'Boarding Agreement',
      description: 'I agree to the boarding terms and understand the facility policies.',
      required: false
    },
    photography: {
      title: 'Photography Release',
      description: 'I consent to photographs being taken for medical records and potentially for educational purposes.',
      required: false
    },
    emergency: {
      title: 'Emergency Treatment Authorization',
      description: 'In case of emergency, I authorize necessary life-saving treatment up to $______',
      required: true
    }
  };

  const handleConsentToggle = (consentType) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: !prev[consentType]
    }));
  };

  const handleSignatureClick = (consentType) => {
    setShowSignaturePad(consentType);
  };

  const handleSignatureSave = () => {
    if (showSignaturePad && signatureRef.current) {
      // In a real app, would capture actual signature
      const signature = `Signed by client at ${new Date().toLocaleTimeString()}`;
      setSignatures(prev => ({
        ...prev,
        [showSignaturePad]: signature
      }));
      setShowSignaturePad(null);
    }
  };

  const handleSubmit = () => {
    // Save consents
    Object.entries(consents).forEach(([type, consented]) => {
      if (consented) {
        addConsent(checkInId, type, signatures[type] || null);
      }
    });
    
    onComplete?.(consents);
  };

  const requiredConsentsComplete = () => {
    return Object.entries(consentDescriptions).every(([type, desc]) => {
      if (desc.required) {
        return consents[type] && (signatures[type] || !requiresSignature(type));
      }
      return true;
    });
  };

  const requiresSignature = (type) => {
    return ['treatment', 'anesthesia', 'surgery', 'emergency'].includes(type);
  };

  return (
    <div className="consent-forms">
      <h3>Consent Forms</h3>
      
      <div className="consent-list">
        {Object.entries(consentDescriptions).map(([type, desc]) => (
          <div key={type} className="consent-item">
            <div className="consent-header">
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  checked={consents[type]}
                  onChange={() => handleConsentToggle(type)}
                />
                <span className="consent-title">
                  {desc.title}
                  {desc.required && <span className="required">*</span>}
                </span>
              </label>
              
              {consents[type] && requiresSignature(type) && (
                <button
                  className={`signature-btn ${signatures[type] ? 'signed' : ''}`}
                  onClick={() => handleSignatureClick(type)}
                >
                  {signatures[type] ? '✓ Signed' : 'Sign'}
                </button>
              )}
            </div>
            
            <p className="consent-description">{desc.description}</p>
            
            {type === 'emergency' && consents[type] && (
              <div className="emergency-limit">
                <label>Emergency treatment limit: $</label>
                <input
                  type="text"
                  placeholder="500"
                  className="limit-input"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {showSignaturePad && (
        <div className="signature-modal">
          <div className="signature-content">
            <h4>Client Signature</h4>
            <div 
              ref={signatureRef}
              className="signature-pad"
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
            >
              <p className="signature-placeholder">
                [Signature pad would be implemented here]
              </p>
            </div>
            <div className="signature-actions">
              <button onClick={() => setShowSignaturePad(null)}>Cancel</button>
              <button onClick={() => {
                // Clear signature
                if (signatureRef.current) {
                  // Clear canvas in real implementation
                }
              }}>Clear</button>
              <button onClick={handleSignatureSave} className="save-btn">
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="consent-summary">
        <p className="required-note">* Required consents</p>
        {!requiredConsentsComplete() && (
          <p className="incomplete-warning">
            Please complete all required consents before proceeding
          </p>
        )}
      </div>

      <div className="consent-actions">
        <button 
          className="btn-secondary"
          onClick={() => onComplete?.(null)}
        >
          Skip
        </button>
        <button 
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!requiredConsentsComplete()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConsentForms;