import React, { useState } from 'react'
import {
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  XCircle,
  Percent,
} from 'lucide-react'
import { $api } from '../../../api/client'
import type { ManagementPositionDto } from '../../../api/entity'

// Giả định $api đã được khởi tạo bằng openapi-react-query
// import { $api } from '@/api/client'

export default function TabManagerPosition() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ManagementPositionDto | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Search Filter State
  const [searchParams, setSearchParams] = useState({
    code: undefined as string | undefined,
    name: undefined as string | undefined,
    isActive: undefined as boolean | undefined,
  })

  // Form State (Khởi tạo default giá trị cho Create / Update)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    priority: 1,
    reductionPercent: 0,
    isActive: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // ==========================================
  // 1. FETCH DANH SÁCH (GET /management-positions)
  // ==========================================
  const {
    data: positions,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = $api.useQuery('get', '/management-positions', {
    params: {
      query: searchParams,
    },
  })

  // ==========================================
  // 2. THÊM MỚI (POST /management-positions)
  // ==========================================
  const createMutation = $api.useMutation('post', '/management-positions', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  // ==========================================
  // 3. CẬP NHẬT (PATCH /management-positions/{id})
  // ==========================================
  const updateMutation = $api.useMutation('patch', '/management-positions/{id}', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  // ==========================================
  // 4. XÓA (DELETE /management-positions/{id})
  // ==========================================
  const deleteMutation = $api.useMutation('delete', '/management-positions/{id}', {
    onSuccess: () => {
      setDeleteConfirmId(null)
      refetch()
    },
  })

  // --- HANDLERS ---
  const handleOpenModal = (item?: ManagementPositionDto) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        code: item.code,
        name: item.name,
        priority: item.priority ?? 1,
        reductionPercent: item.reductionPercent ?? 0,
        isActive: item.isActive ?? true,
      })
    } else {
      setEditingItem(null)
      setFormData({
        code: '',
        name: '',
        priority: 1,
        reductionPercent: 0,
        isActive: true,
      })
    }
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormErrors({})
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.code?.trim()) errors.code = 'Vui lòng nhập mã chức vụ'
    if (!formData.name?.trim()) errors.name = 'Vui lòng nhập tên chức vụ'
    if (formData.priority === undefined || formData.priority < 0) errors.priority = 'Độ ưu tiên không hợp lệ'
    if (
      formData.reductionPercent === undefined ||
      formData.reductionPercent < 0 ||
      formData.reductionPercent > 100
    ) {
      errors.reductionPercent = 'Phần trăm giảm trừ phải từ 0% đến 100%'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingItem) {
      updateMutation.mutate({
        params: { path: { id: editingItem.id } },
        body: formData,
      })
    } else {
      createMutation.mutate({
        body: formData,
      })
    }
  }

  const handleResetSearch = () => {
    setSearchParams({
      code: undefined,
      name: undefined,
      isActive: undefined,
    })
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate({
      params: { path: { id } },
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Briefcase className="h-6 w-6 text-blue-600" />
            Danh Mục Chức Vụ Quản Lý
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý các chức danh kiêm nhiệm và tỷ lệ % giảm trừ giờ dạy
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4" />
          Thêm chức vụ
        </button>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Tìm theo mã..."
          value={searchParams.code || ''}
          onChange={(e) => setSearchParams((prev) => ({ ...prev, code: e.target.value || undefined }))}
          className="min-w-[150px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={searchParams.name || ''}
          onChange={(e) => setSearchParams((prev) => ({ ...prev, name: e.target.value || undefined }))}
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={searchParams.isActive === undefined ? '' : String(searchParams.isActive)}
          onChange={(e) =>
            setSearchParams((prev) => ({
              ...prev,
              isActive: e.target.value === '' ? undefined : e.target.value === 'true',
            }))
          }
          className="min-w-[150px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Trạng thái --</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Ngưng hoạt động</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetSearch}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </button>
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isFetching && !isLoading && (
          <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden bg-blue-100">
            <div className="h-full w-full animate-pulse bg-blue-600"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <th className="px-4 py-3.5">Mã</th>
                <th className="px-4 py-3.5">Tên chức vụ</th>
                <th className="px-4 py-3.5 text-center">Độ ưu tiên</th>
                <th className="px-4 py-3.5">Tỷ lệ giảm trừ</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-rose-500">
                    <AlertCircle className="mx-auto mb-2 h-6 w-6" />
                    {'Không thể tải dữ liệu!'}
                  </td>
                </tr>
              ) : !positions || positions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có chức vụ quản lý nào.
                  </td>
                </tr>
              ) : (
                positions.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs">{item.code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        <Percent className="h-3 w-3" />
                        {item.reductionPercent}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          <XCircle className="h-3 w-3" />
                          Khóa
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? 'Cập nhật chức vụ' : 'Thêm mới chức vụ'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                  Mã chức vụ *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: TK"
                />
                {formErrors.code && <p className="mt-1 text-xs text-rose-500">{formErrors.code}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                  Tên chức vụ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: Trưởng khoa"
                />
                {formErrors.name && <p className="mt-1 text-xs text-rose-500">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                    Độ ưu tiên *
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formErrors.priority && <p className="mt-1 text-xs text-rose-500">{formErrors.priority}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                    % Giảm trừ *
                  </label>
                  <input
                    type="number"
                    value={formData.reductionPercent}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reductionPercent: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0 - 100"
                  />
                  {formErrors.reductionPercent && (
                    <p className="mt-1 text-xs text-rose-500">{formErrors.reductionPercent}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="cursor-pointer text-sm font-medium text-slate-700 select-none"
                >
                  Kích hoạt (Cho phép sử dụng)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG XÁC NHẬN XÓA */}
      {deleteConfirmId && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800">Xác nhận xóa</h4>
              <p className="mt-1 text-sm text-slate-500">
                Bạn có chắc chắn muốn xóa chức vụ quản lý này không?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
