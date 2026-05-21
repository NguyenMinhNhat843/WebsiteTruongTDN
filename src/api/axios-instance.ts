import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// Xác định URL dựa trên môi trường chạy của Frontend
const getBaseUrl = (): string => {
  const prodUrl =
    import.meta.env.VITE_SERVER_PRODUCTION ||
    "https://quantritruonghoc-be.onrender.com";
  const localUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  console.log(import.meta.env.DEV);

  // Nếu đang chạy 'npm run dev' ở máy local, ưu tiên dùng localUrl trước
  if (import.meta.env.DEV) {
    return localUrl;
  }

  // Khi đã build deploy lên mạng, luôn luôn dùng Production
  return prodUrl;
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

export const customInstance = <T>(
  url: string,
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();

  // Đảm bảo lấy đúng url từ config mà Orval đã gen (ví dụ: /students)
  const promise = AXIOS_INSTANCE({
    url,
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error Thêm phương thức cancel vào promise để có thể hủy request
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<Body> = Body;
