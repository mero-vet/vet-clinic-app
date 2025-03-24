import React from 'react';
import { usePIMS } from '../context/PIMSContext';
import { useNavigate } from 'react-router-dom';

const FeatureNotEnabledScreen = () => {
    const { config } = usePIMS();
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    // Apply PIMS-specific styling
    const getStylesForPIMS = () => {
        switch (config.name.toLowerCase()) {
            case 'cornerstone':
                return {
                    container: {
                        padding: '20px',
                        maxWidth: '600px',
                        margin: '40px auto',
                        border: '2px solid #000080',
                        backgroundColor: '#efefef',
                        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
                        borderRadius: '0'
                    },
                    title: {
                        color: '#000080',
                        fontFamily: "'MS Sans Serif', sans-serif",
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    },
                    message: {
                        fontFamily: "'MS Sans Serif', sans-serif",
                        fontSize: '14px',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                    },
                    button: {
                        backgroundColor: '#c0c0c0',
                        border: '2px outset #d0d0d0',
                        padding: '3px 10px',
                        fontFamily: "'MS Sans Serif', sans-serif",
                        cursor: 'pointer'
                    }
                };

            case 'avimark':
                return {
                    container: {
                        padding: '25px',
                        maxWidth: '650px',
                        margin: '50px auto',
                        border: '1px solid #cccccc',
                        backgroundColor: '#f0f0f0',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '2px'
                    },
                    title: {
                        color: '#A70000',
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    },
                    message: {
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '25px'
                    },
                    button: {
                        backgroundColor: '#A70000',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        cursor: 'pointer',
                        borderRadius: '2px'
                    }
                };

            case 'easyvet':
                return {
                    container: {
                        padding: '32px',
                        maxWidth: '600px',
                        margin: '50px auto',
                        backgroundColor: 'white',
                        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px'
                    },
                    title: {
                        color: '#4CAF50',
                        fontFamily: "'Roboto', 'Open Sans', Arial, sans-serif",
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    },
                    message: {
                        fontFamily: "'Roboto', 'Open Sans', Arial, sans-serif",
                        fontSize: '16px',
                        lineHeight: '1.6',
                        marginBottom: '30px',
                        color: '#424242'
                    },
                    button: {
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontFamily: "'Roboto', sans-serif",
                        cursor: 'pointer',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }
                };

            case 'intravet':
                return {
                    container: {
                        padding: '30px',
                        maxWidth: '650px',
                        margin: '40px auto',
                        border: '1px solid #BBBBBB',
                        backgroundColor: 'white',
                        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px'
                    },
                    title: {
                        color: '#1565C0',
                        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginBottom: '25px',
                        borderBottom: '2px solid #FF8F00',
                        paddingBottom: '10px'
                    },
                    message: {
                        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
                        fontSize: '15px',
                        lineHeight: '1.6',
                        marginBottom: '25px',
                        color: '#333333'
                    },
                    button: {
                        background: 'linear-gradient(to bottom, #2196F3, #1565C0)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 18px',
                        fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
                        cursor: 'pointer',
                        borderRadius: '3px'
                    }
                };

            case 'covetrus pulse':
                return {
                    container: {
                        padding: '40px',
                        maxWidth: '700px',
                        margin: '60px auto',
                        backgroundColor: 'white',
                        boxShadow: '0 5px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px'
                    },
                    title: {
                        color: '#6200EA',
                        fontFamily: "'Montserrat', 'Roboto', sans-serif",
                        fontSize: '28px',
                        fontWeight: '600',
                        marginBottom: '24px'
                    },
                    message: {
                        fontFamily: "'Montserrat', 'Roboto', sans-serif",
                        fontSize: '16px',
                        lineHeight: '1.8',
                        marginBottom: '36px',
                        color: '#212121'
                    },
                    button: {
                        backgroundColor: '#6200EA',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        fontFamily: "'Montserrat', sans-serif",
                        cursor: 'pointer',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(98, 0, 234, 0.3)',
                        fontWeight: '500'
                    }
                };

            default:
                return {
                    container: { padding: '20px', maxWidth: '600px', margin: '40px auto' },
                    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
                    message: { marginBottom: '20px' },
                    button: { padding: '8px 16px', cursor: 'pointer' }
                };
        }
    };

    const styles = getStylesForPIMS();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Feature Not Enabled</h1>
            <p style={styles.message}>
                This feature is not currently available in the {config.name} simulation.
                Please use the menu to navigate to another feature.
            </p>
            <button
                style={styles.button}
                onClick={goToHome}
            >
                Return to Home
            </button>
        </div>
    );
};

export default FeatureNotEnabledScreen; 