"use client";

import React, { useState } from "react";
import classes from "./page.module.css";
import { useSocket } from "../context/SocketProvider";

type Props = {};

const HomePage = (props: Props) => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <div>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className={classes["chat-input"]}
            placeholder="Message..."
          />
          <button
            onClick={(e) => {
              sendMessage(message);
              setMessage("");
            }}
            className={classes["button"]}
          >
            Send
          </button>
        </div>
        <div>
          {messages.map((e) => (
            <li>{e}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
