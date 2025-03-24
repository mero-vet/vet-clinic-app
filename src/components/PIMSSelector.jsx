import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePIMS } from '../context/PIMSContext';
import pimsConfigurations from '../config/pimsConfigurations';
import { MdSettings, MdClose } from 'react-icons/md';

const PIMSSelector = () => {
    const { currentPIMS, switchPIMS } = usePIMS();
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    // Ensure currentPIMS matches URL on mount and navigation
    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const pimsFromURL = pathSegments[0];

        if (pimsFromURL && pimsConfigurations[pimsFromURL] && pimsFromURL !== currentPIMS) {
            // This ensures the dropdown shows the correct PIMS based on URL
            switchPIMS(pimsFromURL);
        }
    }, [location.pathname, currentPIMS, switchPIMS]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="pims-selector" style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            backgroundColor: isExpanded ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
            padding: isExpanded ? '10px 15px' : '5px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
        }}>
            {isExpanded ? (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>PIMS Selection</span>
                        <MdClose
                            size={18}
                            style={{ cursor: 'pointer' }}
                            onClick={toggleExpanded}
                        />
                    </div>
                    <label htmlFor="pims-select">Select PIMS: </label>
                    <select
                        id="pims-select"
                        value={currentPIMS}
                        onChange={(e) => switchPIMS(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            fontFamily: 'var(--font-family)',
                            backgroundColor: 'var(--background-color)',
                            color: 'var(--text-color)',
                            marginLeft: '8px'
                        }}
                    >
                        {Object.keys(pimsConfigurations).map(pimsKey => (
                            <option key={pimsKey} value={pimsKey}>
                                {pimsConfigurations[pimsKey].name}
                            </option>
                        ))}
                    </select>
                </>
            ) : (
                <MdSettings
                    size={20}
                    style={{ cursor: 'pointer' }}
                    onClick={toggleExpanded}
                    title="PIMS Settings"
                />
            )}
        </div>
    );
};

export default PIMSSelector; 