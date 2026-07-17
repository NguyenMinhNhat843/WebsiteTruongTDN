import { useEffect, useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";
import type { components } from "../../../../api/v1";

export type ClassSubjectGrade = components["schemas"]["GradeStudentDto"];

export const [LopHocOneProvider, useLopHocOneContext] = createContextProvider(
  () => {
    const { currentSemester } = useAppContext();
    const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);
    const [selectedSemesterId, setselectedSemesterId] = useState<number | null>(
      currentSemester ? currentSemester.id : null,
    );
    const { idLopHoc } = useParams();
    const idLopHocNumber = Number(idLopHoc);

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

    /** Lấy danh sách học kỳ thuộc về khóa học này */
    const { data: hocKysData, isLoading: isHocKysLoading } = $api.useQuery(
      "get",
      "/semesters",
      {
        params: {
          query: {
            classId: LopHocDetail?.id,
          },
        },
      },
      {
        enabled: !!LopHocDetail?.id,
      },
    );

    useEffect(() => {
      if (currentSemester && !isHocKysLoading) {
        setselectedSemesterId(currentSemester.id);
      }
    }, [currentSemester, isHocKysLoading]);

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
            limit: 100,
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
     * Export excel
     */
    const { mutate: exportExcel, isPending: isExportingExcel } =
      $api.useMutation("post", "/course-offers/export-excel");

    const { mutate: exportStudentGrade, isPending: isExportingStudentGrade } =
      $api.useMutation("get", "/course-offers/student/{id}/export-excel");

    /**
     * Export bảng điểm tổng hợp
     */
    const {
      mutate: exportClassComprehensiveTranscripts,
      isPending: isExportingClassComprehensiveTranscripts,
    } = $api.useMutation(
      "get",
      "/export-grade-table/comprehensive/export-excel",
    );

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
      refetchClassSubjects,
      exportExcel,
      isExportingExcel,
      exportStudentGrade,
      isExportingStudentGrade,
      isOpenModalAddStudent,
      setIsOpenModalAddStudent,
      hocKysData,
      isHocKysLoading,
      exportClassComprehensiveTranscripts,
      isExportingClassComprehensiveTranscripts,
    };
  },
);
