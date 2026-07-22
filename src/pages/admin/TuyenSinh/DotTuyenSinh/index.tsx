import { useState } from 'react'
import { Search, Plus, Calendar, Layers, Edit3, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { $api } from '../../../../api/client'
import type { paths } from '../../../../api/v1'
import { useDebounce } from '../../../../hooks/useDebounce' // Hook debounce của bạn
import CreateDotTuyenSinhModal from './Create/CreateDotTuyenSinhModal'
import type { AdmissionCampaignDetailDto } from '../../../../api/entity'
import { useNavigate } from 'react-router-dom'

export type QueryAdmissionCampaignDto = paths['/admission-campaigns']['get']['parameters']['query']

// Format ngày tháng hiển thị dạng DD/MM/YYYY
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Badge màu sắc đại diện cho trạng thái
const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { label: string; class: string }> = {
    PLANNING: {
      label: 'Kế hoạch',
      class: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    OPEN: {
      label: 'Đang mở',
      class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    CLOSED: {
      label: 'Đã đóng',
      class: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    COMPLETED: {
      label: 'Hoàn thành',
      class: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  }

  const config = configs[status] || {
    label: status,
    class: 'bg-slate-50 text-slate-600 border-slate-200',
  }

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${config.class}`}>
      {config.label}
    </span>
  )
}

const DotTuyenSinhHome = () => {
  // 1. State bộ lọc & phân trang
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchName = useDebounce(searchInput, 500)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const limit = 9 // Hiển thị 9 card mỗi trang
  const navigate = useNavigate()

  // 2. State quản lý Modal & Chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDetail, setEditingDetail] = useState<AdmissionCampaignDetailDto | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // 3. API Query Danh sách đợt tuyển sinh
  const {
    data: admissionCampaigns,
    isLoading,
    refetch,
  } = $api.useQuery('get', '/admission-campaigns', {
    params: {
      query: {
        name: debouncedSearchName || undefined,
        status: selectedStatus || undefined,
        page,
        limit,
      },
    },
  })

  // 4. API Mutation lấy Detail (Lưu ý: Dùng get method thông qua useMutation)
  const { mutate: getAdmissionCampaignDetail, isPending: isLoadingDetail } = $api.useMutation(
    'get',
    '/admission-campaigns/{id}',
  )

  // 5. API Mutation Xóa đợt tuyển sinh
  const { mutate: deleteAdmissionCampaign, isPending: isDeleting } = $api.useMutation(
    'delete',
    '/admission-campaigns/{id}',
  )

  // Xử lý khi click "Sửa" hoặc Click vào Card -> Gọi API Detail rồi mở Modal
  const handleOpenEdit = (id: number) => {
    getAdmissionCampaignDetail(
      {
        params: { path: { id } },
      },
      {
        onSuccess: (data: AdmissionCampaignDetailDto) => {
          setEditingDetail(data)
          setIsModalOpen(true)
        },
      },
    )
  }

  // Xử lý khi click "Tạo mới"
  const handleOpenCreate = () => {
    setEditingDetail(null)
    setIsModalOpen(true)
  }

  // Xử lý xác nhận Xóa
  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteAdmissionCampaign(
      {
        params: { path: { id: deleteId } },
      },
      {
        onSuccess: () => {
          setDeleteId(null)
          refetch()
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header Trang */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Đợt Tuyển Sinh</h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách các đợt tuyển sinh và thiết lập chỉ tiêu theo từng năm học
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tạo đợt tuyển sinh
        </button>
      </div>

      {/* Thanh bộ lọc (Filter Bar) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row">
        {/* Tìm kiếm tên */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setPage(1)
            }}
            placeholder="Tìm kiếm theo tên đợt tuyển sinh..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>

        {/* Lọc trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PLANNING">Kế hoạch</option>
          <option value="OPEN">Đang mở</option>
          <option value="CLOSED">Đã đóng</option>
          <option value="COMPLETED">Hoàn thành</option>
        </select>
      </div>

      {/* Trạng thái Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-slate-200/60 bg-slate-100" />
          ))}
        </div>
      ) : !admissionCampaigns?.data || admissionCampaigns.data.length === 0 ? (
        /* Trạng thái trống (Empty state) */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mb-3 rounded-2xl bg-slate-50 p-3 text-slate-400">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Không tìm thấy đợt tuyển sinh nào</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Thử thay đổi từ khóa tìm kiếm hoặc tạo thêm đợt tuyển sinh mới.
          </p>
        </div>
      ) : (
        /* Danh sách Card */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {admissionCampaigns.data.map((campaign) => (
            <div
              key={campaign.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="space-y-4 p-5">
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    Năm học: {campaign.academicYear?.code || 'N/A'}
                  </span>
                  <StatusBadge status={campaign.status} />
                </div>

                {/* Tên & Mã đợt */}
                <div>
                  <h3
                    onClick={() => navigate(`/admin/tuyen-sinh/dot-tuyen-sinh/${campaign.id}`)}
                    className="line-clamp-1 cursor-pointer text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600"
                    title={campaign.name}
                  >
                    {campaign.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">Mã: {campaign.code}</p>
                </div>

                {/* Thông tin Thời gian & Chỉ tiêu */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs">
                <button
                  onClick={() => handleOpenEdit(campaign.id)}
                  disabled={isLoadingDetail}
                  className="inline-flex items-center gap-1.5 font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Xem & Chỉnh sửa
                </button>

                <button
                  onClick={() => setDeleteId(campaign.id)}
                  className="inline-flex items-center gap-1.5 font-medium text-slate-400 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang (Pagination) nếu có nhiều trang */}
      {admissionCampaigns?.total && admissionCampaigns.total > limit && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>
            Hiển thị {admissionCampaigns.data?.length || 0} / {admissionCampaigns.total} kết quả
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="font-medium text-slate-700">Trang {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= (admissionCampaigns.total || 0)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Component Modal Thêm mới / Cập nhật */}
      <CreateDotTuyenSinhModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDetail(null)
        }}
        initialData={editingDetail}
        onSuccess={() => {
          refetch()
        }}
      />

      {/* Confirm Delete Popup Modal */}
      {deleteId && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
            <div className="w-fit rounded-full bg-red-50 p-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa đợt tuyển sinh?</h3>
              <p className="mt-1 text-xs text-slate-500">
                Hành động này không thể hoàn tác. Các thiết lập chỉ tiêu thuộc đợt này cũng có thể bị ảnh
                hưởng.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DotTuyenSinhHome
