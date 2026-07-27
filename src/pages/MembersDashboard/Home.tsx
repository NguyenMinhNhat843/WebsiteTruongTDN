import { User, BookOpen, Layers, Shield, RefreshCw, Clock } from 'lucide-react'
import { $api } from '../../api/client'
import { SelectOption } from '../../components/ui/Form/SelectOption'
import { useAppContext } from '../../AppProvider'
import { useSearchParams } from 'react-router-dom'

const MemberDashboard = () => {
  const profile = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).profile : null
  const { hocKysData, isHocKysLoading, currentSemester } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const semesterId = searchParams.get('semesterId') || ''
  const semesterIdNumber = semesterId ? parseInt(semesterId) : undefined
  const semesterSelected = hocKysData?.find((hk) => hk.id === semesterIdNumber) || currentSemester
  const teacherId = profile?.id

  // API thống kê dashboard
  const { data: stats, isLoading: isLoadingStats } = $api.useQuery(
    'get',
    '/staffs/{teacherId}/dashboardstats',
    {
      params: {
        path: {
          teacherId: profile?.id,
        },
        query: {
          semesterId: semesterIdNumber! || currentSemester!.id!,
        },
      },
    },
    {
      enabled: Boolean(teacherId) && Boolean(currentSemester?.id || semesterIdNumber),
    },
  )

  // API lấy định mức giảng dạy năm học hiện tại
  const { data: teachingQuotaData, isLoading: isLoadingQuota } = $api.useQuery(
    'get',
    '/teaching-quotas',
    {
      params: {
        query: {
          staffId: teacherId,
          academicYearId: semesterSelected!.academicYearId!,
        },
      },
    },
    {
      enabled: Boolean(teacherId) && Boolean(semesterSelected!.academicYearId!),
    },
  )

  // Lấy bản ghi định mức đầu tiên
  const quota = teachingQuotaData?.data?.[0]
  const actualHours = quota?.actualHours || 0
  const targetHours = quota?.finalHours || quota?.baseHours || 0
  const percentProgress = targetHours ? Math.min(Math.round((actualHours / targetHours) * 100), 100) : 0

  const semesterOptions =
    hocKysData?.map((hk) => ({
      value: hk.id.toString(),
      label: hk.name,
    })) || []

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ semesterId: e.target.value })
  }

  const isLoading = isLoadingStats || isLoadingQuota

  return (
    <div className="animate-fade-in min-h-screen space-y-6 bg-slate-50/50 p-4 md:p-8">
      {/* HEADER & FILTER */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 md:text-2xl">
            Trang tổng quan giảng dạy
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Xem thống kê và quản lý thông tin lớp học, môn học theo từng học kỳ.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <SelectOption
            label=""
            name="semesterFilter"
            value={semesterId}
            onChange={handleSemesterChange}
            options={[{ value: '', label: 'Chọn học kỳ...' }, ...semesterOptions]}
            disabled={isHocKysLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-100 bg-white py-20 shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu thống kê...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* THÔNG TIN GIÁO VIÊN */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm lg:col-span-1">
            {/* Hiệu ứng nền nhẹ phía sau */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-50/50 transition-transform duration-300 group-hover:scale-110" />

            {/* Avatar mặc định */}
            <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-100">
              <User className="h-10 w-10" />
            </div>

            {/* Thông tin giáo viên */}
            <h2 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
              {stats?.name || 'Chưa cập nhật tên'}
            </h2>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
              <Shield className="h-3 w-3" />
              {stats?.role || 'Giáo viên'}
            </span>

            {/* Chi tiết mã số và phòng ban */}
            <div className="mt-6 w-full space-y-3 border-t border-slate-100 pt-5 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-400">Mã giáo viên</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                  {stats?.maGiaoVien || '---'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-400">Khoa / Phòng ban</span>
                <span className="max-w-[160px] truncate text-right font-semibold text-slate-700">
                  {stats?.department || '---'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION THỐNG KÊ (STATS CARDS) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
            {/* Thẻ 1: Tổng số lớp chủ nhiệm */}
            <div className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-200/80 hover:shadow-md active:scale-[0.99]">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Lớp chủ nhiệm
                  </span>
                  <h3 className="font-mono text-4xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                    {stats?.totalClasses ?? 0}
                  </h3>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shadow-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Layers className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 border-t border-slate-50 pt-3 text-xs font-medium text-slate-400">
                Số lớp học đang phụ trách quản lý ổn định nền nếp.
              </div>
            </div>

            {/* Thẻ 2: Tổng số môn học giảng dạy */}
            <div className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-200/80 hover:shadow-md active:scale-[0.99]">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Môn giảng dạy
                  </span>
                  <h3 className="font-mono text-4xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-emerald-600">
                    {stats?.totalSubjects ?? 0}
                  </h3>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 border-t border-slate-50 pt-3 text-xs font-medium text-slate-400">
                Số học phần chuyên môn được phân công đứng lớp.
              </div>
            </div>

            {/* Thẻ 3: Định mức giờ dạy trong năm (Rộng 2 cột) */}
            <div className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-200/80 hover:shadow-md sm:col-span-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Định mức giờ dạy (Năm học)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-mono text-3xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-amber-600">
                      {actualHours} / {targetHours}h
                    </h3>
                    {quota?.reductionPercent ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                        Giảm {quota.reductionPercent}%
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600 shadow-sm transition-all duration-300 group-hover:bg-amber-600 group-hover:text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Tiến độ hoàn thành</span>
                  <span className={percentProgress >= 100 ? 'font-bold text-emerald-600' : 'text-amber-600'}>
                    {percentProgress}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentProgress >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-xs font-medium text-slate-400">
                <span>Số giờ giảng dạy thực tế tích lũy trong năm học này.</span>
                <span className="font-semibold text-slate-500">Định mức gốc: {quota?.baseHours ?? 0}h</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberDashboard
