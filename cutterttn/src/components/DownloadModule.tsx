"use client";
import { useState } from "react";
import { sendLog } from "@/services/logService";
import { saveBlobToFile } from "@/utils/storage";
import { getVideoFormats } from "@/services/formatService";
import groupFormats, { GroupedFormats } from "@/utils/format";
import Image from "next/image";
import FormatCard from "./FormatCard";

export default function DownloadModule() {
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [formatsGrouped, setFormatsGrouped] = useState<GroupedFormats>({
    videos: [],
    audios: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleDownloading = async (formatIdSelected: string) => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }

    setLoading(true);
    setProgress(0); // Reset progress bar
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

      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "download"; // Tên file mặc định
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename\*?=UTF-8''(.+)/
        );
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
        } else {
          // Fallback cho trường hợp không có UTF-8
          const filenameFallback =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameFallback && filenameFallback[1])
            filename = filenameFallback[1];
        }
      }

      setStatus(`Đang tải file: ${filename}...`);

      const totalSize = parseInt(res.headers.get("Content-Length") || "0", 10);
      if (!res.body) throw new Error("Không có nội dung để tải.");
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (totalSize > 0) {
          const percent = Math.round((received / totalSize) * 100);
          setProgress(percent);
          setStatus(`Đang tải: ${percent}%`);
        }
      }

      const blob = new Blob(chunks);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
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

  const handleFetchThumbnail = () => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})/;
    if (url) {
      const match = url.match(regExp);
      if (match && match[1]) {
        const videoId = match[1];
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        setThumbnailUrl(thumbnail);
      } else {
        setThumbnailUrl(null);
      }
    }
  };

  const fetchFormats = async () => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }
    handleFetchThumbnail();
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
    // ---- Container chính ----
    <div className="w-full max-w-6xl mx-auto p-4 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Tải Video / Audio
        </h2>

        {/* --- Input Section --- */}
        <div className="w-full flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Dán link YouTube vào đây..."
            className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            onClick={fetchFormats}
            disabled={loading || !url}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white transition-transform transform hover:scale-105 ${
              loading || !url
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}>
            {loading ? "Đang xử lý..." : "Lấy định dạng"}
          </button>
        </div>

        {/* --- Status & Progress --- */}
        {status && (
          <div>
            
            <p className="text-sm text-gray-600 text-center mb-4 min-h-[20px]">
              
              {status}
            </p>
          </div>
        )}
        {loading && progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
            

            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>

      {/* --- PHẦN HIỂN THỊ KẾT QUẢ --- */}
      {(formatsGrouped.videos.length > 0 ||
        formatsGrouped.audios.length > 0) && (
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          {/* Container cho Thumbnail và Formats (Responsive hơn) */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cột trái: Thumbnail */}
            <div className="w-full md:w-1/3 lg:w-2/5 flex-shrink-0">
              {thumbnailUrl && (
                <div className="relative aspect-video">
                  <Image
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 40vw"
                    className="object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Cột phải: Danh sách các định dạng */}
            <div className="w-full md:w-2/3 lg:w-3/5 space-y-6">
              {/* Video Formats */}
              {formatsGrouped.videos.length > 0 && (
                <div>
                  <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                    <span className="mr-2 text-2xl">🎞️</span>
                    Chọn chất lượng Video
                  </h3>
                  {/* Grid layout responsive hơn */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {formatsGrouped.videos.map((f: any) => (
                      <FormatCard
                        key={f.format_id}
                        format={f}
                        onSelectFormat={handleDownloading}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Formats */}
              {formatsGrouped.audios.length > 0 && (
                <div>
                  <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                    <span className="mr-2 text-2xl">🎵</span>
                    Chọn chất lượng Audio
                  </h3>
                  {/* Grid layout responsive hơn */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {formatsGrouped.audios.map((f: any) => (
                      <FormatCard
                        key={f.format_id}
                        format={f}
                        onSelectFormat={handleDownloading}
                        group="audio"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
