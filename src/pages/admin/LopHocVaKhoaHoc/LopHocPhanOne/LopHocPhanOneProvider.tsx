import { useParams } from "react-router-dom";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { useState } from "react";

export type LopHocPhanDetailType =
  components["schemas"]["CourseOfferDetailResponseDto"];
export type RegistrationCourseOffer =
  components["schemas"]["CreateCourseRegistrationDto"];
export type StudentData = components["schemas"]["StudentResponseDto"];
export type SubmitGradeInClass =
  components["schemas"]["CreateManyGradeEntriesDto"];
export type GradeEntryRequestDto = components["schemas"]["CreateGradeEntryDto"];
export type GradeEntry = components["schemas"]["GradeEntryResponseDto"];
export type SubmissionHistoryResponse =
  components["schemas"]["SubmissionHistoryResponse"];

export const [LopHocPhanOneProvider, useLopHocPhanOneContext] =
  createContextProvider(() => {
    const { id } = useParams();
    const lopHocPhanId = Number(id);
    const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);

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

    // Gửi duyệt điểm
    const { mutate: submitGrades, isPending: isSubmittingGrades } =
      $api.useMutation("post", "/grade-entries/submit-grade");

    /**
     * Load danh sách các submit
     */
    const { data: submissionHistory, isLoading: isLoadingSubmissionHistory } =
      $api.useQuery(
        "get",
        "/grade-entries/submission-history",
        {
          params: {
            query: {
              courseOfferId: lopHocPhanId!,
            },
          },
        },
        {
          enabled: !!lopHocPhanId,
        },
      );

    /**
     * Duyệt điểm
     */
    const { mutate: approveGrade, isPending: isApprovingGrade } =
      $api.useMutation("post", "/grade-entries/submit-grade");

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
            onSuccess: () => {
              alert(
                "Điểm đã được nộp phê duyệt thành công. Vui lòng chờ giảng viên duyệt điểm.",
              );
            },
            onError: () => {
              alert("Có lỗi xảy ra khi nộp điểm. Vui lòng thử lại sau.");
            },
          },
        );
      },
      isSubmittingGrades,
      students,
      submissionHistory,
      isLoadingSubmissionHistory,
      approveGrade,
      isApprovingGrade,

      // state
      isOpenModalAddStudent,
      setIsOpenModalAddStudent,
    };
  });
