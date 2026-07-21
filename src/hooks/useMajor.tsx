import { $api } from "../api/client";
import type { paths } from "../api/v1";

/**
 * Hook lấy danh sách ngành/nghề đào tạo dùng chung toàn app
 */
export type QueryMajorDto = paths["/majors"]["get"]["parameters"]["query"];

export const useGetMajors = (queryParams?: QueryMajorDto) => {
  return $api.useQuery("get", "/majors");
};
