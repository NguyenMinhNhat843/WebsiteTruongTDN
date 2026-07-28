import { BookOpen, PlusIcon } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { MonHocProvider, useMonHocContext } from './MonHocProvider'
import CreateMonHocModal from './CreateMonHoc'
import UpdateMonHoc from './UpdateMonHoc'
import MonHocList from './MonHocList'
import ButtonAction from '../../../components/ui/ButtonAction'

const MonHocIndex = () => {
  return (
    <MonHocProvider>
      <Inner />
    </MonHocProvider>
  )
}

const Inner = () => {
  const {
    isOpenModalCreateMonHoc,
    setIsOpenModalCreateMonHoc,
    createMonHoc,
    isCreateMonHocPending,
    monHocIdSelected,
    setMonHocIdSelected,
  } = useMonHocContext()
  return (
    <PageShell
      title="Môn học"
      sub="Quản lý thông tin môn học"
      icon={BookOpen}
      renderRight={
        <ButtonAction
          label="Thêm môn học"
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsOpenModalCreateMonHoc(true)}
        />
      }
    >
      <MonHocList />

      <CreateMonHocModal
        isOpen={isOpenModalCreateMonHoc}
        onClose={() => setIsOpenModalCreateMonHoc(false)}
        onSubmit={(data, reset) => {
          createMonHoc(
            {
              body: data,
            },
            {
              onSuccess: () => {
                reset()
                setIsOpenModalCreateMonHoc(false)
              },
              /* eslint-disable @typescript-eslint/no-explicit-any */
              onError: (err: any) => {
                alert(err.message || 'Tạo môn học thất bại!')
              },
            },
          )
        }}
        isPending={isCreateMonHocPending}
      />

      <UpdateMonHoc idSelected={monHocIdSelected} onClose={() => setMonHocIdSelected(null)} />
    </PageShell>
  )
}

export default MonHocIndex
