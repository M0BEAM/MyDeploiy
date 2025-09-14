"use client";
import { useState } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  metadata?: Record<string, unknown>;
}

const sampleLogs: LogEntry[] = [
 
];

export default function StaticLogs() {
  const [logs] = useState<LogEntry[]>(sampleLogs);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const filteredLogs = logs.filter((log: LogEntry) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel.toUpperCase();
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <select 
            className="bg-gray-800 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLevel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All levels</option>
            <option value="error">Error</option>
            <option value="warn">Warn</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs"
              className="bg-gray-800 text-sm rounded py-2 pl-8 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.386-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select className="bg-gray-800 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Live tail</option>
            <option>Paused</option>
          </select>
          <span className="text-sm">GMT+1</span>
        </div>
      </div>

      {/* Logs Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredLogs.length > 0 ? (
          <div className="space-y-2">
            {filteredLogs.map((log: LogEntry) => (
              <div
                key={log.id}
                className="bg-gray-800 rounded p-4 cursor-pointer hover:bg-gray-700"
                onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-mono px-2 py-1 rounded ${
                      log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                      log.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-400' :
                      log.level === 'INFO' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-gray-400 text-sm font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-gray-200">{log.message}</span>
                  </div>
                </div>

                {expandedLogId === log.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <pre className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-2">No logs for static service</h2>
            <p className="text-gray-400 text-center mb-4">
              New log entries that match your search parameters will appear her
            </p>
          </div>
        )}
      </div>
    </div>
  );
}