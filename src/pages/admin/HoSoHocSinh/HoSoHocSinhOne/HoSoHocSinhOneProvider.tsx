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
              studentId: 1,
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
          name: item.name,
          data: fileData || null,
          isUploaded: !!fileData,
        };
      }) || [];

    return {
      hoSoNhapHoc: configHoSoNhapHoc,
      isLoadingHoSoNhapHoc: isLoadingConfigHoSoNhapHoc,
      hoSoNhapHocItems,
      hoSoHocSinh,
      isLoadingHoSoHocSinh,
      dataHoSoHocSinh,
    };
  });
