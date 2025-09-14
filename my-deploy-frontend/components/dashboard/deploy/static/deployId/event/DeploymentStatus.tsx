"use client";
import { useDeployStatic } from '@/hook/deploy/static/useDeployStatic';
import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

interface DeploymentStatusProps {
  deployId: string;
  status: string;
  setStatus: (status: string) => void;
}

export default function DeploymentStatus({ deployId, status, setStatus }: DeploymentStatusProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateDeployStatus } = useDeployStatic();

  const handleStatusChange = useCallback(async (deployId: string, newStatus: string) => {
    await updateDeployStatus(deployId, newStatus);
  }, [updateDeployStatus]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL_DEPLOY + '/', {
      path: '/socket.io',
      transports: ['websocket']
    });

    socket.emit('subscribe', deployId);

    socket.on('deployment-status', (data: { deployId: string; status: string; error?: string }) => {
      if (data.deployId === deployId) {
        setStatus(data.status);
        handleStatusChange(data.deployId, data.status);
        if (data.error) {
          setError(data.error);
        }
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Connection failed');
    });

    return () => {
      socket.off('deployment-status');
      socket.disconnect();
    };
  }, [deployId, handleStatusChange, setStatus]);

  return (
    <>
      {status.toUpperCase() === "SUCCESS" ? "✅" : status.toUpperCase() === "PENDING" ? "🕖" : "❌"}
      {error && <p className="error">Error: {error}</p>}
    </>
  );
}
