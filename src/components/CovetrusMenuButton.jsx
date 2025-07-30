import React, { useState, useRef } from 'react';
import CovetrusDropdownMenu from './CovetrusDropdownMenu';

const CovetrusMenuButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="covetrus-menu-wrapper">
      <button 
        ref={buttonRef}
        className="covetrus-menu-button"
        onClick={toggleMenu}
        title="Covetrus Modules"
      >
        <div className="covetrus-logo">
          <span className="logo-c">C</span>
        </div>
      </button>
      
      <CovetrusDropdownMenu 
        isOpen={isMenuOpen}
        onClose={closeMenu}
        triggerRef={buttonRef}
      />
    </div>
  );
};

export default CovetrusMenuButton; 