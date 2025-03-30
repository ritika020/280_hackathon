import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0",
  "#8dd1e1", "#ffbb28", "#ff8042", "#d0ed57", "#a4de6c"
];

function ChatSection({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  addWidget,
  modalVisible,
  setModalVisible,
  modalData,
  setModalData
}) {
  const bottomRef = useRef(null);
  const [lastPrompt, setLastPrompt] = useState('');

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const prompt = inputValue.trim();
    if (!prompt) return;

    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLastPrompt(prompt);

    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: prompt }),
      });

      const data = await response.json();

      // const aiMessage = typeof data.response === "string"
      //   ? data.response
      //   : data.response || "No response from AI.";

      // console.log(data.response)

      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error: " + error.message }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddWidget = () => {
    const cleanTitle = lastPrompt
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ');

    addWidget({
      title: cleanTitle || "Widget",
      data: modalData.data
    });

    setModalVisible(false);
  };

  const renderMessageContent = (msg) => {
    try {
      const parsed = typeof msg.text === 'string' ? JSON.parse(msg.text) : msg.text;

      // Chart trigger button
      if (parsed.type === 'chart' && Array.isArray(parsed.data)) {
        return (
          <button
            className="open-chart-modal"
            onClick={() => {
              setModalData(parsed);
              setModalVisible(true);
            }}
            style={{ marginBottom: '8px' }}
          >
            📊 View Chart
          </button>
        );
      }

      // Fallback: plain JSON
      return <pre>{JSON.stringify(parsed, null, 2)}</pre>;
    } catch {
      return msg.text;
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Web UI Copilot</span>
        <div className="header-right"><div className="user-avatar">KG</div></div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            {renderMessageContent(msg)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Modal for Chart */}
      {modalVisible && modalData && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
              Pie Chart
              <span
                onClick={handleAddWidget}
                style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#007bff' }}
              >
                ➕
              </span>
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="label"
                  data={modalData.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name }) => name}
                >
                  {modalData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="chat-input-area">
        <div className="chat-controls">
          <span className="icon-button" onClick={() => alert('Presentation mode coming soon')}>[Pres]</span>
          <span className="icon-button" onClick={() => alert('👍')}>👍</span>
          <span className="icon-button" onClick={() => alert('👎')}>👎</span>
        </div>

        <div className="input-bubble">
          <input
            type="text"
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="input-icons">
            <span className="icon-button" onClick={() => alert('Search')}>Search</span>
            <span className="icon-button" onClick={() => alert('Reason')}>Reason</span>
            <span className="icon-button" onClick={() => alert('More options')}>...</span>
          </div>
        </div>

        <span className="icon-button" style={{ fontSize: '1.2rem' }} onClick={() => alert('Mic input soon')}>
          🎤
        </span>
      </div>
    </div>
  );
}

export default ChatSection;