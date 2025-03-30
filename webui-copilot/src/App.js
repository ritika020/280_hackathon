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
  const [widgets, setWidgets] = useState([]);

  // Controls for modal data across components
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const addWidget = (widgetData) => {
    setWidgets((prev) => [...prev, widgetData]);
  };

  const removeWidget = (index) => {
    setWidgets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectPrompt = (promptText) => {
    setInputValue(promptText);
  };

  const openChart = (widget) => {
    setModalData(widget);
    setModalVisible(true);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content" style={{ display: 'flex' }}>
        <Sidebar
          messageHistory={messages}
          onSelectPrompt={handleSelectPrompt}
          widgets={widgets}
          removeWidget={removeWidget}
          openChart={openChart}
        />
        <ChatSection
          messages={messages}
          setMessages={setMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          addWidget={addWidget}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalData={modalData}
          setModalData={setModalData}
        />
      </div>
    </div>
  );
}

export default App;