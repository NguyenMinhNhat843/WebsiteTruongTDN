import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";
import { useHocSinhContext } from "../HocSinhProvider";

export type StudentDocumentResponseDto =
  components["schemas"]["StudentDocumentResponseDto"];
export const [HoSoHocSinhOneProvider, useHoSoHocSinhOneContext] =
  createContextProvider(() => {
    const queryClient = useQueryClient();
    const { studentDetail, isGettingStudentDetail } = useHocSinhContext();
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
    };
  });
