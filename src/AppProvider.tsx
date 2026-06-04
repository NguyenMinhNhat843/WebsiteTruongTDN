import { useEffect, useState } from "react";
import { $api, setAccessToken } from "./api/client";
import { createContextProvider } from "./util/createContextProvider";

export const [AppProvider, useAppContext] = createContextProvider(() => {
  /**
   * Gọi refresh cấp lại token mới
   */
  const [isInitialized, setIsInitialized] = useState(false);
  const { mutate: refreshToken, isPending: isPendingRefreshToken } =
    $api.useMutation("post", "/auth/refresh");
  useEffect(() => {
    refreshToken(
      {},
      {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        onSuccess: (res: any) => {
          console.log(res);
          if (res?.access_token) {
            setAccessToken(res.access_token);
          }
          setIsInitialized(true); // Đã xử lý xong
        },
        onError: () => {
          setAccessToken(null);
          localStorage.removeItem("user");
          setIsInitialized(true); // Đã xử lý xong
        },
      },
    );
  }, []);

  /**
   * Lấy danh sách học kỳ
   */
  const { data: hocKys, isLoading: isHocKysLoading } = $api.useQuery(
    "get",
    "/semesters",
  );
  const hocKysData = hocKys || [];
  const currentSemester = hocKysData.find((hk) => hk.isCurrent);

  /**
   * Lấy danh sách ngành
   */
  const {
    data: majors,
    isLoading: isMajorsLoading,
    error: majorsError,
  } = $api.useQuery("get", "/majors");

  /**
   * Lấy danh sách phòng ban
   */
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = $api.useQuery("get", "/departments");

  const curentUserRaw = localStorage.getItem("user");
  const currentUser = curentUserRaw ? JSON.parse(curentUserRaw) : null;
  const profile = currentUser?.profile || null;

  return {
    hocKysData,
    isHocKysLoading,
    currentSemester,
    majors,
    isMajorsLoading,
    majorsError,
    departments,
    isDepartmentsLoading,
    departmentsError,
    currentUser,
    profile,
    isPendingRefreshToken,
    isAppInitialized: isInitialized,
  };
});
