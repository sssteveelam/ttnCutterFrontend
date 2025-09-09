export default function CutModule() {
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
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Cắt
        </button>
      </form>
    </div>
  );
}
