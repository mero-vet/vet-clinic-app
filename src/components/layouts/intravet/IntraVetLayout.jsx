import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePIMS } from '../../../context/PIMSContext';
import {
    MdPersonOutline, MdCalendarToday, MdNoteAlt, MdMedicalServices,
    MdReceiptLong, MdFolderOpen, MdInventory2, MdMessage,
    MdMedication, MdInsights, MdKeyboardArrowDown, MdKeyboardArrowRight,
    MdSearch, MdHelp, MdSettings, MdClose, MdHome, MdInfo
} from 'react-icons/md';
import { createPIMSUrl } from '../../../utils/urlUtils';

// Function to load tabs from localStorage
const loadTabsFromStorage = (getIconForPath) => {
    try {
        const savedTabs = localStorage.getItem('intravet-tabs');
        const savedActiveTab = localStorage.getItem('intravet-active-tab');

        if (savedTabs) {
            const parsedTabs = JSON.parse(savedTabs);
            // Only use if we have valid tabs
            if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
                console.log('[Tab Debug] Pre-loading tabs from localStorage', parsedTabs);

                // Fix icon components which can't be serialized
                const restoredTabs = parsedTabs.map(tab => {
                    // Restore the icon component based on the path
                    const iconComponent = getIconForPath ? getIconForPath(tab.path) :
                        (tab.path === '/' ? MdHome : MdFolderOpen);
                    return {
                        ...tab,
                        icon: iconComponent || MdFolderOpen // Use a fallback icon if needed
                    };
                });

                return {
                    tabs: restoredTabs,
                    activeTabId: savedActiveTab && restoredTabs.some(tab => tab.id === savedActiveTab)
                        ? savedActiveTab
                        : restoredTabs[0].id
                };
            }
        }
    } catch (e) {
        console.error('Failed to pre-load tabs from localStorage', e);
    }

    return null;
};

const IntraVetLayout = ({ children }) => {
    const { config } = usePIMS();
    const navigate = useNavigate();
    const location = useLocation();

    // Get path icon helper (defined early so it can be used for initial state)
    const getIconForPath = useCallback((path) => {
        switch (path) {
            case '/': return MdPersonOutline;
            case '/scheduler': return MdCalendarToday;
            case '/notes': return MdNoteAlt;
            case '/services': return MdMedicalServices;
            case '/invoices': return MdReceiptLong;
            case '/records': return MdFolderOpen;
            case '/inventory': return MdInventory2;
            case '/communications': return MdMessage;
            case '/pharmacy': return MdMedication;
            case '/reports': return MdInsights;
            default: return MdFolderOpen;
        }
    }, []);

    // Pre-load saved tabs
    const savedTabsData = useMemo(() => loadTabsFromStorage(getIconForPath), [getIconForPath]);

    const [expandedMenus, setExpandedMenus] = useState({
        patients: true,
        scheduling: false,
        medical: false,
        financial: false,
        inventory: false,
        communications: false,
        reports: false
    });

    // Flag to indicate if we're handling navigation internally
    // This prevents the useEffect from trying to create tabs on URL changes we initiate
    const isNavigatingInternally = useRef(false);

    // Track the last tab we were activating to prevent double activation
    const lastActivatedPathRef = useRef(null);
    // Track a timestamp to detect rapid successive activations
    const lastActivationTimeRef = useRef(0);

    // Flag to prevent localStorage loading from being triggered multiple times
    const initialLoadCompleteRef = useRef(false);

    // Keep track of open tabs - initialize from localStorage if available
    const [openTabs, setOpenTabs] = useState(savedTabsData?.tabs || [
        { id: 'patients-checkin', label: 'Home', path: '/', icon: MdHome }
    ]);

    const [activeTab, setActiveTab] = useState(savedTabsData?.activeTabId || 'patients-checkin');

    // Define functional routes - only these routes will be navigable
    const functionalRoutes = useMemo(() => [
        '/',
        '/scheduler',
        '/notes',
        '/services',
        '/invoices',
        '/records',
        '/inventory',
        '/communications',
        '/pharmacy',
        '/reports',
    ], []);

    // Check if a route is functional
    const isRouteEnabled = useCallback((path) => {
        if (!path) return false;
        return functionalRoutes.includes(path);
    }, [functionalRoutes]);

    // Define navigationTree outside of render to prevent recreation
    const navigationTree = useMemo(() => [
        {
            id: 'patients',
            label: 'Patients',
            icon: MdPersonOutline,
            children: [
                { id: 'patients-checkin', label: config.screenLabels.checkin, path: '/', enabled: true },
                { id: 'patients-search', label: 'Search Patients (Coming Soon)', path: null, enabled: false }
            ]
        },
        {
            id: 'scheduling',
            label: 'Scheduling',
            icon: MdCalendarToday,
            children: [
                { id: 'scheduling-scheduler', label: config.screenLabels.scheduler, path: '/scheduler', enabled: true },
                { id: 'scheduling-blocks', label: 'Time Blocks (Coming Soon)', path: null, enabled: false }
            ]
        },
        {
            id: 'medical',
            label: 'Medical',
            icon: MdMedicalServices,
            children: [
                { id: 'medical-records', label: config.screenLabels.records, path: '/records', enabled: true },
                { id: 'medical-notes', label: config.screenLabels.notes, path: '/notes', enabled: true },
                { id: 'medical-services', label: config.screenLabels.services, path: '/services', enabled: true },
                { id: 'medical-pharmacy', label: config.screenLabels.pharmacy, path: '/pharmacy', enabled: true },
            ]
        },
        {
            id: 'financial',
            label: 'Financial',
            icon: MdReceiptLong,
            children: [
                { id: 'financial-invoices', label: config.screenLabels.invoices, path: '/invoices', enabled: true },
                { id: 'financial-payments', label: 'Payments (Coming Soon)', path: null, enabled: false }
            ]
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: MdInventory2,
            children: [
                { id: 'inventory-inventory', label: config.screenLabels.inventory, path: '/inventory', enabled: true },
                { id: 'inventory-orders', label: 'Orders (Coming Soon)', path: null, enabled: false }
            ]
        },
        {
            id: 'communications',
            label: 'Communications',
            icon: MdMessage,
            children: [
                { id: 'communications-communications', label: config.screenLabels.communications, path: '/communications', enabled: true },
                { id: 'communications-templates', label: 'Templates (Coming Soon)', path: null, enabled: false }
            ]
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: MdInsights,
            children: [
                { id: 'reports-reports', label: config.screenLabels.reports, path: '/reports', enabled: true },
                { id: 'reports-analytics', label: 'Analytics (Coming Soon)', path: null, enabled: false }
            ]
        }
    ], [config.screenLabels]);

    // Toggle menu expansion
    const toggleMenu = useCallback((menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    }, []);

    // Close a tab
    const closeTab = useCallback((tabId, event) => {
        event.stopPropagation();

        // Don't close the last tab
        if (openTabs.length <= 1) return;

        // Find the tab to close and its index
        const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;

        // Create new tabs array without the closed tab
        const newTabs = [...openTabs];
        newTabs.splice(tabIndex, 1);
        setOpenTabs(newTabs);

        // If closing active tab, activate the previous tab or the first one
        if (tabId === activeTab) {
            // Prioritize the tab to the left, or the first tab if there's no left tab
            const newActiveIndex = Math.max(0, tabIndex - 1);
            const newActiveTab = newTabs[newActiveIndex];

            if (newActiveTab) {
                setActiveTab(newActiveTab.id);
                // Navigate without triggering the useEffect
                isNavigatingInternally.current = true;
                navigate(createPIMSUrl('intravet', newActiveTab.path));
            }
        }
    }, [openTabs, activeTab, navigate]);

    // Find a navigation item by path
    const findNavigationItem = useCallback((path) => {
        for (const category of navigationTree) {
            for (const item of category.children) {
                if (item.path === path) {
                    return { item, category };
                }
            }
        }
        return null;
    }, [navigationTree]);

    // Create or activate tab
    const createOrActivateTab = useCallback((path) => {
        console.log(`[Tab Debug] createOrActivateTab called for path: ${path}`);

        // Prevent duplicate activations for the same path in quick succession
        const now = Date.now();
        if (path === lastActivatedPathRef.current && now - lastActivationTimeRef.current < 1000) {
            console.log(`[Tab Debug] Preventing duplicate activation for ${path} (${now - lastActivationTimeRef.current}ms)`);
            return null;
        }

        // Update tracking refs
        lastActivatedPathRef.current = path;
        lastActivationTimeRef.current = now;

        // First check if tab already exists
        const existingTabIndex = openTabs.findIndex(tab => tab.path === path);
        if (existingTabIndex !== -1) {
            const existingTab = openTabs[existingTabIndex];
            console.log(`[Tab Debug] Tab exists, activating: ${existingTab.id}`);
            setActiveTab(existingTab.id);
            return existingTab.id;
        }

        // If not, find the navigation item to create a tab
        const navItemInfo = findNavigationItem(path);
        if (!navItemInfo) {
            console.log(`[Tab Debug] No navigation item found for path: ${path}`);
            return null;
        }

        const { item, category } = navItemInfo;

        // Expand the category
        setExpandedMenus(prev => ({
            ...prev,
            [category.id]: true
        }));

        // Create a unique ID
        const uniqueTabId = `${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        console.log(`[Tab Debug] Creating new tab with ID: ${uniqueTabId}`);

        // Create the tab
        const newTab = {
            id: uniqueTabId,
            label: item.label,
            path: path,
            icon: item.icon || getIconForPath(path)
        };

        // Update tabs - we don't replace existing tabs, only add new ones
        setOpenTabs(prev => {
            // Check again if a tab with this path was already added
            const existingTabInUpdatedState = prev.find(tab => tab.path === path);
            if (existingTabInUpdatedState) {
                console.log(`[Tab Debug] Tab was added concurrently, using existing: ${existingTabInUpdatedState.id}`);
                // Don't add a new tab, just return current state
                setTimeout(() => {
                    setActiveTab(existingTabInUpdatedState.id);
                }, 0);
                return prev;
            }

            // Add the new tab, keeping all existing tabs
            return [...prev, newTab];
        });

        // Set new tab as active after the state update
        setTimeout(() => {
            setActiveTab(uniqueTabId);
        }, 0);

        return uniqueTabId;
    }, [openTabs, findNavigationItem, getIconForPath]);

    // Navigate to a path (internal use)
    const navigateTo = useCallback((path) => {
        if (!isRouteEnabled(path)) {
            console.log(`[Tab Debug] Path not enabled: ${path}`);
            return;
        }

        console.log(`[Tab Debug] Navigating to: ${path}`);

        // Only set the flag if it's not already set
        if (!isNavigatingInternally.current) {
            isNavigatingInternally.current = true;
            console.log(`[Tab Debug] Setting isNavigatingInternally to true`);

            // Set a timeout to reset the flag after navigation
            // Use a longer timeout to ensure the navigation effect completes
            setTimeout(() => {
                console.log(`[Tab Debug] Resetting isNavigatingInternally to false`);
                isNavigatingInternally.current = false;
            }, 500); // Increase timeout to 500ms to be safe
        }

        // Navigate
        navigate(createPIMSUrl('intravet', path));
    }, [isRouteEnabled, navigate]);

    // Handle menu item click
    const handleMenuItemClick = useCallback((item) => {
        console.log(`[Tab Debug] Menu item clicked: ${item.id}, path: ${item.path}`);

        if (!item.enabled || !item.path) {
            console.log(`[Tab Debug] Item not enabled or no path, ignoring: ${item.id}`);
            return;
        }

        // Ensure only one operation happens at a time
        if (isNavigatingInternally.current) {
            console.log(`[Tab Debug] Navigation already in progress, ignoring click`);
            return;
        }

        // First create or activate tab
        createOrActivateTab(item.path);

        // Then navigate
        navigateTo(item.path);
    }, [createOrActivateTab, navigateTo]);

    // Handle tab click
    const handleTabClick = useCallback((tab) => {
        console.log(`[Tab Debug] Tab clicked: ${tab.id}, path: ${tab.path}`);
        setActiveTab(tab.id);
        navigateTo(tab.path);
    }, [navigateTo]);

    // Check if a path is active
    const isActive = useCallback((path) => {
        // Handle null paths
        if (path === null || path === undefined) {
            return false;
        }
        return location.pathname === createPIMSUrl('intravet', path);
    }, [location.pathname]);

    // Get the current screen title based on the active path
    const getCurrentScreenTitle = useCallback(() => {
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
        return 'IntraVet';
    }, [isActive, config.screenLabels]);

    // Location change effect
    useEffect(() => {
        // Get the current path from the URL
        const currentPath = location.pathname;
        const pathSegments = currentPath.split('/').filter(Boolean);
        const route = pathSegments.length > 1 ? `/${pathSegments.slice(1).join('/')}` : '/';

        console.log(`[Tab Debug] Location changed to: ${currentPath}, route: ${route}`);
        console.log(`[Tab Debug] isNavigatingInternally: ${isNavigatingInternally.current}`);
        console.log(`[Tab Debug] lastActivatedPath: ${lastActivatedPathRef.current}`);

        // Skip this effect if we're handling navigation internally or if this is the same path
        // that was just activated (within the last second)
        if (isNavigatingInternally.current) {
            console.log(`[Tab Debug] Skipping effect as navigation is being handled internally`);
            return;
        }

        if (route === lastActivatedPathRef.current &&
            Date.now() - lastActivationTimeRef.current < 1000) {
            console.log(`[Tab Debug] Skipping effect as this path was just activated`);
            return;
        }

        // If the route is valid, create or activate a tab
        if (isRouteEnabled(route)) {
            // For external navigation, use setTimeout to ensure it runs after any pending state updates
            const tabId = setTimeout(() => {
                // Double-check flag hasn't been set during the timeout
                if (!isNavigatingInternally.current &&
                    !(route === lastActivatedPathRef.current &&
                        Date.now() - lastActivationTimeRef.current < 1000)) {
                    console.log(`[Tab Debug] Creating/activating tab for external navigation: ${route}`);

                    // Check if we already have a tab for this route
                    const existingTab = openTabs.find(tab => tab.path === route);
                    if (existingTab) {
                        // If a tab exists, just activate it
                        console.log(`[Tab Debug] Tab exists for route ${route}, activating it`);
                        setActiveTab(existingTab.id);
                    } else {
                        // Otherwise create a new tab
                        createOrActivateTab(route);
                    }
                }
            }, 100);

            // Cleanup function to cancel the timeout if the component unmounts
            return () => clearTimeout(tabId);
        }
    }, [location.pathname, isRouteEnabled, createOrActivateTab, openTabs]);

    // Store tabs in localStorage to persist between page reloads
    useEffect(() => {
        // Don't save during initial mounting
        if (!initialLoadCompleteRef.current) {
            initialLoadCompleteRef.current = true;
            return;
        }

        // Save non-empty tabs array to localStorage
        if (openTabs.length > 0) {
            try {
                // Don't store icon components as they can't be serialized
                const tabsToStore = openTabs.map(tab => ({
                    id: tab.id,
                    label: tab.label,
                    path: tab.path
                    // Intentionally omit the icon component
                }));

                localStorage.setItem('intravet-tabs', JSON.stringify(tabsToStore));
                localStorage.setItem('intravet-active-tab', activeTab);
                console.log('[Tab Debug] Saved tabs to localStorage', tabsToStore);
            } catch (e) {
                console.error('Failed to save tabs to localStorage', e);
            }
        }
    }, [openTabs, activeTab]);

    // Add a function to check if a tab is valid before displaying it
    const isValidTab = useCallback((tab) => {
        return tab && tab.id && tab.path && typeof tab.label === 'string';
    }, []);

    return (
        <div className="layout-tree-tabs pims-intravet">
            <div
                style={{
                    display: 'flex',
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: 'var(--background-color)',
                    fontFamily: 'var(--font-family)',
                    color: 'var(--text-color)'
                }}
            >
                {/* Left Tree Menu */}
                <div
                    className="tree-menu"
                    style={{
                        width: '220px',
                        height: '100%',
                        borderRight: '1px solid var(--border-color)',
                        overflow: 'auto',
                        backgroundColor: 'var(--tree-menu-bg)',
                        padding: '16px 0'
                    }}
                >
                    {/* Logo area */}
                    <div
                        style={{
                            padding: '0 16px 16px 16px',
                            borderBottom: '1px solid var(--border-color)',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>IntraVet</h2>
                    </div>

                    {/* Tree navigation */}
                    <div>
                        {navigationTree.map((category) => (
                            <div key={category.id}>
                                <div
                                    className="tree-menu-category"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => toggleMenu(category.id)}
                                >
                                    {expandedMenus[category.id] ?
                                        <MdKeyboardArrowDown size={18} style={{ marginRight: '8px' }} /> :
                                        <MdKeyboardArrowRight size={18} style={{ marginRight: '8px' }} />
                                    }
                                    <category.icon size={18} style={{ marginRight: '8px' }} />
                                    {category.label}
                                </div>

                                {expandedMenus[category.id] && (
                                    <div className="tree-menu-items">
                                        {category.children.map((item) => {
                                            const itemActive = isActive(item.path);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`tree-menu-item ${itemActive ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
                                                    style={{
                                                        padding: '6px 16px 6px 42px',
                                                        cursor: item.enabled ? 'pointer' : 'default',
                                                        backgroundColor: itemActive ? 'var(--tree-menu-active-bg)' : 'transparent',
                                                        color: itemActive ? 'var(--tree-menu-active-text)' : (item.enabled ? 'inherit' : 'var(--text-color)'),
                                                        opacity: item.enabled ? 1 : 0.6,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    onClick={() => handleMenuItemClick(item)}
                                                >
                                                    <span>{item.label}</span>
                                                    {!item.enabled && (
                                                        <MdInfo
                                                            size={16}
                                                            style={{
                                                                marginLeft: '4px',
                                                                color: 'var(--text-color)',
                                                                opacity: 0.7
                                                            }}
                                                            title="This feature is coming soon"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Tabs */}
                    <div
                        style={{
                            display: 'flex',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: 'var(--background-color, #F5F5F5)',
                            overflow: 'auto',  /* Allow tabs to scroll if many are open */
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {/* Only render valid tabs to prevent errors */}
                        {openTabs.filter(isValidTab).map((tab) => {
                            const isTabActive = tab.id === activeTab;
                            // Make sure there's always a valid icon component
                            const TabIcon = tab.icon || MdFolderOpen;

                            return (
                                <div
                                    key={tab.id}
                                    className={`tab ${isTabActive ? 'active' : ''}`}
                                    style={{
                                        padding: '10px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        borderRight: '1px solid var(--border-color, #DDDDDD)',
                                        color: isTabActive ? 'var(--tab-active-color, #FF8F00)' : 'inherit',
                                        borderBottom: isTabActive ? 'var(--tab-active-indicator, 3px solid #FF8F00)' : 'none',
                                        backgroundColor: isTabActive ? 'white' : 'var(--background-color, #F5F5F5)'
                                    }}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    {/* Use a component check before rendering */}
                                    {React.isValidElement(<TabIcon />) ? (
                                        <TabIcon size={16} />
                                    ) : (
                                        <MdFolderOpen size={16} />
                                    )}
                                    <span>{tab.label}</span>
                                    {openTabs.length > 1 && (
                                        <MdClose
                                            size={16}
                                            style={{ cursor: 'pointer', opacity: 0.7 }}
                                            onClick={(e) => closeTab(tab.id, e)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            padding: '20px',
                            overflow: 'auto',
                            backgroundColor: 'white'
                        }}
                    >
                        {/* Page Title */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '2px solid var(--primary-color)',
                            marginBottom: '20px',
                            paddingBottom: '10px'
                        }}>
                            <h2 style={{
                                margin: 0,
                                color: 'var(--primary-color)',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                {getCurrentScreenTitle()}
                            </h2>

                            <div style={{
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <MdHelp size={18} style={{ cursor: 'pointer' }} />
                                <MdSettings size={18} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        {children}
                    </div>

                    {/* Status Bar */}
                    <div
                        style={{
                            padding: '4px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: 'var(--background-color)',
                            fontSize: '12px'
                        }}
                    >
                        <div>User: Demo Provider</div>
                        <div>IntraVet v5.2.1</div>
                        <div>{new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntraVetLayout; 