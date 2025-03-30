import React, { useEffect, useRef } from 'react';

function ChatSection({ messages, setMessages, inputValue, setInputValue }) {

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle "Send" or "Enter" key
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userMessage.text }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      const aiMessage = typeof data.response === "string"
        ? data.response
        : data.response?.content || "No response from AI.";

      setMessages((prev) => [...prev, { sender: "ai", text: aiMessage }]);
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
          <div key={idx} className={`message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            {
              typeof msg.text === 'string' && msg.text.trim().startsWith('{')
                ? <pre>{JSON.stringify(JSON.parse(msg.text), null, 2)}</pre>
                : msg.text
            }
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        {/* Chat controls: presentation, thumbs up/down */}
        <div className="chat-controls">
          <span className="icon-button" onClick={handlePresentation}>[Pres]</span>
          <span className="icon-button" onClick={handleThumbsUp}>👍</span>
          <span className="icon-button" onClick={handleThumbsDown}>👎</span>
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
