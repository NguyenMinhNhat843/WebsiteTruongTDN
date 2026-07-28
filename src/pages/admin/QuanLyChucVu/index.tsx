import React, { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import {
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  Filter,
} from 'lucide-react'
import { $api } from '../../../api/client'
import type { ManagementPositionDto } from '../../../api/entity'
import PageShell from '../../../components/ui/PageShell'
import ButtonAction from '../../../components/ui/ButtonAction'

const columnHelper = createColumnHelper<ManagementPositionDto>()

export default function QuanLyChucVu() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ManagementPositionDto | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  // Search Filter State
  const [searchParams, setSearchParams] = useState({
    code: undefined as string | undefined,
    name: undefined as string | undefined,
    isActive: undefined as boolean | undefined,
  })

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    priority: 1,
    reductionPercent: 0,
    isActive: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // ==========================================
  // 1. API QUERIES & MUTATIONS
  // ==========================================
  const {
    data: positions = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = $api.useQuery('get', '/management-positions', {
    params: {
      query: searchParams,
    },
  })

  const createMutation = $api.useMutation('post', '/management-positions', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  const updateMutation = $api.useMutation('patch', '/management-positions/{id}', {
    onSuccess: () => {
      handleCloseModal()
      refetch()
    },
  })

  const deleteMutation = $api.useMutation('delete', '/management-positions/{id}', {
    onSuccess: () => {
      setDeleteConfirmId(null)
      refetch()
    },
  })

  // ==========================================
  // 2. TANSTACK TABLE COLUMNS CONFIG
  // ==========================================
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Mã chức vụ',
        cell: (info) => (
          <span className="inline-flex items-center rounded-md border border-slate-200/60 bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Tên chức vụ',
        cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor('priority', {
        header: 'Độ ưu tiên',
        cell: (info) => (
          <div className="text-center">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('reductionPercent', {
        header: 'Tỷ lệ giảm trừ',
        cell: (info) => (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {info.getValue()}%
          </span>
        ),
      }),
      columnHelper.accessor('isActive', {
        header: 'Trạng thái',
        cell: (info) => {
          const isActive = info.getValue()
          return isActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Hoạt động
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Ngưng
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Thao tác</div>,
        cell: (info) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleOpenModal(info.row.original)}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              title="Chỉnh sửa"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteConfirmId(info.row.original.id)}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: positions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // ==========================================
  // 3. HANDLERS
  // ==========================================
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
    <PageShell
      title="Quản lý chức vụ"
      sub="Quản lý danh mục chức danh kiêm nhiệm và định mức tỷ lệ % giảm trừ"
      icon={Briefcase}
      renderRight={
        <ButtonAction label="Thêm chức vụ" icon={<Plus size={16} />} onClick={() => handleOpenModal()} />
      }
    >
      <div className="space-y-5">
        {/* BỘ LỌC TÌM KIẾM */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <Filter className="h-3.5 w-3.5" />
            Bộ lọc tìm kiếm
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo mã..."
                value={searchParams.code || ''}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    code: e.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={searchParams.name || ''}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    name: e.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={searchParams.isActive === undefined ? '' : String(searchParams.isActive)}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    isActive: e.target.value === '' ? undefined : e.target.value === 'true',
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
              >
                <option value="">-- Tất cả trạng thái --</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Ngưng hoạt động</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:ring-2 focus:ring-slate-500/10 focus:outline-none"
              >
                <RotateCcw className="h-4 w-4" />
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU TANSTACK TABLE */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
          {/* Thanh Indicator khi background fetching */}
          {isFetching && !isLoading && (
            <div className="absolute top-0 right-0 left-0 z-10 h-1 overflow-hidden bg-blue-100">
              <div className="h-full w-full animate-pulse bg-blue-600" />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold tracking-wider text-slate-500 uppercase"
                  >
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort()
                      return (
                        <th
                          key={header.id}
                          className="px-4 py-3.5 select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div
                            className={`flex items-center gap-1.5 ${
                              canSort ? 'cursor-pointer hover:text-slate-900' : ''
                            }`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="text-slate-400">
                                {{
                                  asc: <ArrowUp className="h-3.5 w-3.5 text-blue-600" />,
                                  desc: <ArrowDown className="h-3.5 w-3.5 text-blue-600" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-rose-600">
                        <AlertCircle className="h-7 w-7" />
                        <span className="text-sm font-medium">
                          Không thể tải dữ liệu! Vui lòng thử lại sau.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Inbox className="h-8 w-8 stroke-[1.5]" />
                        <span className="text-sm">Chưa tìm thấy dữ liệu phù hợp.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/80">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG (PAGINATION) */}
          {!isLoading && !isError && positions.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row">
              <div className="text-xs text-slate-500">
                Hiển thị{' '}
                <span className="font-semibold text-slate-800">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                đến{' '}
                <span className="font-semibold text-slate-800">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    positions.length,
                  )}
                </span>{' '}
                trong <span className="font-semibold text-slate-800">{positions.length}</span> kết quả
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  {[10, 20, 30, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} hàng / trang
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-xs font-medium text-slate-600">
                    Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL THÊM / SỬA */}
        {isModalOpen && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
            <div className="animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-900">
                  {editingItem ? 'Cập nhật chức vụ' : 'Thêm mới chức vụ'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Mã chức vụ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
                    placeholder="Ví dụ: TK"
                  />
                  {formErrors.code && <p className="mt-1 text-xs text-rose-500">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Tên chức vụ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
                    placeholder="Ví dụ: Trưởng khoa"
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-rose-500">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Độ ưu tiên <span className="text-rose-500">*</span>
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
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
                    />
                    {formErrors.priority && (
                      <p className="mt-1 text-xs text-rose-500">{formErrors.priority}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      % Giảm trừ <span className="text-rose-500">*</span>
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
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
                      placeholder="0 - 100"
                    />
                    {formErrors.reductionPercent && (
                      <p className="mt-1 text-xs text-rose-500">{formErrors.reductionPercent}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="inline-flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Kích hoạt (Cho phép áp dụng)</span>
                  </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-5">
                  <ButtonAction label="Hủy" onClick={handleCloseModal} variant="outline" />
                  <ButtonAction
                    label="Lưu thông tin"
                    loading={createMutation.isPending || updateMutation.isPending}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DIALOG XÁC NHẬN XÓA */}
        {deleteConfirmId && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
            <div className="animate-in zoom-in-95 w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl duration-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Xác nhận xóa</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Bạn có chắc chắn muốn xóa chức vụ này không? Thao tác này không thể hoàn tác.
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
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Xóa ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
