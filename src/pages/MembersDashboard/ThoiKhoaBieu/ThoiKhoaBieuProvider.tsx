import { useSearchParams } from "react-router-dom";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import { useAppContext } from "../../../AppProvider";

export const [ThoiKhoaBieuProvider, useThoiKhoaBieuContext] =
  createContextProvider(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const semesterId = searchParams.get("semesterId");
    const semesterIdNum = semesterId ? parseInt(semesterId) : null;
    const { profile } = useAppContext();
    const teacherId = profile?.id;

    /**
     * Load semester
     */
    const { data: semesterData, isLoading: isSemesterLoading } = $api.useQuery(
      "get",
      "/semesters/{id}",
      {
        params: {
          path: {
            id: semesterIdNum!,
          },
        },
      },
    );

    /**
     * Load tiến độ đào tạo
     */
    const { data: studySchedule, isLoading: isLoadingStudySchedule } =
      $api.useQuery(
        "get",
        "/schedule",
        {
          params: {
            query: {
              semesterId: semesterIdNum!,
              teacherId: teacherId!,
            },
          },
        },
        {
          enabled: !!semesterIdNum && !!teacherId,
        },
      );

    return {
      studySchedule,
      isLoadingStudySchedule,
      semester: semesterData,
      isSemesterLoading,
      semesterIdSelected: semesterIdNum,
      setSearchParams,
      searchParams,
    };
  });
