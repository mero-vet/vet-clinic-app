import React from 'react';
import { usePIMS } from '../context/PIMSContext';

/**
 * A wrapper component that applies PIMS-specific styling to screen content
 */
const PIMSScreenWrapper = ({ children, title }) => {
    const { currentPIMS, config } = usePIMS();

    // Get PIMS-specific styling for the screen
    const getScreenStyles = () => {
        switch (currentPIMS) {
            case 'cornerstone':
                return {
                    container: {
                        padding: '15px 20px',
                        backgroundColor: '#f5f5f5',
                        border: '2px inset #d0d0d0',
                        fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif",
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        backgroundColor: '#000080',
                        color: 'white',
                        padding: '6px 12px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    },
                    content: {
                        fontSize: '12px',
                        height: 'calc(100% - 35px)'
                    }
                };

            case 'avimark':
                return {
                    container: {
                        padding: '20px',
                        backgroundColor: 'white',
                        border: '1px solid #cccccc',
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        backgroundColor: '#A70000',
                        color: 'white',
                        padding: '8px 16px',
                        marginBottom: '20px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        borderRadius: '2px',
                    },
                    content: {
                        fontSize: '13px',
                        height: 'calc(100% - 45px)'
                    }
                };

            case 'easyvet':
                return {
                    container: {
                        padding: '24px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                        fontFamily: "'Roboto', 'Open Sans', Arial, sans-serif",
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        color: '#4CAF50',
                        borderBottom: '2px solid #E8F5E9',
                        padding: '0 0 12px 0',
                        marginBottom: '24px',
                        fontSize: '20px',
                        fontWeight: '500',
                    },
                    content: {
                        fontSize: '14px',
                        color: '#424242',
                        height: 'calc(100% - 60px)'
                    }
                };

            case 'intravet':
                return {
                    container: {
                        padding: '20px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e5e5',
                        borderRadius: '3px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '2px solid #FF8F00',
                        color: '#1565C0',
                        padding: '0 0 10px 0',
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                    content: {
                        fontSize: '13px',
                        color: '#333333',
                        height: 'calc(100% - 50px)'
                    }
                };

            case 'covetrus':
                return {
                    container: {
                        padding: '32px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        fontFamily: "'Montserrat', 'Roboto', sans-serif",
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        color: '#6200EA',
                        padding: '0 0 16px 0',
                        marginBottom: '24px',
                        fontSize: '22px',
                        fontWeight: '600',
                        borderBottom: '1px solid #F0F0F0',
                    },
                    content: {
                        fontSize: '14px',
                        color: '#212121',
                        height: 'calc(100% - 64px)'
                    }
                };

            default:
                return {
                    container: {
                        padding: '20px',
                        height: '100%',
                        overflow: 'auto'
                    },
                    header: {
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                    content: {
                        fontSize: '14px',
                        height: 'calc(100% - 50px)'
                    }
                };
        }
    };

    const styles = getScreenStyles();

    return (
        <div style={styles.container}>
            {title && (
                <div style={styles.header}>
                    {title || config.screenLabels[title.toLowerCase()] || title}
                </div>
            )}
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default PIMSScreenWrapper; 