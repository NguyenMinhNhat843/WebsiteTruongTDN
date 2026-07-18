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

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm hỗ trợ xếp hàng các request đợi token mới
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Hàm thông báo cho các request đang đợi khi đã lấy được token mới thành công
const onRerefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

client.use({
  onRequest({ request }) {
    const token = getAccessToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ request, response }) {
    const isLoginRequest = request.url.includes("/auth/login");
    const isRefreshRequest = request.url.includes("/auth/refresh");
    const isAlreadyOnLoginPage = window.location.pathname === "/admin/login";

    if (
      response.status === 401 &&
      !isLoginRequest &&
      !isAlreadyOnLoginPage &&
      !isRefreshRequest
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data, error } = await client.POST("/auth/refresh");

          if (error || !data?.access_token) {
            throw new Error("Refresh token failed");
          }

          const newAccessToken = data.access_token;
          setAccessToken(newAccessToken);

          onRerefreshed(newAccessToken);
          isRefreshing = false;

          request.headers.set("Authorization", `Bearer ${newAccessToken}`);
          return fetch(request);
        } catch (err) {
          isRefreshing = false;
          refreshSubscribers = [];

          setAccessToken(null);
          localStorage.removeItem("user");

          // KIỂM TRA XEM CÓ ĐANG Ở VÙNG QUẢN TRỊ HOẶC TRANG NỘI BỘ KHÔNG
          const pathname = window.location.pathname;
          const isDashboardRoute =
            pathname.startsWith("/admin") ||
            pathname.startsWith("/teacher") ||
            pathname.startsWith("/student");

          // Chỉ khi đang ở trong các trang quản trị thì mới ép quay về màn hình login
          if (isDashboardRoute) {
            window.location.href = "/admin/login";
          }

          return response;
        }
      }

      // Nếu hệ thống đang trong quá trình refresh (isRefreshing === true),
      // tạo ra một Promise bắt request này "đứng đợi" cho đến khi hoàn thành
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          request.headers.set("Authorization", `Bearer ${token}`);
          resolve(fetch(request));
        });
      });
    }
    return response;
  },
});
