import React from 'react';

function Sidebar({ messageHistory, onSelectPrompt }) {
  const userPrompts = messageHistory.filter((msg) => msg.sender === 'user');

  return (
    <div className="sidebar-container">
      <h3>API Widget</h3>
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '20px' }}>
        <div onClick={() => onSelectPrompt('Agriculture')} style={iconStyle}>Ag</div>
        <div onClick={() => onSelectPrompt('Global')} style={iconStyle}>Gl</div>
        <div onClick={() => onSelectPrompt('CO2')} style={iconStyle}>CO2</div>
      </div>

      <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Your Prompts</p>
      <ul style={{ listStyleType: 'none', padding: 0, margin: '0.5rem 0' }}>
        {userPrompts.length === 0 ? (
          <li style={{ color: '#777' }}>No prompts yet</li>
        ) : (
          userPrompts.map((msg, idx) => (
            <li
              key={idx}
              onClick={() => onSelectPrompt(msg.text)}
              style={listItemStyle}
            >
              {msg.text.length > 30 ? msg.text.slice(0, 30) + '...' : msg.text}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

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
  padding: '6px 0',
  cursor: 'pointer',
  fontSize: '0.95rem',
  borderBottom: '1px solid #eee',
};

export default Sidebar;