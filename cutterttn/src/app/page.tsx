import DownloadModule from "../components/DownloadModule";
import CutModule from "../components/CutModule";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Video Cutting Prototype
      </h1>
      <form className="flex items-center space-x-4 mb-8">
        <input
          type="text"
          placeholder="Dán URL video..."
          className="w-80 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
          Xác nhận
        </button>
      </form>

      <section className="space-y-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <DownloadModule />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <CutModule />
        </div>
      </section>
    </main>
  );
}
