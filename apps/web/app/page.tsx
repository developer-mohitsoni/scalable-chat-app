"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Home() {
  const { sendMessage } = useSocket();

  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <h1>All Messages will appear here</h1>
      </div>
      <div>
        <input
          className={classes["chat-input"]}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
        />
        <button
          onClick={() => sendMessage(message)}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
    </div>
  );
}
