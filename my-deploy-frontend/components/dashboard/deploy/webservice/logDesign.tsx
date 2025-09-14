"use client";
import { useEffect, useState } from "react";
import Spinner from "../../main/spinner";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  metadata?: Record<string, unknown>;
}

export default function LogDesing({ deployId }: { deployId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL_DEPLOY}/api/logs/${deployId}`);

    eventSource.onmessage = (event) => {
      try {
        const logEntry: LogEntry = JSON.parse(event.data);
        setLogs((prev) => [...prev, logEntry]);
        setLoading(false)
      } catch (error) {
        console.error("Error parsing log entry:", error);
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: "ERROR",
            message: `Failed to parse log: ${event.data}`
          }
        ]);
        setLoading(false)

      }
    };

    return () => eventSource.close();
  }, [deployId]);

  useEffect(() => {
    if (autoScroll) {
      const logContainer = document.getElementById("log-container");
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel.toUpperCase();
    return matchesSearch && matchesLevel;
  });

  const formatTimestamp = (isoString: string) => {
    return isoString.replace("T", " ").split(".")[0];
  };


  if (loading)
    return (
        <Spinner />
    )

  return (
    <div className="h-[600px] flex flex-col bg-black text-gray-300 mx-4 my-4 rounded-lg overflow-hidden shadow-xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <select
            className="bg-gray-800 px-2 py-1 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              className="bg-gray-800 px-6 py-1 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-3 h-3 absolute left-2 top-1.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`px-2 py-1 rounded text-xs font-mono ${autoScroll ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
        >
          {autoScroll ? "▶ LIVE" : "⏹ PAUSED"}
        </button>
      </div>

      {/* Log Container */}
      <div
        id="log-container"
        className="flex-1 overflow-y-auto p-2 font-mono text-xs bg-black"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 transparent' }}
      >
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-baseline hover:bg-gray-900 px-2 py-1"
          >
            <span className="text-gray-500 shrink-0 mr-4">
              {formatTimestamp(log.timestamp)}
            </span>
            <span className={`mr-3 ${log.level === 'ERROR' ? 'text-red-500' :
              log.level === 'WARN' ? 'text-yellow-500' :
                log.level === 'INFO' ? 'text-blue-400' :
                  'text-gray-400'
              }`}>
              [{log.level}]
            </span>
            <span className="text-gray-300 break-all">
              {log.message}
              {log.metadata && (
                <div className="ml-4 mt-1 text-gray-500">
                  <pre className="text-xs border-l-2 border-gray-800 pl-2">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </span>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center text-gray-600 py-4 text-xs">
            No logs matching current filters
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-900 text-xs border-t border-gray-800">
        <div className="text-gray-500 font-mono">
          ● {filteredLogs.length}/{logs.length}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">●</span>
          <span className="text-gray-500">SSE CONNECTED</span>
        </div>
      </div>
    </div>
  );
}