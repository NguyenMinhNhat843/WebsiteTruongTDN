import { useState } from 'react'
import { $api } from '../../../api/client'
import type { components, paths } from '../../../api/v1'
import { Trash2, Edit2, Search, Loader2, Filter, BookOpen, Layers, ChevronDown } from 'lucide-react'
import CreateMonHocModal from './CreateMonHoc'

export type SubjectDto = components['schemas']['SubjectDto']
export type QuerySubject = paths['/subjects']['get']['parameters']['query']

const MonHocList = () => {
  // State quản lý bộ lọc
  const [filters, setFilters] = useState({
    keyword: '',
    departmentId: '' as string | number,
  })

  // State lưu môn học đang được chọn để chỉnh sửa
  const [subjectSelected, setSubjectSelected] = useState<SubjectDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch danh sách phòng ban
  const { data: departments, isLoading: isLoadingDepartments } = $api.useQuery('get', '/departments')

  // Params tìm kiếm
  const queryParams: QuerySubject = {
    keyword: filters.keyword || undefined,
    departmentId: filters.departmentId ? Number(filters.departmentId) : undefined,
  }

  // Fetch dữ liệu môn học
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    refetch,
  } = $api.useQuery('get', '/subjects', {
    params: { query: queryParams },
  })

  // Mutation xóa môn học
  const { mutate: deleteSubject, isPending: isDeletingSubject } = $api.useMutation(
    'delete',
    '/subjects/{id}',
    {
      onSuccess: () => {
        alert('Xóa môn học thành công!')
        refetch()
      },
      onError: (error) => {
        alert('Có lỗi xảy ra khi xóa!')
        console.error(error)
      },
    },
  )

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa môn học "${name}" không?`)) {
      deleteSubject({
        params: { path: { id } },
      })
    }
  }

  const getDepartmentName = (id: number | null | undefined) => {
    if (!id || !departments) return '---'
    const dept = departments.find((d) => d.id === id)
    return dept ? dept.deptName : 'Không xác định'
  }

  const renderSubjectType = (type: string | undefined) => {
    if (!type) return <span className="text-slate-400">---</span>

    switch (type.toUpperCase()) {
      case 'GENERAL':
        return (
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-slate-700">
            Đại cương
          </span>
        )
      case 'BASE_MAJOR':
        return (
          <span className="inline-flex items-center rounded-md border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-amber-700">
            Cơ sở ngành
          </span>
        )
      case 'SPECIALIZED':
        return (
          <span className="inline-flex items-center rounded-md border border-indigo-200/60 bg-indigo-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-indigo-700">
            Chuyên ngành
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-md border border-blue-200/60 bg-blue-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-blue-700">
            {type}
          </span>
        )
    }
  }

  const handleOpenEditModal = (subject: SubjectDto) => {
    setSubjectSelected(subject)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSubjectSelected(null)
  }

  return (
    <div className="space-y-5">
      {/* --- Thanh Bộ Lọc (Filter Bar) --- */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:flex-row">
        <div className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
          <Filter size={16} className="text-indigo-600" />
          <span>Lọc môn học</span>
        </div>

        <div className="grid w-full min-w-[550px] grid-cols-1 gap-3 md:w-auto md:grid-cols-2">
          {/* Tìm kiếm từ khóa */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã hoặc tên môn học..."
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-sm transition-all placeholder:text-slate-400 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          {/* Chọn phòng ban/khoa */}
          <div className="relative">
            <select
              value={filters.departmentId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  departmentId: e.target.value,
                }))
              }
              disabled={isLoadingDepartments}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pr-8 pl-3 text-sm text-slate-700 transition-all hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:opacity-60"
            >
              <option value="">-- Tất cả khoa quản lý --</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            {isLoadingDepartments && (
              <Loader2 className="absolute top-1/2 right-8 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* --- Bảng Danh Sách Dữ Liệu --- */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold tracking-tight text-slate-600 uppercase">
                <th className="w-32 px-4 py-4 whitespace-nowrap">Mã môn</th>
                <th className="min-w-[260px] px-4 py-4">Tên môn học</th>
                <th className="w-28 px-4 py-4 text-center whitespace-nowrap">Tín chỉ</th>
                <th className="w-40 px-4 py-4 text-center whitespace-nowrap">Khối kiến thức</th>
                <th className="w-24 px-4 py-4 text-center whitespace-nowrap">Lý thuyết</th>
                <th className="w-24 px-4 py-4 text-center whitespace-nowrap">Thực hành</th>
                <th className="w-20 px-4 py-4 text-center whitespace-nowrap">Thi</th>
                <th className="min-w-[180px] px-4 py-4">Đơn vị quản lý</th>
                <th className="w-24 px-4 py-4 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoadingSubjects ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                      <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu môn học...</span>
                    </div>
                  </td>
                </tr>
              ) : !subjects || subjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-slate-400">
                        <BookOpen size={28} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Không tìm thấy môn học nào</p>
                      <p className="text-xs text-slate-400">
                        Thử điều chỉnh lại bộ lọc tìm kiếm hoặc thêm mới môn học.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id} className="group transition-colors hover:bg-slate-50/80">
                    {/* Mã môn học */}
                    <td className="px-4 py-3.5 font-mono font-bold whitespace-nowrap text-slate-800">
                      <span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1">
                        {subject.subjectCode}
                      </span>
                    </td>

                    {/* Tên môn học - Cho phép tự do xuống hàng */}
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(subject)}
                        className="text-left text-sm leading-snug font-bold text-slate-800 transition-colors hover:text-indigo-600"
                      >
                        {subject.subjectName}
                      </button>
                    </td>

                    {/* Tín chỉ */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-block rounded border border-slate-200/60 bg-slate-50 px-2.5 py-1 font-bold text-slate-900">
                        {subject.credits} TC
                      </span>
                    </td>

                    {/* Loại môn học */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {renderSubjectType(subject.knowledgeBlock)}
                    </td>

                    {/* Lý thuyết / Thực hành / Thi */}
                    <td className="px-4 py-3.5 text-center font-medium whitespace-nowrap text-slate-700">
                      {subject.theoryHours}h
                    </td>
                    <td className="px-4 py-3.5 text-center font-medium whitespace-nowrap text-slate-700">
                      {subject.practiceHours}h
                    </td>
                    <td className="px-4 py-3.5 text-center font-medium whitespace-nowrap text-slate-700">
                      {subject.testHours}h
                    </td>

                    {/* Đơn vị quản lý */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Layers size={14} className="shrink-0 text-slate-400" />
                        <span
                          className="max-w-[200px] truncate"
                          title={getDepartmentName(subject.departmentId)}
                        >
                          {getDepartmentName(subject.departmentId)}
                        </span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(subject)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={isDeletingSubject}
                          onClick={() => handleDelete(subject.id, subject.subjectName)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                          title="Xóa môn học"
                        >
                          <Trash2 size={16} />
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

      {/* Modal Tạo mới / Cập nhật */}
      <CreateMonHocModal
        isOpen={isModalOpen}
        initialData={subjectSelected}
        onClose={handleCloseModal}
        isPending={false}
        onSubmit={(data, cleanResetForm) => {
          cleanResetForm()
          handleCloseModal()
          refetch()
        }}
      />
    </div>
  )
}

export default MonHocList
