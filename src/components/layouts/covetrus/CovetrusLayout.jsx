import React, { useState, useEffect } from 'react';
import AppShell from '../../AppShell';
import MenuBar from '../../MenuBar';
import RecentPatientsSidebar from '../../RecentPatientsSidebar';
import TopMenuToolbar from '../../TopMenuToolbar';
import TestModal from '../../TestModal';
import LoginScreen from '../../LoginScreen';
import { MenuProvider } from '../../../context/MenuContext';


/**
 * CovetrusLayout – Windows-XP style persona using the shared <AppShell />.
 * Only basic navigation is wired; non-implemented links route to the generic
 * FeatureNotEnabledScreen.
 */
const CovetrusLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenTestModal = () => {
      setIsTestModalOpen(true);
    };

    window.addEventListener('openTestModal', handleOpenTestModal);
    
    return () => {
      window.removeEventListener('openTestModal', handleOpenTestModal);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Auto-open the client modal after login
    setTimeout(() => {
      setIsTestModalOpen(true);
    }, 500);
  };

  // -------------------------------------------------------------------------
  // Use the dedicated MenuBar component
  const renderMenu = <MenuBar />;



  // -------------------------------------------------------------------------
  // Left pane: Recent Patients sidebar, Right pane: Today at a Glance
  const leftPane = <RecentPatientsSidebar />;

  const rightPane = (
    <div style={{ padding: 8 }}>
      <h4>Today at a Glance</h4>
      <p>Appointments & KPIs placeholder</p>
    </div>
  );

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <MenuProvider>
      <AppShell 
        menu={renderMenu} 
        topToolbar={<TopMenuToolbar />}
        leftPane={leftPane} 
        rightPane={rightPane}
      >
        {children}
      </AppShell>
      
      <TestModal 
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </MenuProvider>
  );
};

export default CovetrusLayout; 