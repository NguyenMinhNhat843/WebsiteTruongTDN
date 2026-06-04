import type { paths } from "./v1";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

let accessTokenMemory: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;
};
export const getAccessToken = () => {
  return accessTokenMemory;
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

  async onResponse({ response, request }) {
    if (response.status === 401 && !request.url.includes("/auth/refresh")) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const refreshResponse: any = await client.POST("/auth/refresh");
      const newToken =
        refreshResponse.data?.access_token || refreshResponse.data?.accessToken;

      if (newToken) {
        setAccessToken(newToken);

        const newRequest = request.clone();
        newRequest.headers.set("Authorization", `Bearer ${newToken}`);
        return fetch(newRequest);
      } else {
        setAccessToken(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return response;
  },
});
