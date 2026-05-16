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

      // state
      isOpenModalAddStudent,
      setIsOpenModalAddStudent,
    };
  });
