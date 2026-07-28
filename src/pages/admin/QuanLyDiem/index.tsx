import { useState, useMemo } from 'react'
import { $api } from '../../../api/client'
import {
  Filter,
  BookOpen,
  PenSquare,
  X,
  RefreshCw,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import ButtonAction from '../../../components/ui/ButtonAction'
import SelectSearchInput from '../../../components/ui/Form/SelectInput'
import { SEMESTER_MAP } from '../../../api/enum'

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
  const semesterOptions = useMemo(() => {
    if (!semesters) return []

    // 1. Lọc chỉ lấy ACTIVE và CLOSE
    const filteredSemesters = semesters.filter((s) => s.status === 'ACTIVE' || s.status === 'CLOSE')

    // 2. Sắp xếp: ACTIVE lên trước, CLOSE theo sau. Cùng status thì xếp theo startDate tăng dần
    const sortedSemesters = filteredSemesters.sort((a, b) => {
      // Độ ưu tiên của status: ACTIVE (1) -> CLOSE (2)
      const priority = { ACTIVE: 1, CLOSE: 2 }
      const priorityA = a.status ? (priority[a.status as 'ACTIVE' | 'CLOSE'] ?? 99) : 99
      const priorityB = b.status ? (priority[b.status as 'ACTIVE' | 'CLOSE'] ?? 99) : 99

      // Nếu khác status -> ACTIVE đứng trước CLOSE
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // Nếu cùng status -> So sánh startDate tăng dần (ngày xa hơn đứng trước)
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0

      return dateA - dateB
    })

    // 3. Map sang định dạng options cho SelectSearchInput
    return sortedSemesters.map((s) => {
      const statusInfo = s.status ? SEMESTER_MAP[s.status] : null

      return {
        value: s.id,
        label: (
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="font-medium">{s.name}</span>
              {s.schoolYear && <span className="text-xs text-slate-400">({s.schoolYear})</span>}
            </div>

            {statusInfo && (
              <span
                className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusInfo.colorClass}`}
              >
                {statusInfo.label}
              </span>
            )}
          </div>
        ),
        searchText: `${s.name} ${s.schoolYear || ''} ${statusInfo?.label || ''}`,
      }
    })
  }, [semesters])

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
    <PageShell
      title="Quản lý Đào tạo & Nhập điểm"
      sub="Quản lý các lớp học phần, thực hiện điểm danh và quản lý bảng điểm học tập của sinh viên."
      icon={GraduationCap}
      renderRight={
        <ButtonAction
          label="Làm mới dữ liệu"
          variant="secondary"
          icon={<RefreshCw size={16} />}
          onClick={() => refetch()}
        />
      }
    >
      <div className="min-h-screen space-y-6">
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
              <SelectSearchInput
                label="Học kỳ"
                placeholder="Tất cả học kỳ"
                options={semesterOptions}
                value={filters.semesterId ?? ''}
                onChange={(e) => handleFilterChange('semesterId', e.target.value)}
              />

              <SelectSearchInput
                label="Ngành học"
                placeholder="Tất cả ngành"
                options={majorOptions}
                value={filters.majorId}
                onChange={(val) => handleFilterChange('majorId', val)}
              />

              <SelectSearchInput
                label="Lớp sinh hoạt"
                placeholder="Tất cả lớp"
                options={classOptions}
                value={filters.classId}
                onChange={(val) => handleFilterChange('classId', val)}
              />
            </div>

            {/* Hàng 2: Môn học, Giảng viên */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectSearchInput
                label="Môn học"
                placeholder="Tất cả môn học"
                options={subjectOptions}
                value={filters.subjectId}
                onChange={(val) => handleFilterChange('subjectId', val)}
              />

              <SelectSearchInput
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
    </PageShell>
  )
}

export default GradeManagementPage
