"use client";

import { useEffect, useRef, useState } from "react";

export default function useMarketWebSocket() {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      console.log("WebSocket message:", message);

      if (message.type === "QUOTE_UPDATE") {
        setUpdates((prev) => ({
          ...prev,
          [message.symbol]: message,
        }));
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    isConnected,
    updates,
  };
}
