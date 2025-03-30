import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';
import Header from './components/Header';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your Web UI Copilot. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSelectPrompt = (promptText) => {
    setInputValue(promptText);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content" style={{ display: 'flex' }}>
        <Sidebar
          messageHistory={messages}
          onSelectPrompt={handleSelectPrompt}
        />
        <ChatSection
          messages={messages}
          setMessages={setMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
    </div>
  );
}

export default App;