import { useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";

export type ScheduleItemDto = components["schemas"]["StudyScheduleResponseDto"];
export type SemesterDto = components["schemas"]["SemesterResponseDto"];

export const [ThoiKhoaBieuProvider, useThoiKhoaBieuContext] =
  createContextProvider(() => {
    const [semesterId, setSemesterId] = useState<number | null>(null);
    const [classId, setClassId] = useState<number | null>(null);

    /**
     * Load danh sách học kỳ
     */
    const { data: hocKysData, isLoading: isHocKysLoading } = $api.useQuery(
      "get",
      "/semesters",
    );

    /**
     * Load danh sách lớp học
     */
    const { data: lopHocsData, isLoading: isLopHocsLoading } = $api.useQuery(
      "get",
      "/classes",
    );

    /**
     * Load danh sách giáo viên
     */
    const { data: teachersData, isLoading: isTeachersLoading } = $api.useQuery(
      "get",
      "/staffs",
      {
        params: {
          query: {
            employeeRole: "TEACHER",
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
              semesterId: semesterId!,
              classId: classId!,
            },
          },
        },
        {
          enabled: !!semesterId && !!classId,
        },
      );

    return {
      semesterId,
      setSemesterId,
      classId,
      setClassId,
      studySchedule,
      isLoadingStudySchedule,
      hocKysData,
      isHocKysLoading,
      lopHocsData,
      isLopHocsLoading,
      teachersData,
      isTeachersLoading,
    };
  });
