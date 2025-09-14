"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function LogsComponent() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Create the socket connection on mount
    const socket = io('http://localhost:3010', {
      query: { subdomain: 'serviceWeb' },  // Ensure this matches the backend (subdomain "logs")
      transports: ['websocket'],
    });

    // Log connection events for debugging
    socket.on('connect', () => {
      console.log('Socket connected, id:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Listen for log updates
    socket.on('log_update', (message: string) => {
      console.log('Received log:', message);
      setLogs((prevLogs) => [...prevLogs, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Live Deployment Logs for logs</h2>
      <div style={{ whiteSpace: 'pre-line' }}>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}
