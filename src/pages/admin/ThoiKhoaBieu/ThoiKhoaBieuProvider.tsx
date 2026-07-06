import { useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";

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
        "/class-subject-session/plan-training",
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
    const scheduleItems =
      studySchedule
        ?.map((item) => {
          const classSubjectSessions = item.classSubjectSessions;
          return classSubjectSessions.map((session) => {
            return session.schedules.map((schedule) => ({
              ...schedule,
              startPeriod: session.startPeriod,
              endPeriod: session.endPeriod,
              shift: session.shift,
              dayOfWeek: session.dayOfWeek,
              room: session.roomId,
              teacher: item.teacher.fullName,
              subjectName: item.subject.subjectName,
            }));
          });
        })
        .flat(2) || [];

    return {
      semesterId,
      setSemesterId,
      classId,
      setClassId,
      studySchedule,
      scheduleItems,
      isLoadingStudySchedule,
      hocKysData,
      isHocKysLoading,
      lopHocsData,
      isLopHocsLoading,
      teachersData,
      isTeachersLoading,
    };
  });
