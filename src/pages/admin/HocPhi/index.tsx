import { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarPlus,
} from 'lucide-react'
import { $api } from '../../../api/client'
import ModalCreateDotHocPhi from './Create/ModalCreateDotHocPhi'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import ButtonAction from '../../../components/ui/ButtonAction'

const DotHocPhiIndex = () => {
  const navigate = useNavigate()
  // --- State quản lý Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTuitionId, setSelectedTuitionId] = useState<number | undefined>(undefined)

  // 1. Query: Lấy danh sách đợt học phí
  const { data: dotHocPhiList, isLoading, refetch } = $api.useQuery('get', '/tuition-periods')

  // 2. Mutation: Xóa đợt học phí
  const { mutate: deleteDotHocPhi } = $api.useMutation('delete', '/tuition-periods/{id}')

  // --- Xử lý các sự kiện ---
  const handleOpenCreateModal = () => {
    setSelectedTuitionId(undefined) // Reset ID về undefined để nhận diện là Create mode
    setIsModalOpen(true)
  }

  const handleOpenUpdateModal = (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // Ngăn hành vi nhảy trang khi bấm vào nút Sửa
    setSelectedTuitionId(id) // Set ID để nhận diện là Update mode
    setIsModalOpen(true)
  }

  const handleDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation() // Ngăn hành vi nhảy trang khi bấm vào nút Xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa đợt học phí "${name}" không?`)) {
      deleteDotHocPhi(
        {
          params: { path: { id } },
        },
        {
          onSuccess: () => {
            toast.success('Xóa đợt học phí thành công!')
            refetch() // Reload lại danh sách sau khi xóa thành công
          },
          onError: (error) => {
            toast.error('Có lỗi xảy ra khi xóa!')
            console.error(error)
          },
        },
      )
    }
  }

  // Định dạng hiển thị ngày tháng nhanh gọn
  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <PageShell
      title="Quản lý đợt học phí"
      sub="Xem, tạo mới và cấu hình thời gian đóng học phí của các học kỳ."
      icon={CalendarPlus}
      renderRight={
        <ButtonAction
          label="Thêm đợt học phí"
          icon={<Plus size={16} />}
          variant="primary"
          onClick={handleOpenCreateModal}
        />
      }
    >
      <div className="space-y-6">
        {/* --- DANH SÁCH DẠNG CARD --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-24">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Đang tải danh sách đợt học phí...</p>
          </div>
        ) : !dotHocPhiList || dotHocPhiList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="font-medium text-slate-600">Chưa có đợt học phí nào được tạo</p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              Tạo đợt học phí ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dotHocPhiList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`${item.id}`)}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  {/* Badge Trạng thái & Học kỳ */}
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      Kỳ {item.semesterId}
                    </span>

                    {item.isActive ? (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Đang hoạt động</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-rose-200/50 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                        <XCircle className="h-3 w-3 text-rose-600" />
                        <span>Đã khóa</span>
                      </span>
                    )}
                  </div>

                  {/* Tên Đợt học phí */}
                  <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                    {item.name}
                  </h3>

                  {/* Khối Thời gian */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <div>
                        <span className="font-medium text-slate-400">Từ:</span>{' '}
                        <span className="font-semibold text-slate-700">
                          {formatDisplayDate(item.startDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <div>
                        <span className="font-medium text-slate-400">Đến:</span>{' '}
                        <span className="font-semibold text-slate-700">
                          {formatDisplayDate(item.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hàng Thao tác ở đáy Card */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-medium text-blue-600 group-hover:underline">
                    Xem chi tiết ngành →
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleOpenUpdateModal(e, item.id)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id, item.name)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL DÙNG CHUNG (CREATE/UPDATE) --- */}
        <ModalCreateDotHocPhi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tuitionId={selectedTuitionId}
          onSuccess={() => {
            refetch() // Kích hoạt reload lại data khi submit form thành công
          }}
        />
      </div>
    </PageShell>
  )
}

export default DotHocPhiIndex
