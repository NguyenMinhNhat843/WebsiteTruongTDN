import { $api } from "./api/client";
import { createContextProvider } from "./util/createContextProvider";
import type { EnumRoleUser } from "./api/enum";

export const [AppProvider, useAppContext] = createContextProvider(() => {
  // 💡 Lấy thông tin user hiện tại từ localStorage
  const curentUserRaw = localStorage.getItem("user");
  const currentUser = curentUserRaw ? JSON.parse(curentUserRaw) : null;
  const profile = currentUser?.profile || null;
  const userRole: EnumRoleUser = currentUser?.role || null;

  // 💡 Chỉ kích hoạt gọi API khi thực sự đã đăng nhập (có user)
  const isUserLoggedIn = !!currentUser;

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

  console.log("currentUser", currentUser);

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
    profile,
    userRole,
  };
});
