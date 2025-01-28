import React from 'react';

/**
 * ServicesMain
 * 
 * This component serves as the main container for
 * ordering services such as lab tests or vaccines.
 * It will eventually tie together various ordering
 * forms and service catalogs.
 */
function ServicesMain() {
  return (
    <div className="windows-classic" style={{ padding: '10px' }}>
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Order Services</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body" style={{ padding: '10px' }}>
          <p>
            <strong>ServicesMain Component</strong> - This is where we'll orchestrate
            different ordering modules such as lab tests and vaccines.
          </p>
          <p>
            To be integrated with: <em>LabTestOrderForm</em>, <em>VaccineOrderForm</em>,
            <em>ServicesCatalog</em>, <em>OrdersHistory</em>, and any additional logic or data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicesMain;