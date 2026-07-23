import React, { useState } from 'react'
import { Search, Plus, Edit3, Trash2, BookOpen, X, Loader2 } from 'lucide-react'
import { $api } from '../../../../api/client'
import { useDebounce } from '../../../../hooks/useDebounce'
import type { SubjectCombinationDetailDto } from '../../../../api/entity'

const ToHopMonHome: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const [page, setPage] = useState(1)
  const limit = 10

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SubjectCombinationDetailDto | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Form State for Create/Edit
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [subjectCodesInput, setSubjectCodesInput] = useState('') // Chuỗi mã môn phân cách bởi dấu phẩy

  // Query list
  const {
    data: response,
    isLoading,
    refetch,
  } = $api.useQuery('get', '/subject-combinations', {
    params: {
      query: {
        code: debouncedSearch || undefined,
        name: debouncedSearch || undefined,
        page,
        limit,
      },
    },
  })

  const combinations = response?.data || []
  const total = response?.total || 0
  const totalPages = Math.ceil(total / limit)

  // Mutations
  const { mutate: createCombination, isPending: isCreating } = $api.useMutation(
    'post',
    '/subject-combinations',
    {
      onSuccess: () => {
        closeModal()
        refetch()
      },
    },
  )

  const { mutate: updateCombination, isPending: isUpdating } = $api.useMutation(
    'patch',
    '/subject-combinations/{id}',
    {
      onSuccess: () => {
        closeModal()
        refetch()
      },
    },
  )

  const { mutate: deleteCombination, isPending: isDeleting } = $api.useMutation(
    'delete',
    '/subject-combinations/{id}',
    {
      onSuccess: () => {
        setDeleteId(null)
        refetch()
      },
    },
  )

  const openCreateModal = () => {
    setEditingItem(null)
    setCode('')
    setName('')
    setSubjectCodesInput('MATH, PHYSICS, CHEMISTRY')
    setIsModalOpen(true)
  }

  const openEditModal = (item: SubjectCombinationDetailDto) => {
    setEditingItem(item)
    setCode(item.code)
    setName(item.name)
    const names = item.items?.map((i) => i.subjectName).join(', ') || ''
    setSubjectCodesInput(names)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !name) return

    const items = subjectCodesInput
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0)
      .map((subjectName) => ({ subjectName }))

    if (editingItem) {
      updateCombination({
        params: { path: { id: editingItem.id } },
        body: { code, name, items },
      })
    } else {
      createCombination({
        body: { code, name, items },
      })
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteCombination({ params: { path: { id: deleteId } } })
    }
  }

  return (
    <div className="space-[#1e293b] space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Danh Mục Tổ Hợp Môn Xét Tuyển</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {total} tổ hợp
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Quản lý các khối thi & tổ hợp môn xét tuyển (Ví dụ: A00, A01, D01...)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Thêm tổ hợp môn mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo mã (A00, D01) hoặc tên..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-xs transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : combinations.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Chưa có tổ hợp môn nào</p>
            <p className="mt-1 text-xs text-slate-400">Nhấn nút thêm mới để tạo tổ hợp môn xét tuyển.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  <th className="px-4 py-3.5">Mã Tổ Hợp</th>
                  <th className="px-4 py-3.5">Tên Tổ Hợp</th>
                  <th className="px-4 py-3.5">Danh Sách Môn Học</th>
                  <th className="px-4 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {combinations.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3.5 font-bold text-indigo-600">{item.code}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {item.items?.map((sub) => (
                          <span
                            key={sub.id}
                            className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            {sub.subjectName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="space-x-1 px-4 py-3.5 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs">
            <span className="text-slate-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-sm font-bold text-slate-800">
                {editingItem ? 'Cập Nhật Tổ Hợp Môn' : 'Thêm Tổ Hợp Môn Mới'}
              </h3>
              <button onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  Mã Tổ Hợp (VD: A00, A01, D01) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="A00"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  Tên Tổ Hợp (VD: Toán - Lý - Hóa) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Toán - Lý - Hóa"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  Danh Sách Môn Học (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={subjectCodesInput}
                  onChange={(e) => setSubjectCodesInput(e.target.value)}
                  placeholder="MATH, PHYSICS, CHEMISTRY"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">Ví dụ: Toán, Lý, Hóa</p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingItem ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center text-xs shadow-xl">
            <h4 className="mb-2 text-sm font-bold text-slate-800">Xác Nhận Xóa Tổ Hợp Môn?</h4>
            <p className="mb-6 text-slate-500">
              Hành động này không thể hoàn tác. Các đợt tuyển sinh đang dùng tổ hợp này sẽ bị ảnh hưởng.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-600 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToHopMonHome
