import { $api } from '../../../../../api/client'
import type { ApplicationStatusEnum, DocumentStatusEnum } from '../../../../../api/enum'
import type { components } from '../../../../../api/v1'
import { createContextProvider } from '../../../../../util/createContextProvider'

type AdmissionProfileDetail = components['schemas']['AdmissionProfileDetailDto']
type TranscriptSubjectScore = NonNullable<AdmissionProfileDetail['transcriptSubjectScores']>[number]

export const [HoSoTuyenSinhOneProvider, useHoSoTuyenSinhOneContext] = createContextProvider(
  (initValue: { profileId: number; onClose: () => void }) => {
    const { profileId, onClose } = initValue
    // Query Profile Detail (Response tự động infer kiểu AdmissionProfileDetail)
    const {
      data: profileData,
      isLoading,
      refetch,
    } = $api.useQuery(
      'get',
      '/admission-profiles/{id}',
      {
        params: { path: { id: profileId } },
      },
      { enabled: !!profileId },
    )

    // Trường hợp API trả về trực tiếp object hoặc unwrap qua response wrapper (.data)
    const profile = profileData?.profile
    const transcriptScores = profileData?.transcriptSubjectScores || []
    const admissionCampaign = profileData?.admissionCampaignMajor?.admissionCampaign
    const admissionCampaignMajor = profileData?.admissionCampaignMajor

    // Mutations
    const { mutate: updateStatus, isPending: isUpdatingStatus } = $api.useMutation(
      'patch',
      '/admission-profiles/{id}/status',
      {
        onSuccess: () => {
          refetch()
        },
      },
    )

    const { mutate: verifyDoc, isPending: isVerifyingDoc } = $api.useMutation(
      'patch',
      '/admission-documents/{id}/verify',
      {
        onSuccess: () => {
          refetch()
        },
      },
    )

    const handleStatusChange = (status: ApplicationStatusEnum) => {
      updateStatus({
        params: { path: { id: profileId } },
        body: { status: status },
      })
    }

    const handleVerifyDocument = (docId: number, status: DocumentStatusEnum, reason?: string) => {
      verifyDoc({
        params: { path: { id: docId } },
        body: { status: status, rejectionReason: reason },
      })
    }

    // Nhóm điểm học bạ theo lớp (gradeLevel)
    const groupedTranscriptScores = (transcriptScores || []).reduce(
      (acc, item) => {
        if (!acc[item.gradeLevel]) acc[item.gradeLevel] = []
        acc[item.gradeLevel].push(item)
        return acc
      },
      {} as Record<number, TranscriptSubjectScore[]>,
    )

    return {
      profileData,
      isLoading,
      refetch,
      handleStatusChange,
      handleVerifyDocument,
      profile,
      transcriptScores,
      admissionCampaign,
      admissionCampaignMajor,
      isUpdatingStatus,
      isVerifyingDoc,
      onClose,
      groupedTranscriptScores,
    }
  },
)
