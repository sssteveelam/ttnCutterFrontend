"use client";
import { useState } from "react";
import Image from "next/image";

import DownloadModule from "../components/DownloadModule";
import CutModule from "../components/CutModule";
import LogsPage from "./logs/page";

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

const ListIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleConfirm = () => {
    // Reg cho viec detection youtube ID video
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})/;

    const match = videoUrl.match(regExp);

    if (match && match[1]) {
      const videoId = match[1];

      // Tạo URL thumbnail chuẩn của YouTube
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      setThumbnailUrl(thumbnail);
    } else {
      alert("Vui lòng nhập một URL YouTube hợp lệ.");
      setThumbnailUrl(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10 flex flex-col items-center font-sans text-gray-800">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center text-indigo-700">
        Video Cutting Prototype
      </h1>

      <div className="w-full max-w-5xl space-y-8">
        {/* Download Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <DownloadIcon className="h-8 w-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-700">
              Tải xuống Video
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Nhập URL YouTube và tải xuống video để bắt đầu.
          </p>
          <DownloadModule />
        </section>

        {/* Cut Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <ScissorsIcon className="h-8 w-8 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-700">Cắt Video</h2>
          </div>
          <p className="text-gray-500 mb-6">
            Cắt các phân đoạn mong muốn từ video đã tải xuống.
          </p>
          <CutModule />
        </section>

        {/* Log Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <ListIcon className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-700">
              Lịch sử Hoạt động (Logs)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Xem lại lịch sử các tác vụ đã thực hiện.
          </p>
          <LogsPage />
        </section>
      </div>
    </main>
  );
}
