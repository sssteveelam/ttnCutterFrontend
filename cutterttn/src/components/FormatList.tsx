import FormatCard from "./FormatCard";

export const FormatList = ({
  title,
  icon,
  formats,
  onSelectFormat,
  onPopup,
  group,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="font-bold text-xl mb-4 text-slate-800 flex items-center gap-3">
      {icon}
      <span>{title}</span>
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {formats.map((f) => (
        <FormatCard
          key={f.format_id}
          format={f}
          onSelectFormat={onSelectFormat}
          onPopup={onPopup}
          {...(group && { group })}
        />
      ))}
    </div>
  </div>
);
