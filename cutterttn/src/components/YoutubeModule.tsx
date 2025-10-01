"use client";
import { useState, useRef, useEffect } from "react";

import { UrlInputForm } from "./UrlInputForm";
import { StatusDisplay } from "./StatusDisplay";
import { ResultsSection } from "./ResultsSection";
import { YoutubeIcon } from "./Icons"; // Import YoutubeIcon

import { sendLog } from "@/services/logService";
import { getVideoFormats } from "@/services/formatService";
import groupFormats, { GroupedFormats } from "@/utils/format";
import SuccessPopup from "./SuccessPopup";

const Header = () => (
  <div className="text-center mb-8 md:mb-12">
    <div className="flex justify-center items-center gap-3 sm:gap-4 mb-4">
      <YoutubeIcon />
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-800">
        YouTube Downloader
      </h1>
    </div>
    <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-500">
      Tải video, playlist, shorts từ YouTube với chất lượng gốc.
    </p>
  </div>
);

export default function YoutubeModule({ title }) {
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [formatsGrouped, setFormatsGrouped] = useState<GroupedFormats>({
    videos: [],
    audios: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [popupFromChild, setPopupFromChild] = useState<boolean>(false);

  const formatsSectionRef = useRef<HTMLDivElement>(null);
  const statusSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && formatsGrouped.videos.length > 0) {
      formatsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formatsGrouped, loading]);

  const handlePopupFromChild = (popup) => {
    setPopupFromChild(popup);
  };

  const handleDownloading = async (formatIdSelected: string) => {
    statusSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }
    setLoading(true);
    setProgress(0);
    try {
      setStatus(`Đang tải... đừng có mà hối nha!`);
      const res = await fetch("http://localhost:8000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format_id: formatIdSelected }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Server trả về lỗi ${res.status}`);
      }

      const contentDisposition = res.headers.get("Content-Disposition");

      let filename = "download";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename\*?=UTF-8''(.+)/
        );
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
        } else {
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
    if (!url) {
      setThumbnailUrl(null);
      return;
    }
    const youtubeRegExp =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;
    let match = url.match(youtubeRegExp);
    if (match && match[1]) {
      const videoId = match[1];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      setThumbnailUrl(thumbnailUrl);
      return;
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
    const timeoutId = setTimeout(
      () =>
        setStatus(
          `${funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}`
        ),
      2000
    );
    try {
      const allFormats = await getVideoFormats(url);
      const grouped = groupFormats(allFormats);
      setFormatsGrouped(grouped);
      setStatus("Đã tìm thấy !");
      formatsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Failed to fetch formats:", error);
      setStatus("Có lỗi ùi. Vui lòng kiểm tra lại URL.");
      clearTimeout(timeoutId);
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div ref={statusSectionRef}>
          <Header />
        </div>

        <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
          <UrlInputForm
            url={url}
            setUrl={setUrl}
            handleSubmit={fetchFormats}
            placeholder={"Youtube"}
            isLoading={loading}
          />
          <StatusDisplay
            status={status}
            progress={progress}
            isLoading={loading}
          />
        </div>

        <div ref={formatsSectionRef}>
          <ResultsSection
            thumbnailUrl={thumbnailUrl}
            formatsGrouped={formatsGrouped}
            handleDownloading={handleDownloading}
            handlePopupFromChild={handlePopupFromChild}
          />
        </div>

        <SuccessPopup
          isOpen={popupFromChild}
          onClose={() => setPopupFromChild(false)}
        />
      </div>
    </div>
  );
}
