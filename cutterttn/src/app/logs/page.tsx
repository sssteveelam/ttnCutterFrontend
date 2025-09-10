"use client";
import { useState, useEffect } from "react";
import { getLogs } from "@/services/logService";

interface Log {
  logId: string;
  userId: string;
  action: string;
  status: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs("u123");
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Lịch sử Log</h1>
      {loading && <p>Loading...</p>}
      {!loading && logs.length === 0 && <p>Không có log nào.</p>}
      <ul>
        {logs.map((item) => (
          <li key={item.logId}>
            {item.action} - {item.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
