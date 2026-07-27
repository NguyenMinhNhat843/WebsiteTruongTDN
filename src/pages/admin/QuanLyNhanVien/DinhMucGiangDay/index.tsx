import { useEffect, useState } from 'react'
import { Plus, Edit2, Search, AlertCircle, Calendar, RefreshCw } from 'lucide-react'
import { $api } from '../../../../api/client'
import ModalPhanBoDinhMuc from './ModalPhanBoDinhMuc'
import type { TeachingUotaDto } from '../../../../api/entity'

export default function TeachingQuotaManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | undefined>()

  // State quản lý việc mở modal phân bổ
  const [selectedStaff, setSelectedStaff] = useState<{
    id: number
    name: string
  } | null>(null)

  // 1. Lấy danh sách năm học
  const { data: academicYears, isLoading: isLoadingYears } = $api.useQuery('get', '/academic-years')

  // Tự động chọn Năm học hiện tại (isCurrent = true) khi dữ liệu tải xong
  useEffect(() => {
    if (academicYears?.data && academicYears.data.length > 0) {
      const currentYear = academicYears.data.find((y) => y.isCurrent)
      if (currentYear) {
        setSelectedAcademicYearId(currentYear.id)
      } else {
        setSelectedAcademicYearId(academicYears.data[0].id)
      }
    }
  }, [academicYears])

  // 2. Lấy danh sách định mức từ API /teaching-quotas
  const {
    data: quotasData,
    isLoading: isLoadingQuotas,
    refetch: refetchQuotas,
  } = $api.useQuery('get', '/teaching-quotas', {
    params: {
      query: {
        ...(selectedAcademicYearId ? { academicYearId: selectedAcademicYearId } : {}),
      },
    },
  })

  // 3. Lấy danh sách nhân viên / giáo viên
  const { data: staffData, isLoading: isLoadingStaff } = $api.useQuery('get', '/staffs', {
    params: {
      query: {
        employeeRole: 'TEACHER',
      },
    },
  })

  // 4. API đồng bộ định mức giảng dạy cho tất cả giáo viên trong năm
  const { mutate: syncQuotas, isPending: isSyncing } = $api.useMutation(
    'post',
    '/teaching-quotas/sync-actual-hours/academic-year/{academicYearId}',
    {
      onSuccess: () => {
        refetchQuotas()
      },
    },
  )

  // Trực tiếp kích hoạt đồng bộ
  const handleSyncQuotas = () => {
    if (!selectedAcademicYearId) return
    syncQuotas({
      params: {
        path: {
          academicYearId: selectedAcademicYearId,
        },
      },
    })
  }

  const isLoading = isLoadingQuotas || isLoadingStaff || isLoadingYears

  // Map dữ liệu Quota theo StaffId
  const quotaMap = new Map<number, TeachingUotaDto>()
  if (quotasData?.data) {
    quotasData.data.forEach((q: TeachingUotaDto) => {
      quotaMap.set(q.staffId, q)
    })
  }

  // Lọc danh sách nhân viên theo từ khóa tìm kiếm
  const filteredStaffList = (staffData || [])
    .filter((staff) => staff.employeeRole === 'TEACHER')
    .filter((staff) => staff.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6 p-6">
      {/* HEADER & THANH CÔNG CỤ */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản Lý Định Mức Giảng Dạy</h1>
          <p className="text-xs text-slate-500">
            Phân bổ và theo dõi tiến độ hoàn thành giờ dạy của từng giáo viên
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* BỘ LỌC NĂM HỌC */}
          <div className="relative w-full sm:w-56">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedAcademicYearId || ''}
              onChange={(e) => setSelectedAcademicYearId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                -- Chọn năm học --
              </option>
              {academicYears?.data?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.code} {year.isCurrent ? '(Hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* THANH TÌM KIẾM */}
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* NÚT ĐỒNG BỘ ĐỊNH MỨC */}
          <button
            onClick={handleSyncQuotas}
            disabled={isSyncing || !selectedAcademicYearId}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ giờ dạy'}
          </button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH GIÁO VIÊN & ĐỊNH MỨC */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Đang tải dữ liệu định mức & danh sách...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-4 py-3">Giáo viên</th>
                  <th className="px-4 py-3">Mã GV</th>
                  <th className="px-4 py-3 text-center">Định mức chuẩn</th>
                  <th className="px-4 py-3 text-center">Giảm trừ (%)</th>
                  <th className="px-4 py-3 text-center">Định mức sau giảm</th>
                  <th className="px-4 py-3">Thực hiện / Định mức</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStaffList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không tìm thấy dữ liệu giáo viên
                    </td>
                  </tr>
                ) : (
                  filteredStaffList.map((staff) => {
                    const quota = quotaMap.get(staff.id!)

                    const actualHours = quota?.actualHours || 0
                    const targetHours = quota?.finalHours || quota?.baseHours || 0
                    const percentProgress = targetHours
                      ? Math.min(Math.round((actualHours / targetHours) * 100), 100)
                      : 0

                    return (
                      <tr key={staff.id} className="transition-colors hover:bg-slate-50/80">
                        {/* Tên & Avatar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                              {staff.fullName?.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-semibold text-slate-800">{staff.fullName}</span>
                              <span className="text-[11px] text-slate-400">{staff.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {staff.staffCode || '-'}
                        </td>

                        {/* Định mức cơ bản */}
                        <td className="px-4 py-3 text-center font-medium text-slate-700">
                          {quota ? `${quota.baseHours}h` : '-'}
                        </td>

                        {/* Tỷ lệ giảm trừ */}
                        <td className="px-4 py-3 text-center">
                          {quota?.reductionPercent ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                              -{quota.reductionPercent}%
                            </span>
                          ) : (
                            <span className="text-slate-400">0%</span>
                          )}
                        </td>

                        {/* Định mức thực tế (sau giảm trừ) */}
                        <td className="px-4 py-3 text-center font-bold text-slate-800">
                          {quota ? `${quota.finalHours}h` : '-'}
                        </td>

                        {/* Thanh Tiến Độ Progress Bar */}
                        <td className="min-w-[180px] px-4 py-3">
                          {quota ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="font-semibold text-slate-700">
                                  {actualHours} / {targetHours}h
                                </span>
                                <span
                                  className={`text-[11px] font-bold ${
                                    percentProgress >= 100 ? 'text-emerald-600' : 'text-blue-600'
                                  }`}
                                >
                                  {percentProgress}%
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    percentProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${percentProgress}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-500">
                              <AlertCircle className="h-3.5 w-3.5" /> Chưa phân bổ
                            </span>
                          )}
                        </td>

                        {/* Nút Phân bổ / Cập nhật */}
                        <td className="px-4 py-3 text-right">
                          {quota ? (
                            <button
                              onClick={() =>
                                setSelectedStaff({
                                  id: staff.id!,
                                  name: staff.fullName,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-500" /> Cập nhật
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setSelectedStaff({
                                  id: staff.id!,
                                  name: staff.fullName,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                              <Plus className="h-3.5 w-3.5" /> Phân bổ
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PHÂN BỔ ĐỊNH MỨC MỚI */}
      {selectedStaff && (
        <ModalPhanBoDinhMuc
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          staffId={selectedStaff.id}
          staffName={selectedStaff.name}
          academicYearId={selectedAcademicYearId}
          onSuccess={() => refetchQuotas()}
        />
      )}
    </div>
  )
}
