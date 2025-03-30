import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';
import Header from './components/Header';

function App() {
  return (
    <div className="app-container">
      <Header />

      {/* Main Content */}
      <div className="main-content">
        {/* Left Sidebar (API Widget) */}
        <Sidebar />

        {/* Chat Section (Web UI Copilot) */}
        <ChatSection />
      </div>
    </div>
  );
}

export default App;