import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePIMS } from '../../../context/PIMSContext';
import {
    MdPersonOutline, MdCalendarToday, MdNoteAlt, MdMedicalServices,
    MdReceiptLong, MdFolderOpen, MdInventory2, MdMessage,
    MdMedication, MdInsights, MdHome, MdSettings, MdHelp
} from 'react-icons/md';
import { createPIMSUrl } from '../../../utils/urlUtils';

const AvimarkLayout = ({ children }) => {
    const { config } = usePIMS();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    const ribbonTabs = [
        {
            id: 'home',
            label: 'Home',
            icon: MdHome,
        },
        {
            id: 'patients',
            label: 'Patients',
            icon: MdPersonOutline,
        },
        {
            id: 'scheduling',
            label: 'Scheduling',
            icon: MdCalendarToday,
        },
        {
            id: 'medical',
            label: 'Medical',
            icon: MdMedicalServices,
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: MdInventory2,
        },
        {
            id: 'administration',
            label: 'Administration',
            icon: MdSettings,
        },
    ];

    const navigationItems = [
        {
            label: config.screenLabels.checkin,
            icon: MdPersonOutline,
            path: "/",
            tab: 'patients',
        },
        {
            label: config.screenLabels.scheduler,
            icon: MdCalendarToday,
            path: "/scheduler",
            tab: 'scheduling',
        },
        {
            label: config.screenLabels.notes,
            icon: MdNoteAlt,
            path: "/notes",
            tab: 'medical',
        },
        {
            label: config.screenLabels.services,
            icon: MdMedicalServices,
            path: "/services",
            tab: 'medical',
        },
        {
            label: config.screenLabels.invoices,
            icon: MdReceiptLong,
            path: "/invoices",
            tab: 'administration',
        },
        {
            label: config.screenLabels.records,
            icon: MdFolderOpen,
            path: "/records",
            tab: 'medical',
        },
        {
            label: config.screenLabels.inventory,
            icon: MdInventory2,
            path: "/inventory",
            tab: 'inventory',
        },
        {
            label: config.screenLabels.communications,
            icon: MdMessage,
            path: "/communications",
            tab: 'patients',
        },
        {
            label: config.screenLabels.pharmacy,
            icon: MdMedication,
            path: "/pharmacy",
            tab: 'medical',
        },
        {
            label: config.screenLabels.reports,
            icon: MdInsights,
            path: "/reports",
            tab: 'administration',
        },
    ];

    // Add a function to check if a path is a functional route
    const isValidPath = (path) => {
        if (!path) return false;

        // List of implemented paths
        const implementedPaths = [
            '/',
            '/scheduler',
            '/notes',
            '/services',
            '/invoices',
            '/records',
            '/inventory',
            '/communications',
            '/pharmacy',
            '/reports'
        ];

        return implementedPaths.includes(path);
    };

    // Update the handleNavigate function to check if a path is valid
    const handleNavigate = (path) => {
        if (path === null || path === undefined || !isValidPath(path)) {
            return;
        }
        // Use navigate directly with the full URL
        navigate(createPIMSUrl('avimark', path));
    };

    // Clean isActive function to check if a path is currently active
    const isActive = (path) => {
        if (path === null || path === undefined) {
            return false;
        }
        return location.pathname === createPIMSUrl('avimark', path);
    };

    // Get navigation items for current tab
    const currentTabItems = navigationItems.filter(item => item.tab === activeTab);

    // Get the current screen title based on the active path
    const getCurrentScreenTitle = () => {
        if (isActive('/')) return config.screenLabels.checkin;
        if (isActive('/scheduler')) return config.screenLabels.scheduler;
        if (isActive('/notes')) return config.screenLabels.notes;
        if (isActive('/services')) return config.screenLabels.services;
        if (isActive('/invoices')) return config.screenLabels.invoices;
        if (isActive('/records')) return config.screenLabels.records;
        if (isActive('/inventory')) return config.screenLabels.inventory;
        if (isActive('/communications')) return config.screenLabels.communications;
        if (isActive('/pharmacy')) return config.screenLabels.pharmacy;
        if (isActive('/reports')) return config.screenLabels.reports;
        return 'Avimark';
    };

    return (
        <div className="layout-ribbon pims-avimark">
            <div
                className="window"
                style={{
                    margin: '0',
                    padding: '0',
                    width: '100%',
                    maxWidth: 'none',
                    height: '100vh',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    backgroundColor: 'var(--background-color)',
                    fontFamily: 'var(--font-family)',
                    color: 'var(--text-color)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Title Bar */}
                <div
                    className="title-bar"
                    style={{
                        backgroundColor: 'var(--title-bar-color)',
                        color: 'var(--title-bar-text-color)',
                        padding: '4px 8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div className="title-text" style={{ fontWeight: 'bold' }}>
                        Avimark
                    </div>
                    <div className="window-controls" style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                            width: '20px',
                            height: '20px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--button-bg)'
                        }}>_</button>
                        <button style={{
                            width: '20px',
                            height: '20px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--button-bg)'
                        }}>□</button>
                        <button style={{
                            width: '20px',
                            height: '20px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--button-bg)'
                        }}>✕</button>
                    </div>
                </div>

                {/* Ribbon Tabs */}
                <div
                    className="ribbon-tabs"
                    style={{
                        display: 'flex',
                        backgroundColor: 'var(--background-color)',
                        borderBottom: '1px solid var(--border-color)'
                    }}
                >
                    {ribbonTabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        const TabIcon = tab.icon;

                        return (
                            <div
                                key={tab.id}
                                className={`ribbon-tab ${isActive ? 'active' : ''}`}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? 'var(--ribbon-bg-color)' : 'var(--background-color)',
                                    color: isActive ? 'var(--ribbon-text-color)' : 'var(--text-color)',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    marginRight: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <TabIcon size={16} />
                                {tab.label}
                            </div>
                        );
                    })}
                </div>

                {/* Ribbon Content */}
                <div
                    className="ribbon"
                    style={{
                        backgroundColor: 'var(--ribbon-bg-color)',
                        color: 'var(--ribbon-text-color)',
                        padding: '4px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}
                >
                    {currentTabItems.map((item, idx) => {
                        const isItemActive = isActive(item.path);
                        const Icon = item.icon;

                        return (
                            <div
                                key={idx}
                                className={`ribbon-item ${isItemActive ? 'active' : ''}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '4px 8px',
                                    backgroundColor: isItemActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                    borderRadius: '2px',
                                    cursor: isValidPath(item.path) ? 'pointer' : 'default',
                                    width: '70px',
                                    height: '60px',
                                    justifyContent: 'center',
                                    opacity: isValidPath(item.path) ? 1 : 0.7
                                }}
                                onClick={() => isValidPath(item.path) && handleNavigate(item.path)}
                            >
                                <Icon size={24} />
                                <span style={{
                                    fontSize: '11px',
                                    marginTop: '4px',
                                    textAlign: 'center'
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div
                    className="content"
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '16px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    {/* Page Title */}
                    <div
                        style={{
                            backgroundColor: 'var(--title-bar-color)',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            borderRadius: '2px'
                        }}
                    >
                        {getCurrentScreenTitle()}
                    </div>

                    {children}
                </div>

                {/* Status Bar */}
                <div
                    className="status-bar"
                    style={{
                        padding: '4px 8px',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'var(--background-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px'
                    }}
                >
                    <div>Ready</div>
                    <div>Avimark v20.1.1</div>
                    <div>{new Date().toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    );
};

export default AvimarkLayout; 