import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0",
  "#8dd1e1", "#ffbb28", "#ff8042", "#d0ed57", "#a4de6c"
];

function Sidebar({ messageHistory, onSelectPrompt, widgets = [], removeWidget }) {
  const userPrompts = messageHistory.filter((msg) => msg.sender === 'user');

  return (
    <div className="sidebar-container">
      <h3>API Widget</h3>

      {/* Static Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '16px' }}>
        <div onClick={() => onSelectPrompt('Agriculture')} style={iconStyle}>Ag</div>
        <div onClick={() => onSelectPrompt('Global')} style={iconStyle}>Gl</div>
        <div onClick={() => onSelectPrompt('CO2')} style={iconStyle}>CO2</div>
      </div>

      {/* 📌 Saved Chart Widgets (Moved up here) */}
      {widgets.length > 0 && (
        <>
          <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>📌 Saved Charts</p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {widgets.map((chart, idx) => (
            <li key={idx} style={{ marginBottom: '12px', position: 'relative' }}>
              <span
                onClick={() => removeWidget(idx)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 8,
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '1.2rem'
                }}
                title="Remove widget"
              >
                🗑️
              </span>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={chart.data}
                    dataKey="value"
                    nameKey="label"
                    outerRadius={50}
                    label={({ name }) => name}
                  >
                    {chart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </li>
            ))}
          </ul>
        </>
      )}

      {/* Prompt History */}
      <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Your Prompts</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
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