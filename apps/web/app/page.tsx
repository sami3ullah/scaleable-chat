"use client";

import React, { useState } from "react";
import classes from "./page.module.css";
import { useSocket } from "../context/SocketProvider";

type Props = {};

const HomePage = (props: Props) => {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <h3>All Messages will appear here</h3>
        <div>
          <input
            onChange={(e) => setMessage(e.target.value)}
            className={classes["chat-input"]}
            placeholder="Message..."
          />
          <button
            onClick={(e) => sendMessage(message)}
            className={classes["button"]}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
