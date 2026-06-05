import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";
import { useHocSinhContext } from "../HocSinhProvider";

export type StudentDocumentResponseDto =
  components["schemas"]["StudentDocumentResponseDto"];

export const [HoSoHocSinhOneProvider, useHoSoHocSinhOneContext] =
  createContextProvider(() => {
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
     * Xử lý data hiển thị hồ sơ học sinh
     */
    const hoSoMap = new Map(
      hoSoHocSinh?.map((hs) => [hs.documentConfigItemId, hs]) || [],
    );

    const dataHoSoHocSinh =
      configHoSoNhapHoc?.items?.map((item) => {
        const fileData = hoSoMap.get(item.id);

        return {
          documentConfigItemId: item.id,
          name: item.name,
          data: fileData || null,
          isUploaded: !!fileData,
        };
      }) || [];

    /**
     * Upload File hố sơ học sinh
     */
    const {
      mutate: createStudentDocument,
      isPending: isCreatingStudentDocument,
    } = $api.useMutation("post", "/student-documents");

    return {
      hoSoNhapHoc: configHoSoNhapHoc,
      isLoadingHoSoNhapHoc: isLoadingConfigHoSoNhapHoc,
      hoSoNhapHocItems,
      hoSoHocSinh,
      isLoadingHoSoHocSinh,
      dataHoSoHocSinh,
      createStudentDocument,
      isCreatingStudentDocument,
    };
  });
