// src/components/Sidebar.js
import React from 'react';

function Sidebar() {
  const handleItemClick = (itemName) => {
    alert(`You clicked on ${itemName}`);
  };

  return (
    <div className="sidebar-container">
      <h3>API Widget</h3>

      {/* Mock icons for Agriculture, Globe, CO2, etc. */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '20px' }}>
        <div onClick={() => handleItemClick('Agriculture')} style={iconStyle}>Ag</div>
        <div onClick={() => handleItemClick('Global')} style={iconStyle}>Gl</div>
        <div onClick={() => handleItemClick('CO2')} style={iconStyle}>CO2</div>
      </div>

      <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Today</p>
      <ul style={{ listStyleType: 'none', padding: 0, margin: '0.5rem 0' }}>
        <li onClick={() => handleItemClick('WorldBank GDP Growth API')} style={listItemStyle}>
          WorldBank GDP Growth API
        </li>
        <li onClick={() => handleItemClick('California Reservoir IDs')} style={listItemStyle}>
          California Reservoir IDs
        </li>
        <li onClick={() => handleItemClick('Retrieve GASREGW Data FRED')} style={listItemStyle}>
          Retrieve GASREGW Data FRED
        </li>
      </ul>

      <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Recent</p>
      <ul style={{ listStyleType: 'none', padding: 0, margin: '0.5rem 0' }}>
        <li onClick={() => handleItemClick('Recent item')} style={listItemStyle}>
          ...
        </li>
      </ul>
    </div>
  );
}

/* Inline styles for demonstration */
const iconStyle = {
  width: '40px',
  height: '40px',
  backgroundColor: '#ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const listItemStyle = {
  padding: '4px 0',
  cursor: 'pointer',
};

export default Sidebar;