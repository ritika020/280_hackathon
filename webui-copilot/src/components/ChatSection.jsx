import React, { useState } from 'react';

function ChatSection() {

  const [messages, setMessages] = useState([
    // Example of an AI message to start
    { sender: 'ai', text: 'Hi! I am your Web UI Copilot. How can I help you today?' },
  ]);

  const [inputValue, setInputValue] = useState('');

  // Handle "Send" or "Enter" key
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1) Add the user message
    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // 2) (Optional) Make a backend call to get AI response
    //    For the hackathon, you'd do something like:
    //    const response = await fetch("http://localhost:8000/query", { ... });
    //    const data = await response.json();

    // 3) Mock an AI response
    const mockAIResponse = {
      sender: 'ai',
      text: `You said: "${userMessage.text}". This is a mock AI response.`,
    };
    setMessages((prev) => [...prev, mockAIResponse]);
  };

  // Press "Enter" to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Avoid newline
      handleSendMessage();
    }
  };

  // Demo placeholders for thumbs up/down & presentation icon
  const handlePresentation = () => {
    alert('Presentation mode is not yet implemented!');
  };
  const handleThumbsUp = () => {
    alert('Thumbs up clicked!');
  };
  const handleThumbsDown = () => {
    alert('Thumbs down clicked!');
  };

  // For "Search", "Reason", "..." icons
  const handleSearch = () => {
    alert('Search triggered!');
  };
  const handleReason = () => {
    alert('Reason triggered!');
  };
  const handleMore = () => {
    alert('More options...');
  };

  const handleMic = () => {
    alert('Voice input is not yet implemented!');
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <span>Web UI Copilot</span>
        <div className="header-right">
          <div className="user-avatar">KG</div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        {/* Chat controls: presentation, thumbs up/down */}
        <div className="chat-controls">
          <span className="icon-button" onClick={handlePresentation}>[Pres]</span>
          <span className="icon-button" onClick={handleThumbsUp}>👍</span>
          <span className="icon-button" onClick={handleThumbsDown}>👎</span>
        </div>

        {/* Input bubble with placeholders for icons */}
        <div className="input-bubble">
          <input
            type="text"
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="input-icons">
            <span className="icon-button" onClick={handleSearch}>Search</span>
            <span className="icon-button" onClick={handleReason}>Reason</span>
            <span className="icon-button" onClick={handleMore}>...</span>
          </div>
        </div>

        {/* Mic icon on the right */}
        <span className="icon-button" style={{ fontSize: '1.2rem' }} onClick={handleMic}>
          🎤
        </span>
      </div>
    </div>
  );
}

export default ChatSection;