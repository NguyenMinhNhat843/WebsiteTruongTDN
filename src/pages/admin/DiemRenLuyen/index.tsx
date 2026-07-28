import { useState } from 'react'
import { Plus, Calendar, Shield, ShieldAlert, Loader2, FileText, ArrowUpRight, Trash2 } from 'lucide-react'
import { $api } from '../../../api/client'
import CreateDotDanhGia from './Create/CreateDotDanhGia'
import DetailDotDanhGiaModal from './One/DetailDotDanhGiaModal'
import { toast } from 'sonner'
import PageShell from '../../../components/ui/PageShell'
import ButtonAction from '../../../components/ui/ButtonAction'

const DiemRenLuyenIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null)

  // Lấy dữ liệu danh sách đợt đánh giá
  const { data: periods, isLoading: isLoadingPeriods, refetch } = $api.useQuery('get', '/assessment/periods')

  // Hook Mutation Xóa đợt đánh giá
  const { mutate: deletePeriod, isPending: isDeleting } = $api.useMutation(
    'delete',
    '/assessment/periods/{id}',
    {
      onSuccess: () => {
        toast.success('Xóa đợt đánh giá thành công!')
        refetch()
      },
      onError: () => {
        toast.error('Lỗi kết nối server')
      },
    },
  )

  // Hàm định dạng ngày tháng hiển thị trực quan
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa đợt đánh giá: "${name}" không?\nHành động này sẽ xóa toàn bộ liên kết tiêu chí liên quan.`,
      )
    ) {
      deletePeriod({ params: { path: { id } } })
    }
  }

  return (
    <PageShell
      title="Điểm rèn luyện"
      sub="Quản lý các đợt đánh giá điểm rèn luyện của sinh viên, bao gồm tạo mới, chỉnh sửa và xóa."
      icon={Calendar}
      renderRight={
        <ButtonAction
          label="Tạo đợt đánh giá mới"
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          variant="primary"
        />
      }
    >
      <div className="space-y-6">
        {/* 2. Danh sách dạng Card */}
        {isLoadingPeriods ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Đang tải danh sách đợt đánh giá...</p>
          </div>
        ) : !periods || periods.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-16 text-center">
            <div className="mb-3 rounded-full bg-gray-50 p-3 text-gray-400">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              Hiện chưa có đợt đánh giá nào. Hãy nhấn nút "Tạo đợt đánh giá" để bắt đầu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {periods.map((period) => (
              <div
                key={period.id}
                className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <div>
                  {/* Phần Trạng thái (Badges) */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    {period.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-green-200/60 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-gray-200/60 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        Tạm ẩn
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {period.isFrozen ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                          Đã khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-blue-200/60 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          <Shield className="h-3.5 w-3.5 text-blue-600" />
                          Mở nhập
                        </span>
                      )}

                      {/* Nút xóa nhanh */}
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(period.id, period.name)}
                        className="cursor-pointer rounded border-0 bg-transparent p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-600 disabled:opacity-50"
                        title="Xóa đợt đánh giá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tên đợt đánh giá */}
                  <h3 className="line-clamp-2 min-h-[2.75rem] text-base leading-snug font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {period.name}
                  </h3>
                </div>

                {/* Phần thông tin chân Card & Nút hành động */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    <span>Tạo ngày: {formatDate(period.createdAt)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPeriodId(period.id)}
                    className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent font-medium text-blue-600 transition-colors hover:text-blue-800"
                  >
                    Chi tiết
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Modal tạo mới */}
        <CreateDotDanhGia
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => refetch()}
        />

        {/* 4. Modal Chi tiết & Chỉnh sửa tích hợp */}
        <DetailDotDanhGiaModal
          periodId={selectedPeriodId}
          onClose={() => setSelectedPeriodId(null)}
          onSuccess={() => refetch()}
        />
      </div>
    </PageShell>
  )
}

export default DiemRenLuyenIndex
