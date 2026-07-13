import { $api } from "../../../../../api/client";
import { createContextProvider } from "../../../../../util/createContextProvider";
import type { LopHocResponseDto } from "../../LopHocProvider";

export const [NhapDiemProvider, useNhapDiemContext] = createContextProvider(
  ({
    props,
  }: {
    props: { classSubjectId: number; lopHocDetail: LopHocResponseDto };
  }) => {
    /**
     * Lưu bảng điểm
     */
    const { mutate: saveGradeTable, isPending: isPendingSaveGradeTable } =
      $api.useMutation("patch", "/grades/save-grades");

    /**
     * Export excel
     */
    const { mutate: exportExcel, isPending: isExportingExcel } =
      $api.useMutation("post", "/course-offers/export-excel");

    /**
     * Lấy bảng điểm của classSubject
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
            id: props.classSubjectId,
          },
        },
      },
      {
        enabled: !!props.classSubjectId,
      },
    );

    return {
      saveGradeTable,
      isPendingSaveGradeTable,
      exportExcel,
      isExportingExcel,
      classSubject,
      isClassSubjectLoading,
      refetchClassSubject,
      props,
      lopHocDetail: props.lopHocDetail,
    };
  },
);
