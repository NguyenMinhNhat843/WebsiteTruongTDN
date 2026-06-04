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
});
