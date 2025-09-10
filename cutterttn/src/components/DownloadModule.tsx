"use client";
import { useState, useEffect } from "react";
import { sendLog } from "@/services/logService";

interface Log {
  userId: string;
  action: string;
  status: string;
}

export default function DownloadModule() {
  const [url, setUrl] = useState<string>("");

  const handleSending = async () => {
    const log: Log = {
      userId: "u123",
      action: "download",
      status: "completed",
    };

    try {
      const response = await sendLog(log);
      console.log(response);
    } catch (e) {
      console.log("Error sending log: ", e);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Tải video</h2>
      <button
        onClick={() => {
          alert("Đang tải xuống....");
          handleSending();
        }}
        className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105">
        Tải xuống
      </button>
    </div>
  );
}
