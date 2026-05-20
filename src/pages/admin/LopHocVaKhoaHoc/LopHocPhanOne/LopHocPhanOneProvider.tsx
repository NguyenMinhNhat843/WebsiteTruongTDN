import { useParams } from "react-router-dom";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { downloadFromBlob } from "../../../../util/download";

export type LopHocPhanDetailType =
  components["schemas"]["CourseOfferDetailResponseDto"];
export type RegistrationCourseOffer =
  components["schemas"]["CreateCourseRegistrationDto"];
export type StudentData = components["schemas"]["StudentResponseDto"];
export type SubmitGradeInClass =
  components["schemas"]["CreateManyGradeEntriesDto"];
export type GradeEntryRequestDto = components["schemas"]["CreateGradeEntryDto"];
export type GradeEntry = components["schemas"]["GradeEntryResponseDto"];
export type GradeStatus = GradeEntry["status"];

export const [LopHocPhanOneProvider, useLopHocPhanOneContext] =
  createContextProvider(() => {
    const { id } = useParams();
    const lopHocPhanId = Number(id);
    const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);
    const [isOpenModalImportExcel, setIsOpenModalImportExcel] = useState(false);
    const queryClient = useQueryClient();

    // Get chi tiết lớp học phần
    const { data: lopHocPhanDetail, isLoading: isLoadingLopHocPhanDetail } =
      $api.useQuery(
        "get",
        "/course-offers/{id}",
        {
          params: {
            path: {
              id: lopHocPhanId!, // Lấy ID của lớp học phần đầu tiên làm ví dụ
            },
          },
        },
        {
          enabled: !!lopHocPhanId, // Chỉ chạy query khi có ID lớp học phần được chọn
        },
      );
    const registration = lopHocPhanDetail?.registrations;
    const students = registration?.map((regis) => regis.student) || [];

    // Chấp nhận mở lớp học phần
    const { mutate: acceptLopHocPhan, isPending: isAcceptingLopHocPhan } =
      $api.useMutation("patch", "/course-offers/{id}/approve");

    // Thêm học sinh vào lớp học phần
    const {
      mutate: addStudentToLopHocPhan,
      isPending: isAddingStudentToLopHocPhan,
    } = $api.useMutation("post", "/course-registrations");

    // Get học sinh đủ điều kiện thêm vào lớp học phần
    const { data: eligibleStudents, isLoading: isLoadingEligibleStudents } =
      $api.useQuery(
        "get",
        "/course-offers/{courseOfferId}/eligible-students",
        {
          params: {
            path: {
              courseOfferId: lopHocPhanId!,
            },
          },
        },
        {
          enabled: !!lopHocPhanId, // Chỉ chạy query khi có ID lớp học phần được chọn
        },
      );
    const eligibleStudentsData: StudentData[] = eligibleStudents || [];

    /**
     * Lưu nháp
     */
    const { mutate: submitGrades, isPending: isSubmittingGrades } =
      $api.useMutation("post", "/grade-entries/submit-grade", {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/course-offers/{id}",
              { params: { path: { id: lopHocPhanId } } },
            ],
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          alert(
            error?.message ||
              "Có lỗi xảy ra khi nộp điểm. Vui lòng thử lại sau.",
          );
        },
      });

    /**
     * Chốt bảng điểm
     */
    const { mutate: approveGrade, isPending: isApprovingGrade } =
      $api.useMutation("post", "/grade-entries/save-grade", {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/course-offers/{id}",
              { params: { path: { id: lopHocPhanId } } },
            ],
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          alert(
            error?.message ||
              "Có lỗi xảy ra khi phê duyệt điểm. Vui lòng thử lại sau.",
          );
        },
      });

    /**
     * Xuất file excel
     */
    const { mutate: exportExcel, isPending: isExportingExcel } =
      $api.useMutation("get", "/course-offers/{id}/export-excel", {
        onSuccess: (blob) => {
          downloadFromBlob(
            blob as never,
            lopHocPhanDetail?.courseCode || `lop-hoc-phan-${lopHocPhanId}`,
            ".xlsx",
          );
        },
      });

    return {
      lopHocPhanDetail,
      isLoadingLopHocPhanDetail,
      lopHocPhanId,
      acceptLopHocPhan,
      isAcceptingLopHocPhan,
      addStudentToLopHocPhan,
      isAddingStudentToLopHocPhan,
      eligibleStudentsData,
      isLoadingEligibleStudents,
      submitGrades: (dto: SubmitGradeInClass) => {
        submitGrades(
          {
            body: dto,
          },
          {
            onSuccess: (response) => {
              alert(JSON.stringify(response) || "Lưu nháp thành công");
            },
          },
        );
      },
      isSubmittingGrades,
      students,
      approveGrade,
      isApprovingGrade,
      exportExcel,
      isExportingExcel,

      // state
      isOpenModalAddStudent,
      setIsOpenModalAddStudent,
      isOpenModalImportExcel,
      setIsOpenModalImportExcel,
    };
  });
