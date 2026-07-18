import { $api } from "./api/client";
import { createContextProvider } from "./util/createContextProvider";
import type { EnumRoleUser } from "./api/enum";
import { useState } from "react";

export const [AppProvider, useAppContext] = createContextProvider(() => {
  const [currentUser, setCurrentUser] = useState(() => {
    const curentUserRaw = localStorage.getItem("user");
    return curentUserRaw ? JSON.parse(curentUserRaw) : null;
  });
  const profile = currentUser?.profile || null;
  const userRole: EnumRoleUser = currentUser?.role || null;

  // Quản lý trạng thái Access Token
  const [accessToken, setAccessTokenState] = useState(() => {
    return localStorage.getItem("access_token");
  });

  // Hàm wrapper để vừa cập nhật State vừa lưu localStorage đồng bộ
  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("access_token", token);
      setAccessTokenState(token);
    } else {
      localStorage.removeItem("access_token");
      setAccessTokenState(null);
    }
  };

  const isUserLoggedIn = !!currentUser && !!accessToken;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setCurrentUser(null);
    setAccessTokenState(null);
  };

  /**
   * Lấy danh sách học kỳ
   */
  const { data: hocKys, isLoading: isHocKysLoading } = $api.useQuery(
    "get",
    "/semesters",
    { enabled: isUserLoggedIn }, // Chỉ chạy khi đã login
  );
  const hocKysData = hocKys || [];
  const currentSemester = hocKysData.find((hk) => hk.isCurrent);
  const hocKysOptions = hocKysData.map((hk) => ({
    value: hk.id,
    label: hk.name,
  }));

  /**
   * Lấy danh sách ngành
   */
  const {
    data: majors,
    isLoading: isMajorsLoading,
    error: majorsError,
  } = $api.useQuery("get", "/majors", { enabled: isUserLoggedIn });
  const majorsOptions = majors?.map((nganh) => ({
    value: nganh.id,
    label: nganh.majorName,
  }));

  /**
   * Lấy danh sách phòng ban
   */
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = $api.useQuery("get", "/departments", { enabled: isUserLoggedIn });

  return {
    hocKysData,
    isHocKysLoading,
    hocKysOptions,
    currentSemester,
    majors,
    isMajorsLoading,
    majorsError,
    majorsOptions,
    departments,
    isDepartmentsLoading,
    departmentsError,
    currentUser,
    setCurrentUser,
    profile,
    userRole,
    accessToken,
    setAccessToken,
    logout,
  };
});
