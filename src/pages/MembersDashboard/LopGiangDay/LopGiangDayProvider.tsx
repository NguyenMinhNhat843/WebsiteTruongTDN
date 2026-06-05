import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../../AppProvider";

export const [LopGiangDayProvider, useLopGiangDayContext] =
  createContextProvider(() => {
    const { currentSemester, hocKysData, currentUser, profile } =
      useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const semesterId = searchParams.get("semesterId") || undefined;
    const semesterIdNumber = semesterId ? Number(semesterId) : undefined;
    const classId = searchParams.get("classId") || undefined;
    const classIdNumber = classId ? Number(classId) : undefined;

    /**
     * Load danh sách môn học giảng dạy của giáo viên này trong 1 kỳ
     */
    const { data: classList, isLoading } = $api.useQuery(
      "get",
      "/course-offers",
      {
        params: {
          query: {
            teacherId: profile?.id,
            semesterId: semesterIdNumber,
          },
        },
      },
      {
        enabled: !!semesterIdNumber && !!profile?.id,
      },
    );
    console.log("semesterIdNumber: ", semesterIdNumber);
    console.log("profile: ", profile);

    return {
      classList: classList || [],
      isLoading,
      semesterIdNumber,
      searchParams,
      setSearchParams,
      currentSemester,
      hocKysData,
      currentUser,
      profile,
      classIdNumber,
    };
  });
