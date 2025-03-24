import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import PIMS configurations
import pimsConfigurations from '../config/pimsConfigurations';
import { getPIMSFromPath, createPathForPIMSSwitch } from '../utils/urlUtils';

// Create context
const PIMSContext = createContext();

// Custom hook for using the PIMS context
export const usePIMS = () => {
    const context = useContext(PIMSContext);
    if (!context) {
        throw new Error('usePIMS must be used within a PIMSProvider');
    }
    return context;
};

// Provider component
export const PIMSProvider = ({ children }) => {
    const [currentPIMS, setCurrentPIMS] = useState('cornerstone');
    const navigate = useNavigate();
    const location = useLocation();
    const initialRender = useRef(true);

    // Extract PIMS from URL on initial load and when URL changes
    useEffect(() => {
        const pimsFromURL = getPIMSFromPath(location.pathname);

        if (pimsConfigurations[pimsFromURL]) {
            if (currentPIMS !== pimsFromURL) {
                setCurrentPIMS(pimsFromURL);

                // Only apply theme on first render or when PIMS actually changes
                // This prevents unnecessary style recalculations
                applyPIMSTheme(pimsConfigurations[pimsFromURL]);
            }
        } else {
            // If we don't have a valid PIMS in the URL, navigate to the default
            // Only do this if it's not the initial render to prevent navigation loops
            if (!initialRender.current) {
                navigate('/cornerstone', { replace: true });
            }
        }

        // Mark that initial render is complete
        initialRender.current = false;
    }, [location.pathname, currentPIMS, navigate]);

    // Apply theme on first render and whenever currentPIMS changes
    useEffect(() => {
        if (pimsConfigurations[currentPIMS]) {
            applyPIMSTheme(pimsConfigurations[currentPIMS]);
        }
    }, [currentPIMS]);

    // Function to switch PIMS
    const switchPIMS = (pimsName) => {
        if (pimsConfigurations[pimsName] && pimsName !== currentPIMS) {
            // Navigate to the same page but with the new PIMS
            const newPath = createPathForPIMSSwitch(location.pathname, pimsName);
            navigate(newPath);
        }
    };

    // Apply theme variables to document root
    const applyPIMSTheme = (pimsConfig) => {
        const root = document.documentElement;

        // Apply colors
        root.style.setProperty('--primary-color', pimsConfig.colors.primary);
        root.style.setProperty('--secondary-color', pimsConfig.colors.secondary);
        root.style.setProperty('--background-color', pimsConfig.colors.background);
        root.style.setProperty('--text-color', pimsConfig.colors.text);
        root.style.setProperty('--border-color', pimsConfig.colors.border);

        // Apply typography
        root.style.setProperty('--font-family', pimsConfig.typography.fontFamily);

        // Apply other theme variables
        root.style.setProperty('--border-radius', pimsConfig.appearance.borderRadius);
        root.style.setProperty('--button-style', pimsConfig.appearance.buttonStyle);
    };

    return (
        <PIMSContext.Provider
            value={{
                currentPIMS,
                switchPIMS,
                config: pimsConfigurations[currentPIMS]
            }}
        >
            {children}
        </PIMSContext.Provider>
    );
}; 