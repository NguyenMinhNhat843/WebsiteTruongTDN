import { $api } from '../../../../../api/client'
import { createContextProvider } from '../../../../../util/createContextProvider'

export const [NhapDiemProvider, useNhapDiemContext] = createContextProvider(
  ({ props }: { props: { classSubjectId: number } }) => {
    /**
     * Lưu bảng điểm
     */
    const { mutate: saveGradeTable, isPending: isPendingSaveGradeTable } = $api.useMutation(
      'patch',
      '/grades/save-grades',
    )

    /**
     * Export excel
     */
    const { mutate: exportExcel, isPending: isExportingExcel } = $api.useMutation(
      'post',
      '/class-subject/export-excel',
    )

    /**
     * Lấy bảng điểm của classSubject
     */
    const {
      data: classSubject,
      isLoading: isClassSubjectLoading,
      refetch: refetchClassSubject,
    } = $api.useQuery(
      'get',
      '/class-subject/{id}',
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
    )
    const baseClass = classSubject?.baseClass

    return {
      saveGradeTable,
      isPendingSaveGradeTable,
      exportExcel,
      isExportingExcel,
      classSubject,
      isClassSubjectLoading,
      refetchClassSubject,
      baseClass,
      props,
    }
  },
)
