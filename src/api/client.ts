import type { paths } from "./v1";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

export const getAccessToken = () => localStorage.getItem("access_token");
export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
};

const getBaseUrl = (): string => {
  const prodUrl =
    import.meta.env.VITE_SERVER_PRODUCTION ||
    "https://quantritruonghoc-be.onrender.com";
  const localUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  if (import.meta.env.PROD) {
    return prodUrl;
  }

  return localUrl;
};

export const client = createFetchClient<paths>({
  baseUrl: getBaseUrl(),
  credentials: "include",
});

export const $api = createClient(client);

client.use({
  onRequest({ request }) {
    const token = getAccessToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ response }) {
    // 💡 Nếu API báo token hết hạn hoặc không hợp lệ (401), logout ngay lập tức
    if (response.status === 401) {
      setAccessToken(null);
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return response;
  },
});
