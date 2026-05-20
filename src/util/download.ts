export function downloadByUrl(url: string, fileName?: string, extension = "") {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName ? `${fileName}${extension}` : `file-${Date.now()}`;
  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

export function downloadFromBlob(
  blob: Blob,
  fileName?: string,
  extension = "",
) {
  const url = window.URL.createObjectURL(blob);
  downloadByUrl(url, fileName, extension);
}
