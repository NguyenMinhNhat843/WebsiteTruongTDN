import type { paths } from "./v1";
import createClient from "openapi-fetch";

export const client = createClient<paths>({
  baseUrl: "http://localhost:5000/api", // Link BE
});

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
