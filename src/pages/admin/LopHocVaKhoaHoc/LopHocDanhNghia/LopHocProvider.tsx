import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";

export type LopHocResponseDto = components["schemas"]["ClassResponseDto"];

export const [LopHocProvider, useLopHocContext] = createContextProvider(() => {
  /**
   * Lấy danh sách lớp học
   */
  const { data: LopHocList, isLoading: isLoadingLopHocList } = $api.useQuery(
    "get",
    "/classes",
  );

  return {
    LopHocList,
    isLoadingLopHocList,
  };
});
