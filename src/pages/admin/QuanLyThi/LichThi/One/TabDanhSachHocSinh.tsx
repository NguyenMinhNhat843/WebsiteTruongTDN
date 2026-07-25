import { Search, ShieldAlert, ShieldCheck, User } from 'lucide-react'
import { useDotThiOneContext } from './DotThiOneProvider'
import { useState } from 'react'

const TabDanhSachHocSinh = () => {
  const { isLoadingStudents, studentsForExam } = useDotThiOneContext()
  const [searchTerm, setSearchTerm] = useState('')
  const query = searchTerm.toLowerCase()

  const filteredAllStudents = (studentsForExam || []).filter((s) => {
    const fullName = s.fullName || ''
    const studentCode = s.studentCode || ''
    return fullName.toLowerCase().includes(query) || studentCode.toLowerCase().includes(query)
  })
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo Mã HS/SV, Họ tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-semibold tracking-wider text-slate-600 uppercase">
                <th className="px-4 py-3">STT</th>
                <th className="px-4 py-3">Mã SV / Họ tên</th>
                <th className="px-4 py-3 text-center">Điểm TB</th>
                <th className="px-4 py-3 text-center">Số tiết vắng</th>
                <th className="px-4 py-3 text-center">Tỷ lệ vắng</th>
                <th className="px-4 py-3 text-center">Điều kiện dự thi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingStudents ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Đang tải danh sách học sinh...
                  </td>
                </tr>
              ) : filteredAllStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              ) : (
                filteredAllStudents.map((item, index) => {
                  const isEligible = item.examStatus === 'ELIGIBLE'
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{item.fullName}</div>
                            <div className="text-[11px] text-slate-400">{item.studentCode}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">
                        {item.diemTB !== null && item.diemTB !== undefined ? item.diemTB : '-'}
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-slate-600">
                        {item.absentPeriods ?? 0} / {item.totalPeriods ?? 0}
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-slate-600">
                        {item.absentPercentage !== undefined && item.absentPercentage !== null
                          ? `${item.absentPercentage}%`
                          : '0%'}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            <ShieldCheck className="h-3 w-3" />
                            Đủ điều kiện
                          </span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                              <ShieldAlert className="h-3 w-3" />
                              Cấm thi
                            </span>
                            {item.lockReason && (
                              <span className="mt-0.5 text-[10px] text-slate-400 italic">
                                {item.lockReason}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TabDanhSachHocSinh
