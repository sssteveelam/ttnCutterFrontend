export interface Format {
  format_id: string;
  vcodec: string;
  acodec: string;
  resolution?: string;
  note?: string;
  ext?: string;
  filesize?: number;
  format_note?: string;
}

export interface GrouppedFormats {
  videos: Format[];
  audios: Format[];
}

export default function groupFormats(formats: Format[]): GrouppedFormats {
  const videos: Format[] = [];
  const audios: Format[] = [];

  if (!Array.isArray(formats)) {
    console.error("Input is not an array:", formats);
    return { videos, audios };
  }

  formats.forEach((f) => {
    if (!f) return;

    const hasVideo = f.vcodec && f.vcodec !== "none";
    const hasAudio = f.acodec && f.acodec !== "none";

    if (hasVideo) {
      videos.push(f);
    } else if (hasAudio) {
      audios.push(f);
    }
  });

  videos.sort((a, b) => (b.filesize || 0) - (a.filesize || 0));
  audios.sort((a, b) => (b.filesize || 0) - (a.filesize || 0));

  return { videos, audios };
}
