"use client";
import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { sendLog } from "@/services/logService";
import { start } from "repl";

const ffmpeg = new FFmpeg();

export default function CutModule() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:00:00");
  const [status, setStatus] = useState("");

  const handleCut = async () => {
    if (!videoFile) return;
    setStatus("Loading ffmpeg...");

    if (!ffmpeg.loaded) await ffmpeg.load();
    setStatus("Processing....");

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

    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(
      new Blob([data.buffer], {
        type: "video/mp4",
      })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "cut-output.mp4";
    a.click();
    // giai phong bo nho khi su dung createObjectUrl
    URL.revokeObjectURL(url);

    setStatus("Completed");

    // Gui log ve backend
    await sendLog({
      userId: "u123",
      action: "cut",
      status: "completed",
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cắt video</h2>

      <input
        type="file"
        accpect="video/mp4"
        onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex gap-4 my-4">
        <input
          type="text"
          placeholder="Start time (hh:mm:ss)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="End time (hh:mm:ss)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2"
        />
      </div>

      <button
        onClick={handleCut}
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Cắt video
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}
