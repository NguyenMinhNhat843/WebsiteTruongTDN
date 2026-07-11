import { useEffect, useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";
import type { components } from "../../../../api/v1";

export type ClassSubjectGrade = components["schemas"]["GradeStudentDto"];

export const [LopHocOneProvider, useLopHocOneContext] = createContextProvider(
  () => {
    const { currentSemester, isHocKysLoading } = useAppContext();
    const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);
    const [selectedSemesterId, setselectedSemesterId] = useState<number | null>(
      currentSemester ? currentSemester.id : null,
    );
    const { idLopHoc } = useParams();
    const idLopHocNumber = Number(idLopHoc);

    useEffect(() => {
      if (currentSemester && !isHocKysLoading) {
        setselectedSemesterId(currentSemester.id);
      }
    }, [currentSemester, isHocKysLoading]);

    /**
     * Lấy lớp học theo id
     */
    const {
      data: LopHocDetail,
      isLoading: isLoadingLopHocDetail,
      refetch: refetchLopHocDetail,
    } = $api.useQuery(
      "get",
      `/classes/{id}`,
      {
        params: {
          path: {
            id: idLopHocNumber!,
          },
        },
      },
      {
        enabled: !!idLopHocNumber,
      },
    );

    const {
      data: studentsInLopHoc,
      isLoading: isLoadingStudentsInLopHoc,
      refetch: refetchStudentsInLopHoc,
    } = $api.useQuery(
      "get",
      "/students",
      {
        params: {
          query: {
            classId: idLopHocNumber,
          },
        },
      },
      {
        enabled: !!idLopHocNumber,
      },
    );

    /**
     * Lấy danh sách môn theo học kỳ đã chọn, lấy từ chương trình khung
     */
    const { data: dataMonHocs, isLoading: isMonHocsLoading } = $api.useQuery(
      "get",
      "/course-offers",
      {
        params: {
          query: {
            semesterId: selectedSemesterId!,
            classId: idLopHocNumber,
          },
        },
      },
      {
        enabled: selectedSemesterId !== null,
      },
    );

    /**
     * Lấy danh sách ClassSubject theo semester đã chọn
     */
    const {
      data: classSubjects,
      isLoading: isClassSubjectsLoading,
      refetch: refetchClassSubjects,
    } = $api.useQuery(
      "get",
      "/course-offers",
      {
        params: {
          query: {
            classId: idLopHocNumber,
            semesterId: selectedSemesterId!,
          },
        },
      },
      {
        enabled: selectedSemesterId !== null,
      },
    );

    /**
     * Load danh sách giáo viên
     */
    const { data: dataGiaoViens, isLoading: isGiaoViensLoading } =
      $api.useQuery("get", "/staffs", {
        params: {
          query: {
            employeeRole: "TEACHER",
          },
        },
      });

    /**
     * Export excel
     */
    const { mutate: exportExcel, isPending: isExportingExcel } =
      $api.useMutation("post", "/course-offers/export-excel");

    const { mutate: exportStudentGrade, isPending: isExportingStudentGrade } =
      $api.useMutation("get", "/course-offers/student/{id}/export-excel");

    return {
      LopHocDetail,
      isLoadingLopHocDetail,
      refetchLopHocDetail,
      studentsInLopHoc,
      isLoadingStudentsInLopHoc,
      refetchStudentsInLopHoc,
      selectedSemesterId,
      setselectedSemesterId,
      dataMonHocs,
      isMonHocsLoading,
      classSubjects,
      isClassSubjectsLoading,
      dataGiaoViens,
      isGiaoViensLoading,
      refetchClassSubjects,
      exportExcel,
      isExportingExcel,
      exportStudentGrade,
      isExportingStudentGrade,
      isOpenModalAddStudent,
      setIsOpenModalAddStudent,
    };
  },
);
