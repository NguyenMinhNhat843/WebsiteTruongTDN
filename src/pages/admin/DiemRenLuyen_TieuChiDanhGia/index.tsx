import { useState } from 'react'
import { Plus, Award, Loader2, RefreshCw, Trash2, Edit2, X, ClipboardCheck } from 'lucide-react'
import { $api } from '../../../api/client'
import CreateTieuChiChamDiem from './CreateTieuChiChamDiem'
import PageShell from '../../../components/ui/PageShell' // Đường dẫn thực tế tới component PageShell của bạn
import { toast } from 'sonner'
import ButtonAction from '../../../components/ui/ButtonAction'

export type UpdateCriterionDto = {
  maxScore: number
  sortOrder: number
  title: string
}

const DiemRenLuyen_TieuChiDanhGiaIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // State quản lý tiêu chí đang được chọn để chỉnh sửa (nếu null nghĩa là modal đang đóng)
  const [editingItem, setEditingItem] = useState<{
    id: number
    title: string
    maxScore: number
    sortOrder: number
  } | null>(null)

  // Lấy dữ liệu danh sách tiêu chí từ API
  const { data: tieuChiDanhGia, isLoading, refetch } = $api.useQuery('get', '/assessment/criteria')

  // Hàm định dạng ngày tháng hiển thị gọn gàng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // API Xóa
  const { mutate: deleteTieuChiChamDiem, isPending: isDeleting } = $api.useMutation(
    'delete',
    '/assessment/criteria/{id}',
    {
      onSuccess: () => {
        toast.success('Xóa tiêu chí thành công!')
        refetch()
      },
      onError: () => {
        toast.error('Xóa thất bại')
      },
    },
  )

  // API Sửa
  const { mutate: updateTieuChiChamDiem, isPending: isUpdating } = $api.useMutation(
    'patch',
    '/assessment/criteria/{id}',
    {
      onSuccess: () => {
        toast.success('Cập nhật tiêu chí thành công!')
        setEditingItem(null)
        refetch()
      },
      onError: () => {
        toast.error('Cập nhật thất bại')
      },
    },
  )

  // Xử lý khi nhấn nút Xóa
  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiêu chí: "${title}" không?`)) {
      deleteTieuChiChamDiem({ params: { path: { id } } })
    }
  }

  // Xử lý khi Submit form chỉnh sửa
  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingItem) return

    const formData = new FormData(e.currentTarget)
    const body: UpdateCriterionDto = {
      title: formData.get('title') as string,
      maxScore: Number(formData.get('maxScore')),
      sortOrder: Number(formData.get('sortOrder')),
    }

    updateTieuChiChamDiem({
      params: { path: { id: editingItem.id } },
      body: body,
    })
  }

  return (
    <PageShell
      title="Thang điểm & Tiêu chí đánh giá"
      sub="Cấu hình danh mục các tiêu chí chấm điểm rèn luyện, điểm tối đa và thứ tự hiển thị của từng mục."
      icon={ClipboardCheck}
      isLoading={isLoading}
      renderRight={
        <ButtonAction label="Tạo tiêu chí" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)} />
      }
    >
      {/* 1. KHÔNG CÓ DỮ LIỆU */}
      {!tieuChiDanhGia || tieuChiDanhGia.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-16 text-center">
          <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-500">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Chưa có tiêu chí nào được tạo</h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
            Hệ thống chưa ghi nhận tiêu chí chấm điểm rèn luyện nào. Hãy bắt đầu bằng cách bấm nút "Tạo tiêu
            chí".
          </p>
        </div>
      ) : (
        /* 2. BẢNG DỮ LIỆU CHUẨN XANH DƯƠNG */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-blue-50/50 text-xs font-bold tracking-wider text-blue-900/80 uppercase">
                  <th className="w-20 px-6 py-4 text-center">STT</th>
                  <th className="px-6 py-4">Nội dung tiêu chí đánh giá</th>
                  <th className="w-32 px-6 py-4 text-center">Điểm tối đa</th>
                  <th className="w-40 px-6 py-4">Ngày cấu hình</th>
                  <th className="w-36 px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {tieuChiDanhGia.map((item, index) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/40">
                    {/* Số thứ tự hiển thị chuẩn theo chỉ mục index */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex min-w-[26px] items-center justify-center rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                        {index + 1}
                      </span>
                    </td>

                    {/* Tiêu đề / Nội dung tiêu chí */}
                    <td className="max-w-md px-6 py-4 font-semibold text-slate-900">
                      <div className="line-clamp-2 leading-relaxed whitespace-pre-wrap transition-all duration-300 hover:line-clamp-none">
                        {item.title}
                      </div>
                    </td>

                    {/* Điểm tối đa (maxScore) */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-1 font-bold text-blue-700">
                        {item.maxScore} đ
                      </span>
                    </td>

                    {/* Ngày tạo hoặc cập nhật gần nhất */}
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-500">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>

                    {/* Thao tác Sửa / Xóa */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* NÚT SỬA */}
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() =>
                            setEditingItem({
                              id: item.id,
                              title: item.title,
                              maxScore: item.maxScore,
                              sortOrder: item.sortOrder || 0,
                            })
                          }
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-800 active:scale-90"
                        >
                          <Edit2 className="h-4 w-4 stroke-[2.2]" />
                        </button>

                        {/* NÚT XÓA */}
                        <button
                          type="button"
                          title="Xóa tiêu chí"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id, item.title)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-800 active:scale-90 disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4 stroke-[2.2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer nhỏ thống kê */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 text-xs font-medium text-slate-500">
            <span>
              Tổng cộng: <strong className="text-slate-800">{tieuChiDanhGia.length}</strong> tiêu chí đánh giá
            </span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 font-bold transition-colors hover:text-blue-600"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Làm mới dữ liệu
            </button>
          </div>
        </div>
      )}

      {/* 3. Gọi Modal tạo tiêu chí */}
      <CreateTieuChiChamDiem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch()
        }}
      />

      {/* 4. Modal cập nhật tiêu chí (Tông màu xanh dương đồng bộ) */}
      {editingItem && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Cập nhật tiêu chí đánh giá</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Nội dung tiêu chí
                </label>
                <textarea
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Điểm tối đa
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    required
                    min={0}
                    defaultValue={editingItem.maxScore}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Thứ tự sắp xếp
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    required
                    min={0}
                    defaultValue={editingItem.sortOrder}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  )
}

export default DiemRenLuyen_TieuChiDanhGiaIndex
