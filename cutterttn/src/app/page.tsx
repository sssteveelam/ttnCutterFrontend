// page.tsx
"use client";
import { useState } from "react";
import Image from "next/image";

import DownloadModule from "../components/DownloadModule";
import CutModule from "../components/CutModule";
import LogsPage from "./logs/page";

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
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Video Cutting Prototype
      </h1>
      <input
        type="text"
        placeholder="Dán URL video..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-80 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
        Xác nhận
      </button>

      {thumbnailUrl && (
        <div>
          <h1 className="text-2xl text-center p-2 font-bold text-gray-900 leading-tight">
            Thumbnail của bạn
          </h1>
          <Image
            loader={() => thumbnailUrl}
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            width={480}
            height={360}
            style={{ maxWidth: "100%", height: "auto" }}
            priority={true} // Tải hình ảnh ngay lập tức
          ></Image>
        </div>
      )}

      <section className="space-y-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <DownloadModule />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <CutModule />
        </div>
      </section>

      <section>
        <h1>LOG SECTION</h1>
        <LogsPage />
      </section>
    </main>
  );
}
