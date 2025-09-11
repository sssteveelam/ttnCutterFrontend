export function saveFile(key: string, data: Blob) {
  console.log("saveFile:", key, data);
}

export function getFile(key: string) {
  console.log("getFile:", key);
  return null;
}

export function saveBlobToFile(blob: Blob, filename: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename; // hardcode
  a.click();
  URL.revokeObjectURL(downloadUrl);
}
