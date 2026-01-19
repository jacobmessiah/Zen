export const generateCDN_URL = (filePath: string, mimeType: string): string => {
  const baseEndPoint = import.meta.env.VITE_BACKEND_URL;
  const url = `${baseEndPoint}/cdn/file?path=${filePath}&mimeType=${mimeType}`;
  return url;
};
