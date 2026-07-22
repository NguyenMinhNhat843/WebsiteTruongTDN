import React, { useState } from 'react'
import { Search, Plus, Edit3, Trash2, BookOpen, X, Loader2 } from 'lucide-react'
import { $api } from '../../../../api/client'
import { useDebounce } from '../../../../hooks/useDebounce'
import type { SubjectCombinationDetailDto, SubjectCombinationDto } from '../../../../api/entity'

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
    const codes = item.items?.map((i) => i.subjectCode).join(', ') || ''
    setSubjectCodesInput(codes)
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
      .map((subjectCode) => ({ subjectCode }))

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
    <div className="p-6 space-[#1e293b] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Danh Mục Tổ Hợp Môn Xét Tuyển</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full">
              {total} tổ hợp
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các khối thi & tổ hợp môn xét tuyển (Ví dụ: A00, A01, D01...)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Thêm tổ hợp môn mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo mã (A00, D01) hoặc tên..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : combinations.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Chưa có tổ hợp môn nào</p>
            <p className="text-xs text-slate-400 mt-1">Nhấn nút thêm mới để tạo tổ hợp môn xét tuyển.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã Tổ Hợp</th>
                  <th className="py-3.5 px-4">Tên Tổ Hợp</th>
                  <th className="py-3.5 px-4">Danh Sách Môn Học</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {combinations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{item.code}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.items?.map((sub) => (
                          <span
                            key={sub.id}
                            className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                          >
                            {sub.subjectCode}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Cập Nhật Tổ Hợp Môn' : 'Thêm Tổ Hợp Môn Mới'}
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Mã Tổ Hợp (VD: A00, A01, D01) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="A00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tên Tổ Hợp (VD: Toán - Lý - Hóa) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Toán - Lý - Hóa"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Danh Sách Mã Môn (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={subjectCodesInput}
                  onChange={(e) => setSubjectCodesInput(e.target.value)}
                  placeholder="MATH, PHYSICS, CHEMISTRY"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Ví dụ: MATH, LITERATURE, ENGLISH</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingItem ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center text-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Xác Nhận Xóa Tổ Hợp Môn?</h4>
            <p className="text-slate-500 mb-6">
              Hành động này không thể hoàn tác. Các đợt tuyển sinh đang dùng tổ hợp này sẽ bị ảnh hưởng.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-medium flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
