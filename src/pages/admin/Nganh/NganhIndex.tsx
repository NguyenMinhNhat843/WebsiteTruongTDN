import { Edit, PlusIcon, Trash2 } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { NganhProvider, useNganhContext } from './NganhProvider'
import CreateNganhModal from './CreateNganhHoc'
import NganhHocList from './NganhHocList'
import { toast } from 'sonner'

const NganhIndex = () => {
  return (
    <NganhProvider>
      <Inner />
    </NganhProvider>
  )
}

const Inner = () => {
  const { isOpenModalCreate, setIsOpenModalCreate, isPendingCreateNganh, createNganh, nganhs, deleteNganh } =
    useNganhContext()

  return (
    <PageShell
      title="Quản lý ngành học"
      sub="Trang quản lý các ngành học trong hệ thống"
      renderRight={
        <button
          className="flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:from-purple-700 hover:to-indigo-700 hover:shadow active:scale-98"
          onClick={() => setIsOpenModalCreate(true)}
        >
          <PlusIcon className="h-4 w-4" />
          Thêm ngành học
        </button>
      }
    >
      {/* Card List Instead of Table */}
      <NganhHocList
        data={nganhs || []}
        renderActions={(data) => (
          <div className="flex gap-1.5">
            <button
              className="rounded-lg border border-transparent p-1.5 text-gray-500 transition-colors hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600"
              title="Chỉnh sửa"
            >
              <Edit size={16} />
            </button>
            <button
              className="rounded-lg border border-transparent p-1.5 text-gray-500 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
              title="Xóa"
              onClick={() =>
                deleteNganh({
                  params: {
                    path: {
                      id: data.id,
                    },
                  },
                })
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {/* Create Modal */}
      <CreateNganhModal
        onClose={() => setIsOpenModalCreate(false)}
        isOpen={isOpenModalCreate}
        isPending={isPendingCreateNganh}
        onSubmit={(data, reset) => {
          createNganh(
            {
              body: { ...data },
            },
            {
              onSuccess: () => {
                toast.success('Tạo ngành học thành công!')
                reset()
                setIsOpenModalCreate(false)
              },
              onError: () => {
                toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
              },
            },
          )
        }}
      />
    </PageShell>
  )
}

export default NganhIndex
