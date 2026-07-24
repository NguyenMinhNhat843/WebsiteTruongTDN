import { useState, useMemo } from 'react'
import { $api } from '../../../api/client'
import { Search, Filter, BookOpen, PenSquare, X, ChevronDown, RefreshCw, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// --- Custom Searchable Select Component ---
interface SelectOption {
  label: string
  value: number
  subLabel?: string
}

interface SearchableSelectProps {
  options: SelectOption[]
  value?: number
  onChange: (value?: number) => void
  placeholder: string
  label: string
}

const SearchableSelect = ({ options, value, onChange, placeholder, label }: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [options, searchTerm])

  return (
    <div className="relative w-full text-left">
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-600 uppercase">
        {label}
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-150 ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`truncate ${selectedOption ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <X
              size={14}
              className="cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation()
                onChange(undefined)
              }}
            />
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="animate-in fade-in slide-in-from-top-1 absolute z-20 mt-1 flex max-h-60 w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-xl duration-150">
            <div className="border-b border-gray-100 bg-gray-50/50 p-2">
              <div className="relative">
                <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:border-blue-500 focus:outline-none"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-48 flex-1 overflow-y-auto">
              <div
                onClick={() => {
                  onChange(undefined)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className="cursor-pointer border-b border-gray-50 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
              >
                -- Tất cả --
              </div>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                      value === opt.value
                        ? 'bg-blue-50 font-medium text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && <span className="ml-2 text-xs text-gray-400">{opt.subLabel}</span>}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-gray-400">Không tìm thấy kết quả</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// --- Main Page Component ---
const GradeManagementPage = () => {
  const navigate = useNavigate()
  // State Bộ lọc
  const [filters, setFilters] = useState<{
    semesterId?: number
    classId?: number
    teacherId?: number
    subjectId?: number
    majorId?: number
  }>({})

  // Fetch Options Data
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery('get', '/semesters')
  const { data: classes } = $api.useQuery('get', '/classes')
  const { data: teachers } = $api.useQuery('get', '/staffs', {
    params: { query: { employeeRole: 'TEACHER' } },
  })
  const { data: subjects } = $api.useQuery('get', '/subjects')
  const { data: majors } = $api.useQuery('get', '/majors')

  // Fetch Class Subjects dựa theo Filter
  const {
    data: classSubjects,
    isLoading: isLoadingClassSubjects,
    refetch,
  } = $api.useQuery('get', '/class-subject', {
    params: {
      query: {
        semesterId: filters.semesterId,
        classId: filters.classId,
        teacherId: filters.teacherId,
        subjectId: filters.subjectId,
        majorId: filters.majorId,
      },
    },
  })

  // Map Data options cho Select
  const semesterOptions = useMemo(
    () => semesters?.map((s) => ({ label: s.name, value: s.id, subLabel: s.schoolYear })) || [],
    [semesters],
  )

  const classOptions = useMemo(
    () => classes?.map((c) => ({ label: c.className, value: c.id, subLabel: c.classCode })) || [],
    [classes],
  )

  const teacherOptions = useMemo(
    () => teachers?.map((t) => ({ label: t.fullName, value: t.id!, subLabel: t.staffCode })) || [],
    [teachers],
  )

  const subjectOptions = useMemo(
    () => subjects?.map((s) => ({ label: s.subjectName, value: s.id, subLabel: `${s.credits} TC` })) || [],
    [subjects],
  )

  const majorOptions = useMemo(
    () => majors?.map((m) => ({ label: m.majorName, value: m.id, subLabel: m.majorCode })) || [],
    [majors],
  )

  const handleFilterChange = (key: keyof typeof filters, value?: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({})
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-h-screen space-y-6 bg-gray-50/50 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Nhập điểm</h1>
          <p className="mt-1 text-sm text-gray-500">
            Danh sách các lớp học phần cần quản lý và nhập điểm cho sinh viên
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 md:self-auto"
        >
          <RefreshCw size={15} />
          Làm mới
        </button>
      </div>

      {/* Filter Section - Chia thành 2 hàng */}
      <div className="space-y-4 rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Filter size={18} className="text-blue-600" />
            <span>Bộ lọc tìm kiếm</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700"
            >
              <X size={12} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Filters Grid - 2 Hàng */}
        <div className="space-y-4">
          {/* Hàng 1: Học kỳ, Ngành học, Lớp học */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SearchableSelect
              label="Học kỳ"
              placeholder="Tất cả học kỳ"
              options={semesterOptions}
              value={filters.semesterId}
              onChange={(val) => handleFilterChange('semesterId', val)}
            />

            <SearchableSelect
              label="Ngành học"
              placeholder="Tất cả ngành"
              options={majorOptions}
              value={filters.majorId}
              onChange={(val) => handleFilterChange('majorId', val)}
            />

            <SearchableSelect
              label="Lớp học"
              placeholder="Tất cả lớp"
              options={classOptions}
              value={filters.classId}
              onChange={(val) => handleFilterChange('classId', val)}
            />
          </div>

          {/* Hàng 2: Môn học, Giảng viên */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SearchableSelect
              label="Môn học"
              placeholder="Tất cả môn"
              options={subjectOptions}
              value={filters.subjectId}
              onChange={(val) => handleFilterChange('subjectId', val)}
            />

            <SearchableSelect
              label="Giảng viên phụ trách"
              placeholder="Tất cả giảng viên"
              options={teacherOptions}
              value={filters.teacherId}
              onChange={(val) => handleFilterChange('teacherId', val)}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Danh sách lớp học phần ({classSubjects?.length || 0})
          </span>
        </div>

        {isLoadingClassSubjects || isLoadingSemesters ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : classSubjects && classSubjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  <th className="px-4 py-3.5">STT</th>
                  <th className="px-4 py-3.5">Môn học</th>
                  <th className="px-4 py-3.5">Lớp học</th>
                  <th className="px-4 py-3.5">Học kỳ</th>
                  <th className="px-4 py-3.5">Giảng viên</th>
                  <th className="px-4 py-3.5 text-center">Tín chỉ</th>
                  <th className="px-4 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {classSubjects.map((item, index) => (
                  <tr key={item.id} className="group transition-colors hover:bg-blue-50/30">
                    {/* STT */}
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-400">{index + 1}</td>

                    {/* Môn học */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {item.subject?.subjectName || 'N/A'}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <BookOpen size={12} />
                        <span>Mã môn: {item.subject?.subjectCode || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Lớp học */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-800">{item.baseClass?.className || 'N/A'}</div>
                      <div className="text-xs text-gray-400">
                        Mã lớp: {item.baseClass?.classCode || 'N/A'}
                      </div>
                    </td>

                    {/* Học kỳ */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.semester?.name || 'N/A'}
                      </span>
                    </td>

                    {/* Giảng viên */}
                    <td className="px-4 py-3.5 text-gray-700">
                      {item.teacher?.fullName ? (
                        <div className="flex items-center gap-1.5 font-medium">
                          <UserCheck size={14} className="text-gray-400" />
                          <span>{item.teacher.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa phân công</span>
                      )}
                    </td>

                    {/* Tín chỉ */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-semibold text-gray-700">{item.subject?.credits ?? '-'}</span>
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          navigate(`nhap-diem/${item.id}`)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm transition-all duration-150 hover:bg-blue-600 hover:text-white"
                      >
                        <PenSquare size={13} />
                        Nhập điểm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <BookOpen size={24} />
            </div>
            <h3 className="text-base font-semibold text-gray-800">Không tìm thấy dữ liệu</h3>
            <p className="mt-1 text-xs text-gray-500">Thử điều chỉnh bộ lọc để xem các lớp học phần khác.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GradeManagementPage
