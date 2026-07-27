import React, { useState } from 'react'
import {
  Plus,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Clock,
  BookOpen,
} from 'lucide-react'
import { $api } from '../../../../api/client'
import type { TeachingLevelDto } from '../../../../api/entity'

// Giả định $api đã được khởi tạo bằng openapi-react-query
// import { $api } from '@/api/client'

export default function KhungDinhMucGiangDay() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TeachingLevelDto | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // State Tìm kiếm & Phân trang
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    code: undefined as string | undefined,
    name: undefined as string | undefined,
    academicYearId: undefined as number | undefined,
  })

  // State Form Thêm / Sửa
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    academicYearId: undefined as number | undefined,
    minHours: 0,
    maxHours: 0,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: academicYears } = $api.useQuery('get', '/academic-years')
  const academiCyearOptions =
    academicYears?.data?.map((year) => ({
      value: year.id,
      label: year.code,
    })) || []

  // ==========================================
  // 1. FETCH DANH SÁCH (GET /teaching-levels)
  // ==========================================
  const { data, isLoading, isFetching, isError, refetch } = $api.useQuery('get', '/teaching-levels', {
    params: {
      query: queryParams,
    },
  })

  // ==========================================
  // 2. THÊM MỚI (POST /teaching-levels)
  // ==========================================
  const createMutation = $api.useMutation('post', '/teaching-levels', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  // ==========================================
  // 3. CẬP NHẬT (PATCH /teaching-levels/{id})
  // ==========================================
  const updateMutation = $api.useMutation('patch', '/teaching-levels/{id}', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  // ==========================================
  // 4. XÓA (DELETE /teaching-levels/{id})
  // ==========================================
  const deleteMutation = $api.useMutation('delete', '/teaching-levels/{id}', {
    onSuccess: () => {
      setDeleteConfirmId(null)
      refetch()
    },
  })

  // --- HANDLERS ---
  const handleOpenModal = (item?: TeachingLevelDto) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        code: item.code,
        name: item.name,
        academicYearId: item.academicYearId,
        minHours: item.minHours,
        maxHours: item.maxHours,
      })
    } else {
      setEditingItem(null)
      setFormData({
        code: '',
        name: '',
        academicYearId: undefined,
        minHours: 0,
        maxHours: 0,
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
    if (!formData.code?.trim()) errors.code = 'Vui lòng nhập mã định mức'
    if (!formData.name?.trim()) errors.name = 'Vui lòng nhập tên định mức'
    if (!formData.academicYearId) errors.academicYearId = 'Vui lòng chọn/nhập ID năm học'
    if (formData.minHours === undefined || formData.minHours < 0)
      errors.minHours = 'Giờ tối thiểu không hợp lệ'
    if (formData.maxHours === undefined || formData.maxHours < 0) errors.maxHours = 'Giờ tối đa không hợp lệ'
    if (
      formData.minHours !== undefined &&
      formData.maxHours !== undefined &&
      formData.minHours > formData.maxHours
    ) {
      errors.maxHours = 'Giờ tối đa phải lớn hơn hoặc bằng giờ tối thiểu'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingItem) {
      updateMutation.mutate({
        params: {
          path: { id: editingItem.id },
        },
        body: formData as TeachingLevelDto,
      })
    } else {
      createMutation.mutate({
        body: formData as TeachingLevelDto,
      })
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQueryParams((prev) => ({ ...prev, page: 1 }))
  }

  const handleResetSearch = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      code: undefined,
      name: undefined,
      academicYearId: undefined,
    })
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate({
      params: {
        path: { id },
      },
    })
  }

  const totalPages = Math.ceil((data?.total || 0) / (queryParams.limit || 10))

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Khung Định Mức Giảng Dạy
          </h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý và cấu hình định mức giờ dạy theo năm học</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4" />
          Thêm định mức
        </button>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <input
          type="text"
          placeholder="Tìm theo mã..."
          value={queryParams.code || ''}
          onChange={(e) => setQueryParams((prev) => ({ ...prev, code: e.target.value || undefined }))}
          className="min-w-[150px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={queryParams.name || ''}
          onChange={(e) => setQueryParams((prev) => ({ ...prev, name: e.target.value || undefined }))}
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <select
          value={queryParams.academicYearId || ''}
          onChange={(e) =>
            setQueryParams((prev) => ({
              ...prev,
              academicYearId: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className="min-w-[150px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Chọn năm học --</option>
          {academiCyearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900"
          >
            <Search className="h-4 w-4" />
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleResetSearch}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </button>
        </div>
      </form>

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
                <th className="px-4 py-3.5">Tên định mức</th>
                <th className="px-4 py-3.5">Năm học</th>
                <th className="px-4 py-3.5">Giờ tối thiểu</th>
                <th className="px-4 py-3.5">Giờ tối đa</th>
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
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có dữ liệu định mức nào.
                  </td>
                </tr>
              ) : (
                data?.data?.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs">{item.code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {academiCyearOptions.find((opt) => opt.value === item.academicYearId)?.label ||
                        item.academicYearId ||
                        '-'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <Clock className="h-3 w-3" />
                        {item.minHours}h
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Clock className="h-3 w-3" />
                        {item.maxHours}h
                      </span>
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

        {/* Phân trang */}
        {data && data.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 text-sm text-slate-600 sm:flex-row">
            <div>
              Hiển thị tổng số <strong className="text-slate-800">{data.total}</strong> kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={queryParams.page === 1}
                onClick={() =>
                  setQueryParams((prev) => ({
                    ...prev,
                    page: Math.max((prev.page || 1) - 1, 1),
                  }))
                }
                className="rounded-md border border-slate-300 px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              <span className="px-2">
                Trang {queryParams.page} / {totalPages || 1}
              </span>
              <button
                disabled={queryParams.page >= totalPages}
                onClick={() =>
                  setQueryParams((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
                className="rounded-md border border-slate-300 px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? 'Cập nhật định mức' : 'Thêm mới định mức'}
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
                  Mã định mức *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: L1"
                />
                {formErrors.code && <p className="mt-1 text-xs text-rose-500">{formErrors.code}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                  Tên định mức *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: Định mức Giảng viên chính"
                />
                {formErrors.name && <p className="mt-1 text-xs text-rose-500">{formErrors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Năm học *</label>
                <select
                  value={formData.academicYearId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      academicYearId: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Chọn năm học --</option>
                  {academiCyearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formErrors.academicYearId && (
                  <p className="mt-1 text-xs text-rose-500">{formErrors.academicYearId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                    Giờ tối thiểu *
                  </label>
                  <input
                    type="number"
                    value={formData.minHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minHours: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formErrors.minHours && <p className="mt-1 text-xs text-rose-500">{formErrors.minHours}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">
                    Giờ tối đa *
                  </label>
                  <input
                    type="number"
                    value={formData.maxHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxHours: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formErrors.maxHours && <p className="mt-1 text-xs text-rose-500">{formErrors.maxHours}</p>}
                </div>
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
              <p className="mt-1 text-sm text-slate-500">Bạn có chắc chắn muốn xóa định mức này không?</p>
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
