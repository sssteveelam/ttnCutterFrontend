export const StatusDisplay = ({ status, progress, isLoading }) => {
  if (!status) return;

  return (
    <div className="mt-6">
      <div className="p-4 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
        <p className="font-medium text-center">{status}</p>
      </div>

      {isLoading && progress > 0 && progress < 100 && (
        <div className="w-full bg-slate-200 rounded-full h-2.5 my-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};
