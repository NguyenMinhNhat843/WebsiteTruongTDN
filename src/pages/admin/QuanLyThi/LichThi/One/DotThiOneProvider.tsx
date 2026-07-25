import { toast } from 'sonner'
import { $api } from '../../../../../api/client'
import { createContextProvider } from '../../../../../util/createContextProvider'
import type { components } from '../../../../../api/v1'

export type UpdateBulkExamScoreDto = components['schemas']['UpdateBulkExamScoreDto']

export const [DotThiOneProvider, useDotThiOneContext] = createContextProvider(
  (initValue: { examScheduleId: number | null; isOpen: boolean; onClose: () => void }) => {
    const { examScheduleId, isOpen, onClose } = initValue
    // API lấy detail đợt thi
    const { data: dotThiDetail, isLoading } = $api.useQuery(
      'get',
      '/exam-schedules/{id}',
      {
        params: {
          path: {
            id: examScheduleId as number,
          },
        },
      },
      {
        enabled: isOpen && !!examScheduleId,
      },
    )

    // API Nhập điểm thi
    const { mutate: updateScores, isPending: isUpdatingScores } = $api.useMutation(
      'patch',
      '/student-exam-details/scores',
    )
    const handleUpdateScores = (scores: UpdateBulkExamScoreDto) => {
      updateScores(
        {
          body: scores,
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật điểm thi thành công')
          },
          onError: () => {
            toast.error('Cập nhật điểm thi thất bại')
          },
        },
      )
    }

    // Lấy toàn bộ danh sách học sinh của classSubject này và đánh dấu thí sinh nào ko đc thi
    const { data: studentsForExam, isLoading: isLoadingStudents } = $api.useQuery(
      'get',
      '/students/class-subject/{classSubjectId}/for-exam',
      {
        params: {
          path: {
            classSubjectId: dotThiDetail?.classSubjectId as number,
          },
        },
      },
      {
        enabled: isOpen && !!dotThiDetail?.classSubjectId,
      },
    )

    return {
      dotThiDetail,
      isLoading,
      examScheduleId,
      isOpen,
      onClose,
      handleUpdateScores,
      isUpdatingScores,
      studentsForExam,
      isLoadingStudents,
    }
  },
)
