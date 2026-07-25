import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Users,
  DoorOpen,
  Eye,
  LayoutGrid,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { LopGiangDayProvider, useLopGiangDayContext } from './LopGiangDayProvider'
import { useNavigate } from 'react-router-dom'
import type { ClassDto } from '../../../api/entity'

const LopHocTeacher = () => {
  return (
    <LopGiangDayProvider>
      <Inner />
    </LopGiangDayProvider>
  )
}

const Inner = () => {
  const { hocKysData, classList, isLoading, setSearchParams, semesterIdNumber, currentSemester } =
    useLopGiangDayContext()
  const navigate = useNavigate()

  // Tự động chọn học kỳ hiện tại khi tải trang
  useEffect(() => {
    if (!semesterIdNumber && hocKysData) {
      const currentHocKy = hocKysData.find((hk) => hk.id === currentSemester?.id)
      if (currentHocKy) {
        setSearchParams({ semesterId: String(currentHocKy.id) })
      }
    }
  }, [hocKysData, semesterIdNumber, currentSemester, setSearchParams])

  const [isSemesterOpen, setIsSemesterOpen] = useState(false)
  const currentHocKy = hocKysData?.find((hk) => hk.id === semesterIdNumber)

  // Thống kê
  const totalClasses = new Set(classList?.map((c) => c?.classId || c?.baseClass?.id)).size
  const totalStudents = classList?.reduce((acc, curr) => acc + (curr?.baseClass?.currentSize || 0), 0) || 0
  const uniqueSubjects = new Set(classList?.map((c) => c?.subject?.subjectCode)).size

  // 🔄 ĐẢO LOGIC: Nhóm các Môn học theo LỚP HỌC
  const groupedByClass = useMemo(() => {
    if (!classList) return {}
    return classList.reduce(
      (acc, cls) => {
        const classKey = cls?.classId || cls?.baseClass?.classCode || 'unknown'
        if (!acc[classKey]) {
          acc[classKey] = {
            baseClass: cls?.baseClass || {},
            classId: cls?.classId,
            classSubjects: [],
          }
        }
        acc[classKey].classSubjects.push(cls)
        return acc
      },
      {} as Record<
        string,
        { baseClass: Partial<ClassDto>; classId: number | null; classSubjects: typeof classList }
      >,
    )
  }, [classList])

  return (
    <PageShell
      title="Các lớp giảng dạy"
      sub="Quản lý danh sách lớp học và các môn học được phân công đảm nhận."
      icon={LayoutGrid}
    >
      <div className="space-y-6">
        {/* === BỘ LỌC HỌC KỲ === */}
        <div className="relative z-40 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row">
          <div className="relative w-full sm:w-80">
            <label className="mb-1.5 block px-0.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Học kỳ giảng dạy
            </label>
            <button
              type="button"
              className={`flex h-[44px] w-full items-center justify-between rounded-xl border bg-slate-50 px-4 py-2.5 text-left text-sm font-semibold transition-all focus:outline-none ${
                isSemesterOpen
                  ? 'border-indigo-500 bg-white text-slate-900 shadow-sm ring-4 ring-indigo-500/10'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
              }`}
              onClick={() => setIsSemesterOpen(!isSemesterOpen)}
            >
              <span className="flex items-center gap-2 truncate">
                {currentHocKy?.name || 'Chọn học kỳ để xem'}
                {currentHocKy?.isCurrent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Hiện tại
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  isSemesterOpen ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </button>

            {isSemesterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSemesterOpen(false)} />
                <div className="absolute left-0 z-40 mt-2 max-h-64 w-full divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl">
                  {hocKysData?.map((hk) => (
                    <button
                      key={hk.id}
                      type="button"
                      onClick={() => {
                        setSearchParams({ semesterId: String(hk.id) })
                        setIsSemesterOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                        semesterIdNumber === hk.id
                          ? 'bg-indigo-50/70 font-bold text-indigo-700'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate pr-4">{hk.name}</span>
                      {hk.isCurrent && (
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 self-stretch rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 sm:self-auto">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Dữ liệu được cập nhật tự động theo phân công công tác</span>
          </div>
        </div>

        {/* === THẺ THỐNG KÊ (Được chuốt lại độ tương phản) === */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="rounded-xl bg-blue-500/10 p-3.5 text-blue-600 transition-transform group-hover:scale-105">
              <DoorOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Lớp đảm nhận</p>
              <p className="mt-0.5 text-2xl font-black text-slate-900">{isLoading ? '---' : totalClasses}</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="rounded-xl bg-indigo-500/10 p-3.5 text-indigo-600 transition-transform group-hover:scale-105">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Môn học dạy</p>
              <p className="mt-0.5 text-2xl font-black text-slate-900">
                {isLoading ? '---' : uniqueSubjects}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="rounded-xl bg-amber-500/10 p-3.5 text-amber-600 transition-transform group-hover:scale-105">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Tổng học sinh</p>
              <p className="mt-0.5 text-2xl font-black text-slate-900">{isLoading ? '---' : totalStudents}</p>
            </div>
          </div>
        </div>

        {/* === DANH SÁCH LỚP HỌC VÀ MÔN HỌC (Môi Lớp là 1 Card Tương Phản Cao) === */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-16 text-slate-400 shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm font-semibold text-slate-500">Đang tải danh sách lớp học...</p>
          </div>
        ) : !classList || classList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-16 text-slate-400 shadow-sm">
            <GraduationCap className="h-12 w-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              {semesterIdNumber
                ? 'Không có lớp học nào được phân công trong học kỳ này'
                : 'Vui lòng chọn học kỳ để xem danh sách lớp'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByClass).map(([classKey, group]) => {
              const baseClass = group.baseClass
              return (
                <div
                  key={classKey}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* HEADER CARD LỚP HỌC (Tương phản viền nổi bật & Badge) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-4 text-white">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-base font-black text-white shadow-inner backdrop-blur-md">
                        {baseClass?.classCode?.slice(0, 3) || 'LỚP'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-extrabold tracking-tight text-white">
                            {baseClass?.className || 'Lớp chưa xác định'}
                          </h3>
                          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/30 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-200">
                            {baseClass?.classCode || 'N/A'}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                          <span>Quản lý danh sách môn thuộc lớp học này</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-md">
                        <Users className="h-3.5 w-3.5 text-indigo-300" />
                        <span>Sĩ số:</span>
                        <span className="font-extrabold text-white">{baseClass?.currentSize || 0}</span>
                        <span>học sinh</span>
                      </div>

                      <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-200">
                        {group.classSubjects.length} môn giảng dạy
                      </div>
                    </div>
                  </div>

                  {/* DANH SÁCH CÁC MÔN HỌC THUỘC LỚP */}
                  <div className="divide-y divide-slate-100">
                    {group.classSubjects.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-xl border border-indigo-100/80 bg-indigo-50 p-2.5 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                                {item.subject?.subjectName || 'Môn học chưa xác định'}
                              </h4>
                              {item.subject?.credits && (
                                <span className="rounded-md border border-slate-200/60 bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                                  {item.subject.credits} tín chỉ
                                </span>
                              )}
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                              <span>
                                Mã môn:{' '}
                                <span className="font-mono font-bold text-slate-700">
                                  {item.subject?.subjectCode || '---'}
                                </span>
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* CÁC NÚT HÀNH ĐỘNG */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          {/* Nút Điểm Danh -> Route diem-danh/:idClassSubject */}
                          <button
                            type="button"
                            onClick={() => navigate(`/teacher/diem-danh/${item.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Điểm danh
                          </button>

                          {/* Nút Nhập Điểm -> Route nhap-diem/:idClassSubject (Giữ nguyên màu Indigo) */}
                          <button
                            type="button"
                            onClick={() => navigate(`/teacher/nhap-diem/${item.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Nhập điểm
                          </button>

                          {/* Xem chi tiết lớp */}
                          <button
                            type="button"
                            onClick={() => navigate(`/teacher/lop-hoc/${item.classId || baseClass?.id}`)}
                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                            title="Xem thông tin lớp"
                          >
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default LopHocTeacher
