import { $api } from "./api/client";
import { createContextProvider } from "./util/createContextProvider";

export const [AppProvider, useAppContext] = createContextProvider(() => {
  // Lấy danh sách học kỳ
  const { data: hocKys, isLoading: isHocKysLoading } = $api.useQuery(
    "get",
    "/semesters",
  );
  const hocKysData = hocKys || [];
  const currentSemester = hocKysData.find((hk) => hk.isCurrent);

  return {
    hocKysData,
    isHocKysLoading,
    currentSemester,
  };
});
