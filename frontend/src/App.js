import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import ChatPage from "./Components/ChatPage";
import "./App.css";
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
