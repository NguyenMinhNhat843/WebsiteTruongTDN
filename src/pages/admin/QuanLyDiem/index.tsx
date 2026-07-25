import { useState, useMemo } from 'react'
import { $api } from '../../../api/client'
import {
  Search,
  Filter,
  BookOpen,
  PenSquare,
  X,
  ChevronDown,
  RefreshCw,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react'
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
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
        {label}
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-150 ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={`truncate ${selectedOption ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <X
              size={14}
              className="cursor-pointer text-slate-400 hover:text-slate-600"
              onClick={(e) => {
                e.stopPropagation()
                onChange(undefined)
              }}
            />
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="animate-in fade-in slide-in-from-top-1 absolute z-20 mt-1 flex max-h-60 w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl duration-150">
            <div className="border-b border-slate-100 bg-slate-50/50 p-2">
              <div className="relative">
                <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:border-indigo-500 focus:outline-none"
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
                className="cursor-pointer border-b border-slate-100 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50"
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
                    className={`flex cursor-pointer items-center justify-between px-3 py-2 text-xs transition-colors ${
                      value === opt.value
                        ? 'bg-indigo-50 font-semibold text-indigo-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && <span className="ml-2 text-[11px] text-slate-400">{opt.subLabel}</span>}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400">Không tìm thấy kết quả</div>
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

  // Thống kê nhanh
  const totalCredits = useMemo(
    () => classSubjects?.reduce((sum, item) => sum + (item.subject?.credits || 0), 0) || 0,
    [classSubjects],
  )

  const assignedTeacherCount = useMemo(
    () => classSubjects?.filter((item) => !!item.teacherId).length || 0,
    [classSubjects],
  )

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            Quản lý Đào tạo & Nhập điểm
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Quản lý các lớp học phần, thực hiện điểm danh và quản lý bảng điểm học tập của sinh viên.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-indigo-600 md:self-auto"
        >
          <RefreshCw size={14} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Lớp học phần</p>
            <p className="text-xl font-bold text-slate-800">{classSubjects?.length || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng số tín chỉ</p>
            <p className="text-xl font-bold text-slate-800">{totalCredits} TC</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Đã phân công GV</p>
            <p className="text-xl font-bold text-slate-800">
              {assignedTeacherCount} / {classSubjects?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
            <Filter size={16} className="text-indigo-600" />
            <span>Bộ lọc nâng cao</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-medium text-rose-600 transition-colors hover:text-rose-700"
            >
              <X size={13} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Filters Grid */}
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
              label="Lớp sinh hoạt"
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
              placeholder="Tất cả môn học"
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

      {/* --- TABLE CONTENT --- */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Danh sách Lớp học phần ({classSubjects?.length || 0})
          </span>
        </div>

        {isLoadingClassSubjects || isLoadingSemesters ? (
          <div className="p-12 text-center">
            <div className="inline-block h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent"></div>
            <p className="mt-3 text-xs font-medium text-slate-500">Đang tải dữ liệu lớp học phần...</p>
          </div>
        ) : classSubjects && classSubjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold tracking-wider text-slate-600 uppercase">
                  <th className="px-4 py-3.5 text-center">STT</th>
                  <th className="px-4 py-3.5">Môn học</th>
                  <th className="px-4 py-3.5">Lớp sinh hoạt</th>
                  <th className="px-4 py-3.5">Học kỳ</th>
                  <th className="px-4 py-3.5">Giảng viên</th>
                  <th className="px-4 py-3.5 text-center">Tín chỉ</th>
                  <th className="px-4 py-3.5 text-center">Thao tác quản lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {classSubjects.map((item, index) => (
                  <tr key={item.id} className="group transition-colors hover:bg-slate-50/80">
                    {/* STT */}
                    <td className="px-4 py-3.5 text-center font-medium text-slate-400">{index + 1}</td>

                    {/* Môn học */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                        {item.subject?.subjectName || 'N/A'}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <BookOpen size={12} className="text-slate-400" />
                        <span>Mã môn:</span>
                        <code className="py-0.2 rounded bg-slate-100 px-1 font-mono font-semibold text-slate-600">
                          {item.subject?.subjectCode || 'N/A'}
                        </code>
                      </div>
                    </td>

                    {/* Lớp sinh hoạt */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-700">
                        {item.baseClass?.className || 'N/A'}
                      </span>
                    </td>

                    {/* Học kỳ */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        {item.semester?.name || 'N/A'}
                      </span>
                    </td>

                    {/* Giảng viên */}
                    <td className="px-4 py-3.5 text-slate-700">
                      {item.teacher?.fullName ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <UserCheck size={14} className="text-indigo-500" />
                          <span>{item.teacher.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa phân công</span>
                      )}
                    </td>

                    {/* Tín chỉ */}
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">
                      {item.subject?.credits ?? '-'}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút Điểm danh */}
                        <button
                          onClick={() => {
                            navigate(`diem-danh/${item.id}`)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition-all duration-150 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                          title="Điểm danh sinh viên"
                        >
                          <CalendarCheck size={14} />
                          Điểm danh
                        </button>

                        {/* Nút Nhập điểm */}
                        <button
                          onClick={() => {
                            navigate(`nhap-diem/${item.id}`)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm transition-all duration-150 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                          title="Quản lý & Nhập điểm"
                        >
                          <PenSquare size={14} />
                          Nhập điểm
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <BookOpen size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Không tìm thấy lớp học phần</h3>
            <p className="mt-1 text-xs text-slate-500">
              Thử thay đổi hoặc làm mới bộ lọc để hiển thị kết quả khác.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GradeManagementPage
