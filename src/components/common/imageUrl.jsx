export const getImageUrl = (path) => {
  const baseUrl = import.meta?.env?.VITE_API_URL || "http://10.10.7.8:5004";

  if (!path || typeof path !== "string") {
    return "/images/default-avatar.png";
  }
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) return `${baseUrl}${path}`;
  return `${baseUrl}/${path}`;
};
