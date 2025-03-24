import { useEffect } from 'react';
import { usePIMS } from '../context/PIMSContext';

/**
 * Hook to handle keyboard shortcuts for switching between PIMS
 */
const usePIMSKeyboardShortcuts = () => {
    const { switchPIMS } = usePIMS();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only trigger if Alt+Shift is pressed
            if (e.altKey && e.shiftKey) {
                switch (e.key) {
                    case '1':
                        // Alt+Shift+1: Switch to Cornerstone
                        switchPIMS('cornerstone');
                        break;
                    case '2':
                        // Alt+Shift+2: Switch to Avimark
                        switchPIMS('avimark');
                        break;
                    case '3':
                        // Alt+Shift+3: Switch to EasyVet
                        switchPIMS('easyvet');
                        break;
                    case '4':
                        // Alt+Shift+4: Switch to IntraVet
                        switchPIMS('intravet');
                        break;
                    case '5':
                        // Alt+Shift+5: Switch to Covetrus
                        switchPIMS('covetrus');
                        break;
                    default:
                        break;
                }
            }
        };

        // Add event listener for keyboard shortcuts
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [switchPIMS]);
};

export default usePIMSKeyboardShortcuts; 