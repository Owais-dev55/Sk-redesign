import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://sk-redesign-production.up.railway.app";

export function useSocket(userId: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (userId && !socketRef.current) {
      const socket = io(SOCKET_URL, { transports: ["websocket"] });
      socket.emit("join", userId); 

      socketRef.current = socket;
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef;
}
