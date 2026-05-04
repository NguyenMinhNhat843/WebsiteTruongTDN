import type { paths } from "./v1";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

export const client = createFetchClient<paths>({
  baseUrl: `${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}`, // Link BE
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
