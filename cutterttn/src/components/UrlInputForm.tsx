// components/UrlInputForm.tsx
import { LinkIcon, SpinnerIcon } from "./Icons";

export const UrlInputForm = ({
  url,
  setUrl,
  handleSubmit,
  isLoading,
  placeholder,
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <LinkIcon className="h-6 w-6 text-gray-400" />
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={`Dán liên kết ${placeholder} vào đây...`}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-base"
      />
    </div>
    <button
      onClick={handleSubmit}
      disabled={isLoading || !url}
      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-[#1877F2] hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <SpinnerIcon className="animate-spin h-5 w-5 text-white" />
          <span>Đang xử lý...</span>
        </div>
      ) : (
        "Tải xuống"
      )}
    </button>
  </div>
);
