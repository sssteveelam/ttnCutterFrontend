"use client";
import React, { useRef, useState } from "react";
import { sendLog } from "@/services/logService";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function CutModule() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ffmpeg] = useState(() => new FFmpeg());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setStart(0);
    setEnd(0);
    setStatus("");
  };

  const handleLoadedMetadata = () => {
    const dur = videoRef.current?.duration || 0;
    setDuration(dur);
    setEnd(dur);
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map((t) => String(t).padStart(2, "0")).join(":");
  };

  const handleCut = async () => {
    if (!videoFile || start >= end) {
      setStatus("Vui lòng chọn khoảng cắt hợp lệ.");
      return;
    }

    setLoading(true);
    setStatus("Đang xử lý video...");

    try {
      if (!ffmpeg.loaded) await ffmpeg.load();
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      await ffmpeg.exec([
        "-ss",
        String(start),
        "-to",
        String(end),
        "-i",
        "input.mp4",
        "-c",
        "copy",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "cut-output.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await sendLog({
        userId: "u123",
        action: "cut",
        status: "completed",
      });

      setStatus("🎉 Cắt video thành công!");
    } catch (err) {
      console.error("Cut error:", err);
      setStatus("❌ Lỗi khi cắt video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-rose-600">
        ✂️ Cắt Video
      </h1>

      {/* Input chọn video */}
      <label className="w-full block cursor-pointer border-2 border-dashed border-gray-300 p-4 rounded-xl text-center mb-6 hover:bg-gray-100 transition">
        <span className="text-gray-600">
          {videoFile ? `📁 ${videoFile.name}` : "🎬 Chọn video MP4 để cắt"}
        </span>
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Trình phát video */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full rounded-lg mb-4"
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}

      {/* Thanh chọn vùng thời gian */}
      {duration > 0 && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Thời gian bắt đầu:
            </label>
            <input
              type="range"
              min={0}
              max={duration}
              value={start}
              step={1}
              onChange={(e) => setStart(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-sm text-blue-700">{formatTime(start)}</span>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Thời gian kết thúc:
            </label>
            <input
              type="range"
              min={0}
              max={duration}
              value={end}
              step={1}
              onChange={(e) => setEnd(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <span className="text-sm text-red-700">{formatTime(end)}</span>
          </div>
        </div>
      )}

      {/* Nút xử lý */}
      <button
        onClick={handleCut}
        disabled={loading || !videoFile}
        className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition duration-300 ${
          loading || !videoFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-rose-600 hover:bg-rose-700"
        }`}>
        {loading
          ? "Đang xử lý..."
          : `✂️ Cắt từ ${formatTime(start)} → ${formatTime(end)}`}
      </button>

      {/* Thông báo trạng thái */}
      {status && (
        <p className="mt-6 text-center text-sm text-gray-600 italic">
          {status}
        </p>
      )}
    </div>
  );
}
