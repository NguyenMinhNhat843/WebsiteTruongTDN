import HocKyTable from './TableHocKy'
import { useHocKyContext } from './HocKyProvider'
import PageShell from '../../../components/ui/PageShell'
import { GraduationCap, PlusIcon } from 'lucide-react'
import { CreateHocKyModal } from './CreateHocKyModal'
import { toast } from 'sonner'
import ButtonAction from '../../../components/ui/ButtonAction'

const HocKyList = () => {
  const {
    hocKyList,
    isHocKyListPending,
    setIsOpenModalCreate,
    createhocKy,
    isCreateHocKyPending,
    isCreateHocKyError,
  } = useHocKyContext()
  return (
    <PageShell
      title="Danh sách học kỳ"
      icon={GraduationCap}
      renderRight={
        <ButtonAction
          label="Mở học kỳ mới"
          icon={<PlusIcon size={16} />}
          onClick={() => setIsOpenModalCreate(true)}
        />
      }
    >
      <HocKyTable hocKyList={hocKyList || []} isHocKyListPending={isHocKyListPending} />

      <CreateHocKyModal
        isOpen={useHocKyContext().isOpenModalCreate}
        onClose={() => setIsOpenModalCreate(false)}
        createHocKy={(data) =>
          createhocKy(
            {
              body: data,
            },
            {
              onSuccess: () => {
                toast.success('Tạo học kỳ thành công!')
                window.location.reload()
              },
              onError: () => {
                toast.error('Có lỗi xảy ra khi tạo học kỳ. Vui lòng thử lại.')
              },
            },
          )
        }
        isCreateHocKyPending={isCreateHocKyPending}
        isCreateHocKyError={isCreateHocKyError}
      />
    </PageShell>
  )
}

export default HocKyList
