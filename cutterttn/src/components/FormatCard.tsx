"use client";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

const getQualityStyles = (format, group) => {
  if (group === "audio") {
    // Màu riêng cho audio (ví dụ: màu tím)
    return {
      bgColor: "bg-purple-100 hover:bg-purple-200",
      textColor: "text-purple-800",
      label: "Audio",
    };
  }

  const resolution = parseInt(format.resolution?.split("x")[1], 10);

  if (resolution >= 2160) {
    return {
      bgColor: "bg-red-100 hover:bg-red-200",
      textColor: "text-red-800",
      label: "Rất cao",
    };
  } else if (resolution >= 1080) {
    return {
      bgColor: "bg-orange-100 hover:bg-orange-200",
      textColor: "text-orange-800",
      label: "Cao",
    };
  } else if (resolution >= 480) {
    return {
      bgColor: "bg-blue-100 hover:bg-blue-200",
      textColor: "text-blue-800",
      label: "Trung bình",
    };
  } else {
    // 🟢 Xanh lá (Thấp)
    return {
      bgColor: "bg-green-100 hover:bg-green-200",
      textColor: "text-green-800",
      label: "Thấp",
    };
  }
};

export default function FormatCard({ format, onSelectFormat, group, onPopup }) {
  const [popup, setPopup] = useState<boolean>(false);

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return "N/A";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatText = (format) => {
    let text = `${
      group === "audio"
        ? `Audio: ${format.acodec}`
        : `Độ phân giải: ${format.resolution}`
    }`;

    text += `\nCodec: ${format.vcodec || format.acodec}`;

    if (format.filesize) {
      text += `\nDung lượng: ${formatBytes(format.filesize)}`;
    }
    return text;
  };

  const isAudio = group === "audio";

  const classGetQuality = getQualityStyles(format, group);

  const cardClasses = `
    p-4 rounded-xl shadow-sm text-center cursor-pointer 
    transition-all duration-300  ${classGetQuality?.bgColor} hover:scale-125
  `;

  return (
    <div
      onClick={() => {
        onPopup(true);
      }}>
      <div
        data-tooltip-id="format-tooltip"
        data-tooltip-content={formatText(format)}
        className={cardClasses}
        onClick={() => onSelectFormat(format?.format_id)}>
        <div className="flex flex-col items-center justify-center space-y-2 ">
          <svg
            className="w-8 h-8 text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
            />
          </svg>

          <p className={`font-bold ${classGetQuality?.textColor} text-lg`}>
            {isAudio
              ? format?.abr
                ? `${format?.abr}kbps`
                : "Audio"
              : `${format?.resolution?.split("x")[1]}p`}
          </p>

          <p className="text-sm text-gray-600">
            {format?.filesize
              ? formatBytes(format?.filesize)
              : "Đang cập nhật..."}
          </p>
        </div>
      </div>
      <Tooltip id="format-tooltip" />
    </div>
  );
}
