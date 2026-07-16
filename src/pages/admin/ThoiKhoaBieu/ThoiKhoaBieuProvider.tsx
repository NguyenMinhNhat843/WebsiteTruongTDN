import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";
import { useSearchParams } from "react-router-dom"; // Thêm dòng này

export type SemesterDto = components["schemas"]["SemesterResponseDto"];

export const [ThoiKhoaBieuProvider, useThoiKhoaBieuContext] =
  createContextProvider(() => {
    // 1. Lấy dữ liệu từ URL thông qua useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // Ép kiểu về number hoặc null nếu chưa chọn
    const semesterId = searchParams.get("semesterId") ? Number(searchParams.get("semesterId")) : null;
    const classId = searchParams.get("classId") ? Number(searchParams.get("classId")) : null;

    // Hàm cập nhật URL khi user thay đổi selection
    const setSemesterId = (id: number | null) => {
      setSearchParams((prev) => {
        if (!id) prev.delete("semesterId");
        else prev.set("semesterId", String(id));
        return prev;
      });
    };

    const setClassId = (id: number | null) => {
      setSearchParams((prev) => {
        if (!id) prev.delete("classId");
        else prev.set("classId", String(id));
        return prev;
      });
    };

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
    const classSelected = lopHocsData?.find((item) => item.id === classId);

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
     * Load tiến độ đào tạo (Chỉ kích hoạt khi có cả 2 id trên URL)
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
              room: session?.room?.roomCode,
              teacher: item?.teacher?.fullName,
              subjectName: item.subject.subjectName,
              className: classSelected?.classCode
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