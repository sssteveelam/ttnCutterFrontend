"use client";
import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { sendLog } from "@/services/logService";

// Heroicons - Bạn có thể tìm thêm trên https://heroicons.com/
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

export default function CutModule() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:00:00");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [ffmpeg, setFFmpeg] = useState(new FFmpeg());

  const handleCut = async () => {
    if (!videoFile) {
      setStatus("Vui lòng chọn một file video!");
      return;
    }

    setLoading(true);
    setStatus("Đang tải ffmpeg...");

    try {
      if (!ffmpeg.loaded) await ffmpeg.load();
      setStatus("Đang xử lý video...");

      // Ghi file input
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        startTime,
        "-to",
        endTime,
        "-c",
        "copy",
        "output.mp4",
      ]);

      const data = (await ffmpeg.readFile("output.mp4")) as any;
      const url = URL.createObjectURL(
        new Blob([data.buffer], {
          type: "video/mp4",
        })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "cut-output.mp4";
      document.body.appendChild(a); // Append to body to make it clickable
      a.click();
      document.body.removeChild(a); // Clean up
      URL.revokeObjectURL(url);

      setStatus("Cắt video hoàn tất! 🎉");

      // Gửi log về backend
      await sendLog({
        userId: "u123",
        action: "cut",
        status: "completed",
      });
    } catch (error) {
      console.error("Lỗi khi cắt video:", error);
      setStatus("Đã xảy ra lỗi khi cắt video. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-rose-600">
        Cắt video
      </h2>

      {/* File Input */}
      <label className="w-full text-center py-4 px-6 mb-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-300">
        <span className="text-gray-500 font-medium">
          {videoFile
            ? `File đã chọn: ${videoFile.name}`
            : "Chọn video để cắt (.mp4)"}
        </span>
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {/* Time Inputs */}
      <div className="w-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian bắt đầu
          </label>
          <input
            type="text"
            placeholder="hh:mm:ss"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-300"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian kết thúc
          </label>
          <input
            type="text"
            placeholder="hh:mm:ss"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-300"
          />
        </div>
      </div>

      {/* Cut Button */}
      <button
        onClick={handleCut}
        disabled={loading || !videoFile}
        className={`w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
          loading || !videoFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
        }`}>
        <ScissorsIcon className="h-5 w-5" />
        <span>{loading ? "Đang cắt..." : "Cắt video"}</span>
      </button>

      {/* Status Message */}
      {status && (
        <p className="mt-6 text-sm text-gray-600 italic text-center">
          {status}
        </p>
      )}
    </div>
  );
}
