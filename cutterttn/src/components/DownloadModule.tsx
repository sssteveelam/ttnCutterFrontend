"use client";
import { useState } from "react";
import { sendLog } from "@/services/logService";
import { saveBlobToFile } from "@/utils/storage";
import { getVideoFormats } from "@/services/formatService";
import groupFormats, { GroupedFormats } from "@/utils/format";

import FormatCard from "./FormatCard"; // Đảm bảo FormatCard đã được thiết kế lại

export default function DownloadModule() {
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [formats, setFormats] = useState<any[]>([]);
  const [formatsGrouped, setFormatsGrouped] = useState<GroupedFormats>({
    videos: [],
    audios: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownloading = async (formatIdSelected: string) => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      setStatus(
        `Đang chuẩn bị tải định dạng ${formatIdSelected}... Vui lòng chờ.`
      );
      const res = await fetch("http://localhost:8000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          format_id: formatIdSelected,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Server trả về lỗi ${res.status}`);
      }

      setStatus("Đang tải file về trình duyệt...");

      const contentDisposition = res.headers.get("content-disposition");
      let filename = "downloaded_file";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename\*?=UTF-8''(.+)/
        );
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const data = await res.blob();

      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      await sendLog({
        logId: crypto.randomUUID(),
        userId: "u123",
        action: "download",
        status: "completed",
      });

      setStatus("Tải xuống hoàn tất! 🎉");
    } catch (error) {
      console.error("Download failed:", error);
      setStatus("Tải xuống thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFormats = async () => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }
    setLoading(true);
    setStatus("Đang tìm kiếm các định dạng có sẵn...");
    try {
      const allFormats = await getVideoFormats(url);
      const grouped = groupFormats(allFormats);
      setFormatsGrouped(grouped);
      setStatus("Đã tìm thấy các định dạng!");
    } catch (error) {
      console.error("Failed to fetch formats:", error);
      setStatus(
        "Không thể lấy danh sách định dạng. Vui lòng kiểm tra lại URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Tải Video / Audio
      </h2>

      {/* Input Section */}
      <div className="w-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Dán link YouTube vào đây..."
          className="flex-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <button
          onClick={fetchFormats}
          disabled={loading || !url}
          className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
            loading || !url
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          }`}>
          {loading ? "Đang xử lý..." : "Lấy chất lượng"}
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <p className="text-sm text-gray-600 italic text-center mb-6">
          {status}
        </p>
      )}

      {/* Formats Section */}
      {(formatsGrouped.videos.length > 0 ||
        formatsGrouped.audios.length > 0) && (
        <div className="w-full space-y-8">
          {/* Video Formats */}
          {formatsGrouped.videos.length > 0 && (
            <div>
              <h3 className="flex items-center justify-center font-bold text-xl mb-4 text-gray-700">
                <span className="mr-2 text-3xl">🎞️</span> Chọn chất lượng Video
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formatsGrouped.videos.map((f: any) => (
                  <FormatCard
                    key={f.format_id}
                    format={f}
                    onSelectFormat={handleDownloading}
                    isAudio={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio Formats */}
          {formatsGrouped.audios.length > 0 && (
            <div>
              <h3 className="flex items-center justify-center font-bold text-xl mb-4 text-gray-700">
                <span className="mr-2 text-3xl">🎵</span> Chọn chất lượng Audio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formatsGrouped.audios.map((f: any) => (
                  <FormatCard
                    key={f.format_id}
                    format={f}
                    onSelectFormat={handleDownloading}
                    isAudio={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Giả sử FormatCard có thể trông như thế này để phù hợp với giao diện mới
// components/FormatCard.tsx
// "use client";
// import React from "react";

// export default function FormatCard({ format, onSelectFormat, isAudio }) {
//   const formatClass = isAudio ? "bg-purple-100 border-purple-300 text-purple-800" : "bg-teal-100 border-teal-300 text-teal-800";
//   const icon = isAudio ? "🎵" : "🎥";

//   return (
//     <button
//       onClick={() => onSelectFormat(format.format_id)}
//       className={`w-full p-4 rounded-xl shadow-md border-2 transition duration-300 ease-in-out transform hover:scale-105 ${formatClass}`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <span className="text-xl mr-2">{icon}</span>
//           <p className="font-semibold">{format.ext}</p>
//         </div>
//         <p className="font-bold text-lg">{format.resolution || format.note}</p>
//       </div>
//       {/* Thêm các thông tin khác nếu cần */}
//       <p className="text-xs text-gray-500 mt-1 text-right">
//         Dung lượng: {(format.filesize / 1024 / 1024).toFixed(2)} MB
//       </p>
//     </button>
//   );
// }
