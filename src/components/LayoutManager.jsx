import React, { useEffect, useState, useMemo } from 'react';
import { usePIMS } from '../context/PIMSContext';
import PIMSSelector from './PIMSSelector';
import usePIMSKeyboardShortcuts from '../hooks/usePIMSKeyboardShortcuts';
import { useLocation } from 'react-router-dom';
import TestManager from './TestManager';

// Import all layout components
import CornerstoneLayout from './layouts/cornerstone/CornerstoneLayout';
import AvimarkLayout from './layouts/avimark/AvimarkLayout';
import EasyVetLayout from './layouts/easyvet/EasyVetLayout';
import IntraVetLayout from './layouts/intravet/IntraVetLayout';
import CovetrusLayout from './layouts/covetrus/CovetrusLayout';

const LayoutManager = ({ children }) => {
    const { currentPIMS } = usePIMS();
    const location = useLocation();
    const [forceUpdate, setForceUpdate] = useState(0);

    // Extract just the route part (after the PIMS name)
    const currentRoute = useMemo(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        return pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
    }, [location.pathname]);

    // Initialize keyboard shortcuts
    usePIMSKeyboardShortcuts();

    // Force re-render only when the actual route changes (not just the PIMS prefix)
    useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [currentRoute, currentPIMS]);

    // Render the appropriate layout based on the selected PIMS
    const renderLayout = () => {
        // Create a key based on current PIMS, route and forceUpdate to force re-render
        const layoutKey = `${currentPIMS}-${currentRoute}-${forceUpdate}`;

        switch (currentPIMS) {
            case 'cornerstone':
                return <CornerstoneLayout key={layoutKey}>{children}</CornerstoneLayout>;
            case 'avimark':
                return <AvimarkLayout key={layoutKey}>{children}</AvimarkLayout>;
            case 'easyvet':
                return <EasyVetLayout key={layoutKey}>{children}</EasyVetLayout>;
            case 'intravet':
                return <IntraVetLayout key={layoutKey}>{children}</IntraVetLayout>;
            case 'covetrus':
                return <CovetrusLayout key={layoutKey}>{children}</CovetrusLayout>;
            default:
                return <CornerstoneLayout key={layoutKey}>{children}</CornerstoneLayout>;
        }
    };

    return (
        <div key={`layout-container-${currentPIMS}-${currentRoute}`}>
            {/* PIMS selector */}
            <PIMSSelector />

            {/* Render the appropriate layout */}
            {renderLayout()}
            {/* Test manager overlay */}
            <TestManager />
        </div>
    );
};

export default LayoutManager; 