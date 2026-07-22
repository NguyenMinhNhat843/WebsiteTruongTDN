import { $api } from "../api/client";
import type { paths } from "../api/v1";

/**
 * Hook lấy danh sách năm học dùng chung toàn app
 */
export type QueryAcademicYearDto =
  paths["/academic-years"]["get"]["parameters"]["query"];
export const useGetAcademicYears = (queryParams?: QueryAcademicYearDto) => {
  return $api.useQuery("get", "/academic-years", {
    params: {
      query: {
        ...queryParams,
      },
    },
  });
};
