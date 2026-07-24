import { useParams } from 'react-router-dom'
import NhapDiem from './NhapDiemTable'
import { LoadingWrapper } from '../../../../../components/ui/LoadingWrapper'
import Breadcrumb from '../../../../../components/ui/Breadcrum'
import { NhapDiemProvider, useNhapDiemContext } from './NhapDiemProvider'

export const NhapDiemPage = () => {
  const { idClassSubject } = useParams<{ idClassSubject: string }>()
  const idNumber = idClassSubject ? Number(idClassSubject) : 0
  return (
    <NhapDiemProvider props={{ classSubjectId: idNumber }}>
      <Inner />
    </NhapDiemProvider>
  )
}

const Inner = () => {
  const { baseClass, isClassSubjectLoading } = useNhapDiemContext()
  const { idClassSubject } = useParams<{ idClassSubject: string }>()
  const idNumber = idClassSubject ? Number(idClassSubject) : 0

  if (isClassSubjectLoading) {
    return (
      <div className="relative min-h-100 w-full">
        <LoadingWrapper isLoading={true} message="Đang tải thông tin lớp học...">
          <div className="h-100 w-full rounded-lg bg-slate-50/50" />
        </LoadingWrapper>
      </div>
    )
  }

  if (!idNumber || !baseClass) {
    return (
      <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-500">
        ⚠️ Thiếu thông tin lớp học hoặc idClassSubject trong query params
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full">
      <Breadcrumb
        items={[
          {
            label: 'Danh sách lớp học',
            link: '/admin/dao-tao/lop-hoc',
          },
          {
            label: `Lớp ${baseClass?.className}`,
            link: `/admin/dao-tao/lop-hoc/${baseClass?.id}`,
          },
          {
            label: 'Nhập điểm',
          },
        ]}
        className="px-6 pt-6"
      />
      <NhapDiem />
    </div>
  )
}

export default NhapDiemPage
