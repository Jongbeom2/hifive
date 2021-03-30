import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
const API_URL = "http://localhost:4000";
// const API_URL = "http://localhost:4000";
const App = () => {
  const [hifiveNum, setHifiveNum] = useState(0);
  useEffect(() => {
    const socket = socketIOClient(API_URL);
    socket.on("hifive", () => {
      setHifiveNum((hifive) => hifive + 1);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const onClickBtn = async () => {
    await axios.post(`${API_URL}/hifive`);
  };
  return (
    <div className="main">
      <div className="title">Pub-Sub Tutorial</div>
      <div className="content">HIFIVE : {hifiveNum}</div>
      <button className="button" onClick={onClickBtn}>
        🤚
      </button>
    </div>
  );
};

export default App;
