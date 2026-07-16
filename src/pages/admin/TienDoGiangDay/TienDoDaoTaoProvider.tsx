import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { useSearchParams } from "react-router-dom";

export type TrainingProgressDto =
  components["schemas"]["ResponseTrainingProgress"];

export const [TienDoDaoTaoProvider, useTienDoDaoTaoContext] =
  createContextProvider(() => {
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
        "/subjects/subjects-by-class-and-semester",
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
     * Lấy danh sách học kỳ trong thời gian học của lớp học
     */
    const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
      "get",
      "/semesters",
      {
        params: {
          query: {
            classId: classId!,
          },
        },
      },
      {
        enabled: !!classId,
      },
    );

    /**
     * Load bảng kế hoạch đào tạo
     */
    const { data: trainingPlan, isLoading: isLoadingTrainingPlan } =
      $api.useQuery("get", "/class-subject-session/plan-training", {
        params: {
          query: {
            semesterId: semesterId!,
            classId: classId!,
          },
        },
      }, {
        enabled: !!semesterId && !!classId,
      });

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
      teachers,
      isLoadingTeachers,
      trainingPlan,
      isLoadingTrainingPlan,
      semesters,
      isLoadingSemesters,

      //state
      semesterId,
      classId,
      searchParams,
      setSearchParams,
    };
  });
