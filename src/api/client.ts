import type { paths } from "./v1";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

const getBaseUrl = (): string => {
  const prodUrl =
    import.meta.env.VITE_SERVER_PRODUCTION ||
    "https://quantritruonghoc-be.onrender.com";
  const localUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  // Khi đã build deploy lên mạng, luôn luôn dùng Production
  if (import.meta.env.PROD) {
    return prodUrl;
  }

  // Ngược lại, nếu chạy local (dev) thì trả về localUrl
  return localUrl;
};

export const client = createFetchClient<paths>({
  baseUrl: getBaseUrl(), // Link BE
});

export const $api = createClient(client);

// Middleware để tự động đính kèm JWT Token vào Header
client.use({
  onRequest({ request }) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});
