"use client";
// compo
export default function FormatCard({
  format,
  onSelectFormat,
  isAudio = false,
}: {
  format: any;
  onSelectFormat: (formatId: string) => void;
  isAudio?: boolean;
}) {
  // Hàm format dung lượng file cho dễ đọc
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="border rounded-lg p-3 my-1 shadow-sm flex flex-col items-stretch text-center">
      <div className="flex-grow">
        <p className="font-semibold">
          {isAudio ? format.note : format.resolution} (
          {format.ext.toUpperCase()})
        </p>
        <p className="text-sm text-gray-500">
          {formatBytes(format.filesize || 0)}
        </p>
        {!isAudio && format.acodec === "none" && (
          <p className="text-xs text-yellow-600 font-bold">
            (Không có âm thanh - Sẽ tự động ghép)
          </p>
        )}
      </div>
      <button
        onClick={() => onSelectFormat(format.format_id)}
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full">
        Tải
      </button>
    </div>
  );
}
