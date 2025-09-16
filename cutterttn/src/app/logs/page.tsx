"use client";
import { useState, useEffect } from "react";
import { getLogs } from "@/services/logService";
import { format } from "date-fns";

// Heroicons - Bạn có thể tìm thêm trên https://heroicons.com/
const DownloadIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .75.75v11.689l3.44-3.328a.75.75 0 1 1 1.026 1.06l-4.5 4.368a.75.75 0 0 1-1.026 0l-4.5-4.368a.75.75 0 1 1 1.026-1.06l3.44 3.328V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H4.5a3 3 0 0 1-3-3v-2.25a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const ScissorsIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M5.478 5.478a.75.75 0 0 1 1.06 0l1.322 1.321-.401-.077c-.504-.097-.98-.235-1.424-.413A5.987 5.987 0 0 1 3.75 7.5c0-.98.243-1.902.67-2.732.178-.444.316-.92.413-1.424l.077-.401 1.322 1.322ZM12 2.25a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM15 7.5a.75.75 0 0 1 .75-.75H18a3 3 0 0 1 3 3v.75a.75.75 0 0 1-1.5 0V10.5h-1.895a5.987 5.987 0 0 1-1.424-.413c-.47-.194-.928-.42-1.353-.679L15 7.5Zm-9.75 4.5a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM18 13.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM12 15a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0v-3.75a.75.75 0 0 1 .75-.75ZM5.478 18.522a.75.75 0 0 1-1.06 0l-1.322-1.321c.097-.504.235-.98.413-1.424A5.987 5.987 0 0 1 6.75 16.5c.98 0 1.902.243 2.732.67.444.178.92.316 1.424.413l.401.077-1.322 1.322a.75.75 0 0 1 0 1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckCircleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
      clipRule="evenodd"
    />
  </svg>
);

interface Log {
  logId: string;
  userId: string;
  action: string;
  status: string;
  timestamp: string; // Giả định log trả về có trường timestamp
}

const getActionDetails = (action: string) => {
  switch (action) {
    case "download":
      return {
        text: "Tải xuống Video",
        icon: <DownloadIcon className="h-5 w-5 text-indigo-500" />,
      };
    case "cut":
      return {
        text: "Cắt Video",
        icon: <ScissorsIcon className="h-5 w-5 text-rose-500" />,
      };
    default:
      return {
        text: "Hành động không xác định",
        icon: null,
      };
  }
};

const getStatusDetails = (status: string) => {
  switch (status) {
    case "completed":
      return {
        text: "Hoàn tất",
        className: "bg-green-100 text-green-700",
        icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
      };
    case "failed":
      return {
        text: "Thất bại",
        className: "bg-red-100 text-red-700",
        icon: <XCircleIcon className="h-4 w-4 text-red-500" />,
      };
    default:
      return {
        text: status,
        className: "bg-gray-100 text-gray-700",
        icon: null,
      };
  }
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs("u123");
        // Giả lập dữ liệu timestamp nếu API chưa có
        const logsWithTimestamp = data.map((log: any) => ({
          ...log,
          timestamp: new Date().toISOString(),
        }));
        setLogs(logsWithTimestamp.reverse()); // Hiển thị log mới nhất lên trên
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Lịch sử hoạt động
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-center text-gray-500 italic py-8">
          Không có lịch sử hoạt động nào.
        </p>
      )}

      {!loading && logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((item) => {
            const actionDetails = getActionDetails(item.action);
            const statusDetails = getStatusDetails(item.status);

            return (
              <div
                key={item.logId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition duration-300">
                {/* Action */}
                <div className="flex items-center space-x-3">
                  {actionDetails.icon}
                  <div>
                    <p className="font-semibold text-gray-700">
                      {actionDetails.text}
                    </p>
                    <p className="text-sm text-gray-500">
                      Thời gian:{" "}
                      {format(new Date(item.timestamp), "HH:mm, dd/MM/yyyy")}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusDetails.className}`}>
                  {statusDetails.icon}
                  <span>{statusDetails.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
