"use client";
import { useState, useEffect, useRef } from "react";
import { sendLog } from "@/services/logService";
import { saveBlobToFile } from "@/utils/storage";
import { getVideoFormats } from "@/services/formatService";
import groupFormats, { GroupedFormats } from "@/utils/format";
import Image from "next/image";
import FormatCard from "./FormatCard";
import SuccessPopup from "./SuccessPopup";
import axios from "axios";

export default function TiktokModule() {
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
      statusSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formatsGrouped, loading]);

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
    if (!url) {
      setThumbnailUrl(null);
      return;
    }

    fetchTiktokThumnbnail(url);
  };

  const fetchTiktokThumnbnail = async (url) => {
    await axios
      .post("http://localhost:8000/api/get-tiktok-thumbnail", {
        url: url,
      })
      .then(function (response) {
        setThumbnailUrl(response?.data?.thumbnailUrl);
      })
      .catch(function (error) {
        console.log(error);
      });
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
    <div className="min-h-screen font-sans text-black antialiased">
      <div
        ref={statusSectionRef}
        className="container mx-auto px-4 py-8 md:py-16">
        {/* ---- Phần Header ---- */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            {/* Logo TikTok */}
            <svg
              className="w-[48px] h-[48px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 293768 333327"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd">
              <path
                d="M204958 0c5369 45832 32829 78170 77253 81022v43471l-287 27V87593c-44424-2850-69965-30183-75333-76015l-47060-1v192819c6791 86790-60835 89368-86703 56462 30342 18977 79608 6642 73766-68039V0h58365zM78515 319644c-26591-5471-50770-21358-64969-44588-34496-56437-3401-148418 96651-157884v54345l-164 27v-40773C17274 145544 7961 245185 33650 286633c9906 15984 26169 27227 44864 33011z"
                fill="#26f4ee"
              />
              <path
                d="M218434 11587c3505 29920 15609 55386 35948 70259-27522-10602-43651-34934-47791-70262l11843 3zm63489 82463c3786 804 7734 1348 11844 1611v51530c-25770 2537-48321-5946-74600-21749l4034 88251c0 28460 106 41467-15166 67648-34260 58734-95927 63376-137628 35401 54529 22502 137077-4810 136916-103049v-96320c26279 15803 48830 24286 74600 21748V94050zm-171890 37247c5390-1122 11048-1985 16998-2548v54345c-21666 3569-35427 10222-41862 22528-20267 38754 5827 69491 35017 74111-33931 5638-73721-28750-49999-74111 6434-12304 18180-18959 39846-22528v-51797zm64479-119719h1808-1808z"
                fill="#fb2c53"
              />
              <path d="M206590 11578c5369 45832 30910 73164 75333 76015v51528c-25770 2539-48321-5945-74600-21748v96320c206 125717-135035 135283-173673 72939-25688-41449-16376-141089 76383-155862v52323c-21666 3569-33412 10224-39846 22528-39762 76035 98926 121273 89342-1225V11577l47060 1z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black relative">
            Tải Video TikTok
            {/* Hiệu ứng neon glow */}
            <span className="absolute -inset-1.5 block blur-xl bg-gradient-to-r from-[#FF0050] to-[#00F2EA] opacity-40 -z-10"></span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-400 mt-4">
            Dán link video, tải nhanh không logo. Đơn giản, miễn phí.
          </p>
        </div>

        {/* ---- Phần Nhập liệu ---- */}
        <div className="w-full max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link video tiktok vào đây..."
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-700 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00F2EA] transition duration-300 text-white placeholder-gray-500"
            />
            {/* Nút với hiệu ứng 2 màu của TikTok */}
            <button
              onClick={fetchFormats}
              disabled={loading || !url}
              className="relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-black overflow-hidden group transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0">
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-[#00F2EA] rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#FF0050] rounded-full group-hover:w-72 group-hover:h-72"></span>
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang Lấy...</span>
                  </>
                ) : (
                  "Tải Xuống"
                )}
              </span>
            </button>
          </div>

          {/* --- Thanh Trạng thái & Tiến trình --- */}
          {status && (
            <div className="mt-6 p-4 rounded-lg bg-gray-800 border border-gray-700">
              <p className="font-medium text-center text-gray-300">{status}</p>
            </div>
          )}
          {loading && progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-6 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-300 bg-gradient-to-r from-[#FF0050] to-[#00F2EA]"
                style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>

        {/* ---- Phần Hiển thị Kết quả ---- */}
        <div ref={formatsSectionRef}>
          {(formatsGrouped.videos.length > 0 ||
            formatsGrouped.audios.length > 0) && (
            <div className="mt-12 w-full max-w-5xl mx-auto animate-fade-in">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cột trái: Thumbnail */}
                <div className="w-full lg:w-2/5 flex-shrink-0">
                  {thumbnailUrl && (
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-gray-700 shadow-[#FF0050]/20">
                      <Image
                        src={thumbnailUrl}
                        alt="Video thumbnail"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Cột phải: Danh sách định dạng */}
                <div className="w-full lg:w-3/5 space-y-8">
                  {/* Định dạng Video */}
                  {formatsGrouped.videos.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-100">
                        <span className="text-[#00F2EA]">■</span>
                        <span>Video (Không Logo)</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formatsGrouped.videos.map((f) => (
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
                  {/* Định dạng Audio */}
                  {formatsGrouped.audios.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-100">
                        <span className="text-[#FF0050]">■</span>
                        <span>Âm Thanh (MP3)</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formatsGrouped.audios.map((f) => (
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

        <SuccessPopup
          isOpen={popupFromChild}
          onClose={() => setPopupFromChild(false)}
        />
      </div>
    </div>
  );
}
