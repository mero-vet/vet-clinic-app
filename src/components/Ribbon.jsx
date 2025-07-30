import React from 'react';
import PropTypes from 'prop-types';

const Ribbon = ({ buttons = [] }) => (
  <div style={{ display:'flex', gap:4, padding:'4px 8px', background:'#e1e1e1', height:48 }}>
    {buttons.map(btn => (
      <button key={btn.label} onClick={btn.onClick} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:60 }}>
        {btn.icon && <btn.icon size={18} />}
        <span style={{ fontSize:11 }}>{btn.label}</span>
      </button>
    ))}
  </div>
);

Ribbon.propTypes = { buttons: PropTypes.array };
export default Ribbon; 