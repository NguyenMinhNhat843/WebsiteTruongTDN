import { useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";
import { useSearchParams } from "react-router-dom";

export type CreateScheduleDto = components["schemas"]["CreateStudyScheduleDto"];
export type DayOfWeek = CreateScheduleDto["dayOfWeek"];
export type StudyScheduleResponseDto =
  components["schemas"]["StudyScheduleResponseDto"];

export const [TienDoDaoTaoProvider, useTienDoDaoTaoContext] =
  createContextProvider(() => {
    // const [semesterId, setSemesterId] = useState<number | null>();
    // const [classId, setClassId] = useState<number | null>();
    const [searchParams, setSearchParams] = useSearchParams();
    const semesterIdParams = searchParams.get("semesterId");
    const classIdParam = searchParams.get("classId");
    const semesterId = semesterIdParams ? Number(semesterIdParams) : null;
    const classId = classIdParam ? Number(classIdParam) : null;

    /**
     * Lấy danh sách giáo viên
     */
    const { data: giaoViens, isLoading: isLoadingGiaoViens } = $api.useQuery(
      "get",
      "/staffs",
    );

    /**
     * Lấy danh sách lớp học
     */
    const { data: classes, isLoading: isLoadingClasses } = $api.useQuery(
      "get",
      "/classes",
    );

    /**
     * Lấy danh sách dữ liệu các môn
     */
    const { data: classSubjects, isLoading: isLoadingClassSubjects } =
      $api.useQuery(
        "get",
        "/course-offers",
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

    /**
     * Tạo tiến độ đào tạo
     */
    const { mutate: createStudySchedule, isPending: isCreatingStudySchedule } =
      $api.useMutation("post", "/schedule/generate-schedule");

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

    /**
     * Bổ nhiệm giáo viên cho 1 môn của 1 lớp (API update classSubject)
     */
    const { mutate: assignTeacher, isPending: isAssigningTeacher } =
      $api.useMutation("patch", "/course-offers/{id}");

    /**
     * Load danh sách Giáo viên
     */
    const { data: teachers, isLoading: isLoadingTeachers } = $api.useQuery(
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

    return {
      giaoViens,
      isLoadingGiaoViens,
      classes,
      isLoadingClasses,
      classSubjects,
      isLoadingClassSubjects,
      createStudySchedule,
      isCreatingStudySchedule,
      studySchedule,
      isLoadingStudySchedule,
      teachers,
      isLoadingTeachers,
      assignTeacher,
      isAssigningTeacher,

      //state
      semesterId,
      // setSemesterId,
      classId,
      // setClassId,
      searchParams,
      setSearchParams,
    };
  });
