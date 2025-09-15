"use client";
import { useState, useEffect } from "react";
import { sendLog } from "@/services/logService";
import { saveBlobToFile } from "@/utils/storage";
import { getVideoFormats } from "@/services/formatService";

interface Log {
  userId: string;
  action: string;
  status: string;
}

export default function DownloadModule() {
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [mediaType, setMediaType] = useState<"video" | "audio">("video");
  const [formats, setFormats] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("");

  const handleDownloading = async () => {
    if (!url.startsWith("http")) {
      alert("URL không hợp lệ!");
      return;
    }

    try {
      setStatus("Đang tải....");
      const res = await fetch("http://localhost:8000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          type: mediaType,
          format_id: selectedFormat,
        }),
      });

      const data = await res.json();

      const link = document.createElement("a");
      link.href = data.download_url;
      link.download = data.filename;
      link.target = "_blank";
      link.click();

      await sendLog({
        logId: crypto.randomUUID(),
        userId: "u123",
        action: "download",
        status: "completed",
      });

      setStatus("Tải xong...!");
      // -------------------------------
      // const response = await fetch(url);
      // const blob = await response.blob();

      // saveBlobToFile(blob, "video.mp4");

      // setStatus("Completed");

      // await sendLog({
      //   userId: "u123",
      //   action: "download",
      //   status: "completed",
      // });
    } catch (error) {
      console.error("Download failed:", error);
      setStatus("Failed");
    }
  };

  const fetchFormats = async () => {
    console.log("working");
    const data = await getVideoFormats(url);
    setFormats(data);
    if (data.length > 0) {
      // neu co thi chon gia tri mac dinh la thap nhat
      setSelectedFormat(data[0].format_id);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Tải Video hoặc Audio
      </h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Dán link youtube vào đây...."
      />

      <button
        onClick={fetchFormats}
        className="bg-gray-200 text-sm px-4 py-1 rounded hover:bg-gray-300">
        Lấy chất lượng
      </button>

      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="type"
            value="video"
            checked={mediaType === "video"}
            onChange={() => setMediaType("video")}
          />
          Video
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="audio"
            checked={mediaType === "audio"}
            onChange={() => setMediaType("audio")}
          />
          Audio
        </label>
      </div>

      <button
        onClick={() => {
          handleDownloading();
        }}
        className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105">
        Tải xuống
      </button>

      {status && <p className="text-sm text-gray-600 italic">{status}</p>}

      <select
        className="border px-2 py-1"
        value={selectedFormat}
        onChange={(e) => setSelectedFormat(e.target.value)}>
        {formats?.map((f) => (
          <option key={f.format_id} value={f.format_id}>
            {f.resolution || f.note} ({f.ext})
          </option>
        ))}
      </select>
    </div>
  );
}
