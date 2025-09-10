import { useState } from "react";

export default function CutModule() {
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:00:00");

  const parseTime = (timeString: string): number => {
    if (timeString) {
      const parts = timeString.split(":");

      if (parts && parts[0] && parts[1] && parts[2] && parts[3]) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);

        // Kiểm tra nếu các giá trị hợp lệ
        if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
          return hours * 3600 + minutes * 60 + seconds;
        }
      }
    }
    return 0;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cắt video</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-gray-700 font-medium mb-1">
            Bắt đầu
          </label>
          <input
            id="startTime"
            type="text"
            placeholder="00:00:00"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="block text-gray-700 font-medium mb-1">
            Kết thúc
          </label>
          <input
            id="endTime"
            type="text"
            placeholder="00:00:00"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => alert("Đang cắt.....")}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Cắt
        </button>
      </form>
    </div>
  );
}
