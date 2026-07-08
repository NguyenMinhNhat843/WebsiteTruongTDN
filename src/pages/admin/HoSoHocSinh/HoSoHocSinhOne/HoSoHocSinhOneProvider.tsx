import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";
import { useHocSinhContext } from "../HocSinhProvider";
import { useEffect, useState } from "react";

export type StudentDocumentResponseDto =
  components["schemas"]["StudentDocumentResponseDto"];
export type UpdateStudentDto = components["schemas"]["UpdateStudentDto"];

export const [HoSoHocSinhOneProvider, useHoSoHocSinhOneContext] =
  createContextProvider(() => {
    const queryClient = useQueryClient();
    const { studentDetail, isGettingStudentDetail } = useHocSinhContext();

    // Tính năng Update
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<UpdateStudentDto>({});
    // Đồng bộ data từ context hệ thống vào form local khi vào mode sửa
    const {
      id,
      createdAt,
      updatedAt,
      graduationDate,
      enrollmentDate,
      documentProgress,
      class: classData,
      batch,
      ...studentDataForUpdate
    } = studentDetail ?? {};

    const { mutate: updateStudent, isPending: isUpdatingStudent } =
      $api.useMutation("patch", "/students/{id}", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/students"] });
          queryClient.invalidateQueries({
            queryKey: ["get", "/students/search-by-code"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "/admission-profiles"],
          });
          setIsEditMode(false);
        },
      });

    /**
     * Load cấu hình hồ sơ nhập học
     */
    const { data: configHoSoNhapHoc, isLoading: isLoadingConfigHoSoNhapHoc } =
      $api.useQuery(
        "get",
        "/document-configs/{id}", // Mặc định lấy 1 luôn
        {
          params: {
            path: {
              id: 1,
            },
          },
        },
      );
    const hoSoNhapHocItems = configHoSoNhapHoc?.items || [];

    /**
     * Load hồ sơ của học sinh
     */
    const { data: hoSoHocSinh, isLoading: isLoadingHoSoHocSinh } =
      $api.useQuery(
        "get",
        "/student-documents",
        {
          params: {
            query: {
              studentId: studentDetail?.id,
            },
          },
        },
        {
          enabled: !!studentDetail && !isGettingStudentDetail,
        },
      );

    /**
     * Lấy admissionProfile: gồm điểm và hạnh kiểm 4 năm của sinh viên
     */
    const {
      data: admissionProfileResponse,
      isLoading: isLoadingAdmissionProfile,
    } = $api.useQuery(
      "get",
      "/admission-profiles",
      {
        params: {
          query: {
            studentId: studentDetail?.id,
          },
        },
      },
      {
        enabled: !!studentDetail && !isGettingStudentDetail,
      },
    );
    const admissionProfile = admissionProfileResponse?.items?.[0] || null;

    /**
     * Xử lý data hiển thị hồ sơ học sinh
     */
    const hoSoMap = new Map<number, typeof hoSoHocSinh>();

    hoSoHocSinh?.forEach((hs) => {
      if (!hs.documentConfigItemId) return;

      if (!hoSoMap.has(hs.documentConfigItemId)) {
        hoSoMap.set(hs.documentConfigItemId, []);
      }
      hoSoMap.get(hs.documentConfigItemId)?.push(hs);
    });

    const dataHoSoHocSinh =
      configHoSoNhapHoc?.items?.map((item) => {
        const filesData = hoSoMap.get(item.id) || [];

        return {
          documentConfigItemId: item.id,
          name: item.name,
          data: filesData,
          isUploaded: filesData.length > 0,
        };
      }) || [];

    /**
     * Upload File hố sơ học sinh
     */
    const {
      mutate: createStudentDocument,
      isPending: isCreatingStudentDocument,
    } = $api.useMutation("post", "/student-documents", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/student-documents"],
        });
      },
    });

    useEffect(() => {
      if (studentDetail) {
        setFormData({
          ...studentDataForUpdate,
          // Ép kiểu date sang string định dạng YYYY-MM-DD để dùng cho input type="date"
          dob: studentDetail.dob
            ? new Date(studentDetail.dob).toISOString().split("T")[0]
            : undefined,
          admissionProfile: admissionProfile
            ? {
                gpa6: admissionProfile.gpa6,
                gpa7: admissionProfile.gpa7,
                gpa8: admissionProfile.gpa8,
                gpa9: admissionProfile.gpa9,
                conduct6: admissionProfile.conduct6,
                conduct7: admissionProfile.conduct7,
                conduct8: admissionProfile.conduct8,
                conduct9: admissionProfile.conduct9,
                studentId: studentDetail.id!,
              }
            : {
                gpa6: 0,
                gpa7: 0,
                gpa8: 0,
                gpa9: 0,
                conduct6: "TOT",
                conduct7: "TOT",
                conduct8: "TOT",
                conduct9: "TOT",
                studentId: studentDetail.id!,
              },
        });
      }
    }, [studentDetail, isEditMode, admissionProfile]);

    return {
      hoSoNhapHoc: configHoSoNhapHoc,
      isLoadingHoSoNhapHoc: isLoadingConfigHoSoNhapHoc,
      hoSoNhapHocItems,
      hoSoHocSinh,
      isLoadingHoSoHocSinh,
      dataHoSoHocSinh,
      createStudentDocument,
      isCreatingStudentDocument,
      studentDetail,
      admissionProfile,
      isLoadingAdmissionProfile,

      isEditMode,
      setIsEditMode,
      formData,
      setFormData,
      updateStudent,
      isUpdatingStudent,
    };
  });
