"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface LogEvent {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  raw: string;
}

export default function DeploymentLogs() {
  const [events, setEvents] = useState<LogEvent[]>([]);
  const searchParams = useSearchParams(); // Extracts query params
  const subdomain = searchParams.get("subdomain"); // Extracts the subdomain
  // Parse formatted log messages
  const parseLogMessage = (raw: string): LogEvent => {
    const logRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) => \[(\w+)\] (.*)$/;
    const match = raw.match(logRegex);

    return {
      id: crypto.randomUUID(),
      timestamp: match?.[1] || new Date().toISOString().split('.')[0].replace('T', ' '),
      level: (match?.[2] || 'INFO') as LogEvent['level'],
      message: match?.[3] || raw,
      raw
    };
  };

  useEffect(() => {
    if (!subdomain) return; // ❌ Don't connect without a valid subdomain
    const socket = io(process.env.NEXT_PUBLIC_API_URL_DEPLOY + "/", {
      query: { subdomain },
      transports: ['websocket'],
    });

    socket.on('log_update', (rawMessage: string) => {
      // const newEvent = parseLogMessage(rawMessage);
      setEvents(
        prev => {
      // Check if the log already exists based on raw message
      const alreadyExists = prev.some(event => event.raw === rawMessage);
      if (alreadyExists) return prev; // Don't add duplicate

      const newEvent = parseLogMessage(rawMessage);
      return [newEvent, ...prev.slice(0, 49)].reverse(); // Keep last 50
    }
      ); // Keep last 50 events
    });

    // Return a destructor function to clean up the socket connection
    return () => {
      socket.disconnect();
    };
  }, [subdomain]);

  // Get level styling
  const getLevelStyle = (level: LogEvent['level']) => {
    const base = "px-2 py-1 rounded-md text-sm font-mono flex items-center gap-2";
    switch (level) {
      case 'ERROR':
        return `${base} bg-red-100 text-red-800`;
      case 'WARN':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'DEBUG':
        return `${base} bg-gray-100 text-gray-800`;
      default:
        return `${base} bg-blue-100 text-blue-800`;
    }
  };

  // Get level icon
  const getLevelIcon = (level: LogEvent['level']) => {
    const iconStyle = "w-4 h-4";
    switch (level) {
      case 'ERROR':
        return <svg className={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>;
      case 'WARN':
        return <svg className={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      default:
        return <svg className={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Deployment Logs
          <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {subdomain}
          </span>
        </h2>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={getLevelStyle(event.level)}>
                    {getLevelIcon(event.level)}
                    {event.level}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.timestamp}
                  </span>
                </div>
                <div className="ml-1 font-mono text-sm text-gray-800">
                  {event.message}
                </div>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No deployment logs yet...
          </div>
        )}

      </div>
    </div>
  );
}