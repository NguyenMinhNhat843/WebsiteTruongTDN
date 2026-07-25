import { AlertTriangle, CheckCircle2, Search, User, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useDotThiOneContext } from './DotThiOneProvider'

const TabDanhSachThi = () => {
  const { dotThiDetail } = useDotThiOneContext()
  const [searchTerm, setSearchTerm] = useState('')

  const query = searchTerm.toLowerCase()
  const studentExams = dotThiDetail?.studentExams || []
  const filteredScheduledStudents = studentExams.filter((item) => {
    const student = item.student
    const fullName = student?.fullName || ''
    const studentCode = student?.studentCode || ''
    const sbd = item.identificationNum || ''

    return (
      fullName.toLowerCase().includes(query) ||
      studentCode.toLowerCase().includes(query) ||
      sbd.toLowerCase().includes(query)
    )
  })
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo Mã HS/SV, Họ tên, SBD..."
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
                <th className="px-4 py-3 text-center">SBD</th>
                <th className="px-4 py-3 text-center">Số bàn</th>
                <th className="px-4 py-3 text-center">Có mặt</th>
                <th className="px-4 py-3">Vi phạm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScheduledStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              ) : (
                filteredScheduledStudents.map((item, index) => {
                  const student = item.student
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-400">{index + 1}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {student?.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt=""
                              className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                              <User className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-800">
                              {student?.fullName || 'Chưa cập nhật tên'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {student?.studentCode || `#${item.studentId}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">
                        {item.identificationNum || '-'}
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-slate-600">
                        {item.deskNumber || '-'}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.isAttended ? (
                          <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Có mặt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                            <XCircle className="h-3 w-3 text-slate-400" />
                            Vắng
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {item.isViolated ? (
                          <div className="flex flex-col">
                            <span className="inline-flex w-fit items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              <AlertTriangle className="h-3 w-3" />
                              Có vi phạm
                            </span>
                            {item.violationNote && (
                              <span className="mt-0.5 text-[11px] text-slate-500 italic">
                                {item.violationNote}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
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

export default TabDanhSachThi
