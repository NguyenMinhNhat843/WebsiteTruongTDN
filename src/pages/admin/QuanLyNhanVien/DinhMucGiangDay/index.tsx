import { useEffect, useState } from 'react'
import { Plus, Edit2, AlertCircle, Calendar, RefreshCw, UserCheck } from 'lucide-react'
import { $api } from '../../../../api/client'
import ModalPhanBoDinhMuc from './ModalPhanBoDinhMuc'
import type { TeachingUotaDto } from '../../../../api/entity'
import PageShell from '../../../../components/ui/PageShell'
import ButtonAction from '../../../../components/ui/ButtonAction'
import { SelectOption } from '../../../../components/ui/Form/SelectOption'
import SearchInput from '../../../../components/ui/Form/SearchInput'

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
    <PageShell
      title="Quản Lý Định Mức Giảng Dạy"
      sub="Phân bổ và theo dõi tiến độ hoàn thành giờ dạy của từng giáo viên"
      icon={UserCheck}
      renderRight={
        <div className="flex gap-4">
          <SelectOption
            icon={<Calendar />}
            placeholder="-- Chọn năm học --"
            value={selectedAcademicYearId}
            onChange={(val) => setSelectedAcademicYearId(Number(val))}
            options={
              academicYears?.data?.map((year) => ({
                value: year.id,
                label: `${year.code} ${year.isCurrent ? '(Hiện tại)' : ''}`,
              })) || []
            }
            containerClassName="w-full sm:w-56"
            className="font-semibold text-slate-700"
          />

          <ButtonAction
            label="Đồng bộ giờ dạy"
            loading={isSyncing}
            icon={<RefreshCw size={16} />}
            onClick={handleSyncQuotas}
            disabled={isSyncing || !selectedAcademicYearId}
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* THANH TÌM KIẾM */}
        <div className="w-full sm:w-94">
          <SearchInput
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            placeholder="Tìm tên giáo viên..."
          />
        </div>

        {/* BẢNG DANH SÁCH GIÁO VIÊN & ĐỊNH MỨC */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {isLoading ? (
            <div className="py-16 text-center text-sm font-medium text-slate-400">
              <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              <p>Đang tải dữ liệu định mức & danh sách...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    <th className="px-5 py-3.5">Giáo viên</th>
                    <th className="px-4 py-3.5">Mã GV</th>
                    <th className="px-4 py-3.5 text-center">Định mức chuẩn</th>
                    <th className="px-4 py-3.5 text-center">Giảm trừ (%)</th>
                    <th className="px-4 py-3.5 text-center">Định mức sau giảm</th>
                    <th className="px-5 py-3.5">Thực hiện / Định mức</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStaffList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy dữ liệu giáo viên phù hợp
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
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 ring-2 ring-white">
                                {staff.fullName?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate font-semibold text-slate-800">
                                  {staff.fullName}
                                </span>
                                <span className="block truncate text-[11px] text-slate-400">
                                  {staff.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                            {staff.staffCode || '-'}
                          </td>

                          {/* Định mức cơ bản */}
                          <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                            {quota ? `${quota.baseHours}h` : '-'}
                          </td>

                          {/* Tỷ lệ giảm trừ */}
                          <td className="px-4 py-3.5 text-center">
                            {quota?.reductionPercent ? (
                              <span className="inline-flex items-center rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                                -{quota.reductionPercent}%
                              </span>
                            ) : (
                              <span className="text-slate-400">0%</span>
                            )}
                          </td>

                          {/* Định mức thực tế (sau giảm trừ) */}
                          <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                            {quota ? `${quota.finalHours}h` : '-'}
                          </td>

                          {/* Thanh Tiến Độ Progress Bar */}
                          <td className="min-w-[200px] px-5 py-3.5">
                            {quota ? (
                              <div className="space-y-1.5">
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
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      percentProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${percentProgress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Chưa phân bổ
                              </span>
                            )}
                          </td>

                          {/* Nút Phân bổ / Cập nhật bằng ButtonAction */}
                          <td className="px-5 py-3.5 text-right">
                            {quota ? (
                              <ButtonAction
                                size="sm"
                                variant="outline"
                                icon={<Edit2 size={14} />}
                                onClick={() =>
                                  setSelectedStaff({
                                    id: staff.id!,
                                    name: staff.fullName,
                                  })
                                }
                              >
                                Cập nhật
                              </ButtonAction>
                            ) : (
                              <ButtonAction
                                size="sm"
                                variant="primary"
                                icon={<Plus size={14} />}
                                onClick={() =>
                                  setSelectedStaff({
                                    id: staff.id!,
                                    name: staff.fullName,
                                  })
                                }
                              >
                                Phân bổ
                              </ButtonAction>
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
    </PageShell>
  )
}
