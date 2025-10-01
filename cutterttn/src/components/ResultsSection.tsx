// components/ResultsSection.tsx
import Image from "next/image";
import { VideoIcon, AudioIcon } from "./Icons";
import { FormatList } from "./FormatList";

export const ResultsSection = ({
  thumbnailUrl,
  formatsGrouped,
  handleDownloading,
  handlePopupFromChild,
}) => {
  const hasResults =
    formatsGrouped.videos.length > 0 || formatsGrouped.audios.length > 0;
  if (!hasResults) return null;

  return (
    <div className="mt-12 w-full max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {thumbnailUrl && (
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
              <Image
                src={thumbnailUrl}
                alt="Video thumbnail"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="w-full lg:w-3/5 space-y-8">
          {formatsGrouped.videos.length > 0 && (
            <FormatList
              title="Chất lượng Video"
              icon={<VideoIcon className="w-7 h-7 text-blue-500" />}
              formats={formatsGrouped.videos}
              onSelectFormat={handleDownloading}
              onPopup={handlePopupFromChild}
            />
          )}

          {formatsGrouped.audios.length > 0 && (
            <FormatList
              title="Chỉ tải âm thanh"
              icon={<AudioIcon className="w-7 h-7 text-green-500" />}
              formats={formatsGrouped.audios}
              onSelectFormat={handleDownloading}
              onPopup={handlePopupFromChild}
              group="audio"
            />
          )}
        </div>
      </div>
    </div>
  );
};
