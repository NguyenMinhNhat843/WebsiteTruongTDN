import { useEffect, useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";
import type { components } from "../../../../api/v1";

export type ClassSubjectGrade =
  components["schemas"]["CourseOfferRegisResponseDto"];

export const [LopHocOneProvider, useLopHocOneContext] = createContextProvider(
  () => {
    const { currentSemester } = useAppContext();
    const [selectedSemesterId, setselectedSemesterId] = useState<number | null>(
      currentSemester ? currentSemester.id : null,
    );
    const { idLopHoc, idClassSubject } = useParams();
    const idLopHocNumber = Number(idLopHoc);
    const idClassSubjectNumber = Number(idClassSubject);

    useEffect(() => {
      if (currentSemester) {
        setselectedSemesterId(currentSemester.id);
      }
    }, [currentSemester]);

    /**
     * Lấy danh sách môn theo học kỳ đã chọn, lấy từ chương trình khung
     */
    const { data: dataMonHocs, isLoading: isMonHocsLoading } = $api.useQuery(
      "get",
      "/curriculums/curriculum-subjects/by-semester",
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
     * Lấy danh sách ClassSubject
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
     * Cập nhật thông tin classSubject
     */
    const {
      mutate: updateClassSubject,
      isPending: isPendingUpdateClassSubject,
    } = $api.useMutation("patch", "/course-offers/{id}");

    /**
     * Lấy bảng điểm của clssSubject
     */
    const {
      data: classSubject,
      isLoading: isClassSubjectLoading,
      refetch: refetchClassSubject,
    } = $api.useQuery(
      "get",
      "/course-offers/{id}",
      {
        params: {
          path: {
            id: idClassSubjectNumber!,
          },
        },
      },
      {
        enabled: !!idClassSubjectNumber,
      },
    );

    /**
     * Lưu bảng điểm
     */
    const { mutate: saveGradeTable, isPending: isPendingSaveGradeTable } =
      $api.useMutation("patch", "/course-registrations/save-grades");

    return {
      selectedSemesterId,
      setselectedSemesterId,
      dataMonHocs,
      isMonHocsLoading,
      classSubjects,
      isClassSubjectsLoading,
      dataGiaoViens,
      isGiaoViensLoading,
      updateClassSubject,
      isPendingUpdateClassSubject,
      refetchClassSubjects,
      classSubject,
      isClassSubjectLoading,
      refetchClassSubject,
      saveGradeTable,
      isPendingSaveGradeTable,
    };
  },
);
