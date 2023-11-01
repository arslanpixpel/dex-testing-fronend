/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Sockets = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", message => {
      console.log("Received message:", message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    socket.emit("message", message);
    messageInput.value = "";
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1>Socket.io Example</h1>
      <input type="text" id="messageInput" placeholder="Type a message" className="text-black" />
      <button onClick={sendMessage}>Send</button>
      <ul id="messages"></ul>
    </div>
  );
};

export default Sockets;
