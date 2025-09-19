"use client";
import { useState } from "react";
import { sendLog } from "@/services/logService";
import { saveBlobToFile } from "@/utils/storage";
import { getVideoFormats } from "@/services/formatService";
import groupFormats, { GroupedFormats } from "@/utils/format";
import Image from "next/image";
import FormatCard from "./FormatCard";
import SuccessPopup from "./SuccessPopup";

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
  const [slowDownloadMessage, setSlowDownloadMessage] = useState(false);
  const [popupFromChild, setPopupFromChild] = useState<boolean>(false);

  const handlePopupFromChild = (popup) => {
    setPopupFromChild(popup);
  };

  const handleDownloading = async (formatIdSelected: string) => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }
    setLoading(true);
    setProgress(0); // Reset progress bar
    try {
      setStatus(`Đang tải... đừng có mà hối nha!`);

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
    setStatus("Ráng chờ một xíu, sắp có điều bất ngờ...");

    const funnyMessages = [
      "Bạn đi pha cà phê chưa?",
      "Internet nhà bạn có ổn không? 🐌",
      "Chờ một chút nữa nha, sắp xong rồi...",
    ];

    const timeoutId = setTimeout(() => {
      setStatus(
        `${funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}`
      );
    }, 2000);

    try {
      const allFormats = await getVideoFormats(url);
      const grouped = groupFormats(allFormats);
      setFormatsGrouped(grouped);
      setStatus("Đã tìm thấy !");
    } catch (error) {
      console.error("Failed to fetch formats:", error);
      setStatus("Có lỗi ùi. Vui lòng kiểm tra lại URL.");
      clearTimeout(timeoutId);
    } finally {
      setLoading(false);
      setSlowDownloadMessage(false); // reset lại mỗi lần tải
      clearTimeout(timeoutId);
    }
  };

  return (
    // ---- Container chính ----
    <div className="w-full max-w-6xl mx-auto p-4 font-sans">
      <div className="flex items-center space-x-3 mb-4">
        <svg
          className="h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v11.689l3.44-3.328a.75.75 0 1 1 1.026 1.06l-4.5 4.368a.75.75 0 0 1-1.026 0l-4.5-4.368a.75.75 0 1 1 1.026-1.06l3.44 3.328V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H4.5a3 3 0 0 1-3-3v-2.25a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700">Tải xuống Video</h2>
      </div>
      <p className="text-gray-500 mb-6">
        Nhập URL YouTube và tải xuống video để bắt đầu.
      </p>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
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
          <div
            className={`flex items-center flex items-center ${
              loading
                ? "bg-indigo-100 text-indigo-800"
                : "bg-green-200 text-[#ff5050]"
            } text-sm font-bold px-4 py-3 rounded-md mb-4 text-sm font-bold px-4 py-3 rounded-md mb-4`}
            role="alert">
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <></>
            )}
            <p className="pl-2">{status}</p>
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
                        onPopup={handlePopupFromChild}
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

      <SuccessPopup
        isOpen={popupFromChild}
        onClose={() => setPopupFromChild(false)}
      />
    </div>
  );
}
