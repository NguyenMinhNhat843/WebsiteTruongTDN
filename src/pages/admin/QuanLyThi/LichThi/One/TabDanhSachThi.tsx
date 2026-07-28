import { CheckCircle2, Loader2, Save, Search, User, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDotThiOneContext } from './DotThiOneProvider'
import { $api } from '../../../../../api/client'
import type { components } from '../../../../../api/v1'
import { toast } from 'sonner'

export type UpdateBulkExamScoreDto = components['schemas']['UpdateBulkExamScoreDto']
export type UpdateAttendanceDto = components['schemas']['UpdateAttendanceDto']

const TabDanhSachThi = () => {
  const { dotThiDetail, refetchDotThiDetail: refetch } = useDotThiOneContext()
  const [searchTerm, setSearchTerm] = useState('')

  // State local quản lý trạng thái điểm danh
  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>({})
  // State local quản lý điểm thi
  const [scoresMap, setScoresMap] = useState<Record<number, string>>({})

  const studentExams = dotThiDetail?.studentExams || []

  // Đồng bộ dữ liệu ban đầu từ API vào state local
  useEffect(() => {
    if (studentExams.length > 0) {
      const initialAttendance: Record<number, boolean> = {}
      const initialScores: Record<number, string> = {}

      studentExams.forEach((item) => {
        initialAttendance[item.id] = Boolean(item.isAttended)
        initialScores[item.id] =
          item.examScore !== null && item.examScore !== undefined ? String(item.examScore) : ''
      })

      setAttendanceMap(initialAttendance)
      setScoresMap(initialScores)
    }
  }, [dotThiDetail])

  const query = searchTerm.toLowerCase()
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

  // Điểm danh thi Mutation
  const { mutate: updateAttendance, isPending: isUpdatingAttendance } = $api.useMutation(
    'patch',
    '/student-exam-details/attendance',
    {
      onSuccess: () => {
        refetch?.()
        toast.success('Cập nhật điểm danh thành công')
      },
      onError: () => {
        toast.error('Cập nhật điểm danh thất bại')
      },
    },
  )

  // Nhập điểm thi Mutation
  const { mutate: updateScores, isPending: isUpdatingScores } = $api.useMutation(
    'patch',
    '/student-exam-details/scores',
    {
      onSuccess: () => {
        refetch?.()
        toast.success('Cập nhật điểm thi thành công')
      },
      onError: () => {
        toast.error('Cập nhật điểm thi thất bại')
      },
    },
  )

  // 1. Toggle điểm danh trên local state (Chỉ cho phép thay đổi nếu chưa có điểm thi)
  const handleToggleAttendanceLocal = (id: number) => {
    const currentScore = scoresMap[id]
    if (currentScore !== undefined && currentScore !== null && currentScore !== '') {
      toast.warning('Học sinh đã có điểm thi, không thể thay đổi trạng thái điểm danh')
      return
    }

    setAttendanceMap((prev) => {
      const newStatus = !prev[id]

      // Nếu đổi thành Vắng mặt, xóa sạch điểm thi trên local
      if (!newStatus) {
        setScoresMap((scorePrev) => ({ ...scorePrev, [id]: '' }))
      }

      return { ...prev, [id]: newStatus }
    })
  }

  // 2. Bấm nút "Lưu điểm danh"
  const handleSaveAttendance = () => {
    const attendancesPayload = Object.entries(attendanceMap).map(([id, isAttended]) => ({
      studentExamDetailId: Number(id),
      status: isAttended ? ('PRESENT' as const) : ('ABSENT' as const),
    }))

    if (attendancesPayload.length === 0) return

    updateAttendance({
      body: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attendances: attendancesPayload as any,
      },
    })
  }

  // 3. Thay đổi điểm thi trên input (Chỉ cho phép thay đổi nếu đã được điểm danh "Có mặt")
  const handleScoreChange = (id: number, value: string) => {
    const isAttended = attendanceMap[id]
    if (!isAttended) {
      toast.warning('Vui lòng điểm danh "Có mặt" trước khi nhập điểm thi')
      return
    }

    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) <= 10)) {
      setScoresMap((prev) => ({ ...prev, [id]: value }))
    }
  }

  // 4. Bấm nút "Lưu điểm thi"
  const handleSaveScores = () => {
    const scoresToSubmit = Object.entries(scoresMap)
      .filter(([id, val]) => {
        const isAttended = attendanceMap[Number(id)]
        return isAttended && val !== '' && !isNaN(Number(val))
      })
      .map(([id, val]) => ({
        studentExamDetailId: Number(id),
        examScore: Number(val),
      }))

    if (scoresToSubmit.length === 0) return

    updateScores({
      body: {
        scores: scoresToSubmit,
      },
    })
  }

  // Format ngày sinh
  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Thanh tìm kiếm */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã HS/SV, Họ tên, SBD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Các nút bấm lưu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isUpdatingAttendance || isUpdatingScores}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 disabled:opacity-50"
          >
            {isUpdatingAttendance ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu điểm danh
          </button>

          <button
            type="button"
            onClick={handleSaveScores}
            disabled={isUpdatingScores || isUpdatingAttendance}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {isUpdatingScores ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu điểm thi
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-semibold tracking-wider text-slate-600 uppercase">
                <th className="px-4 py-3 text-center">STT</th>
                <th className="px-4 py-3">Mã SV / Họ tên</th>
                <th className="px-4 py-3 text-center">Ngày sinh (DOB)</th>
                <th className="px-4 py-3 text-center">Điểm danh thi</th>
                <th className="px-4 py-3 text-center">Điểm thi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScheduledStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              ) : (
                filteredScheduledStudents.map((item, index) => {
                  const student = item.student
                  const isAttended = attendanceMap[item.id] ?? false
                  const hasScore =
                    scoresMap[item.id] !== undefined &&
                    scoresMap[item.id] !== null &&
                    scoresMap[item.id] !== ''

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-center font-medium text-slate-400">{index + 1}</td>

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

                      <td className="px-4 py-3 text-center font-mono text-slate-600">
                        {formatDate(student?.dob)}
                      </td>

                      {/* Nút toggle trạng thái điểm danh */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAttendanceLocal(item.id)}
                          disabled={hasScore}
                          title={hasScore ? 'Không thể thay đổi điểm danh khi đã có điểm thi' : ''}
                          className="inline-flex transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                        >
                          {isAttended ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Có mặt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                              <XCircle className="h-3.5 w-3.5 text-slate-400" />
                              Vắng mặt
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Ô nhập điểm thi */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder={isAttended ? '0 - 10' : 'Vắng thi'}
                          disabled={!isAttended || isUpdatingScores}
                          value={scoresMap[item.id] ?? ''}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                          className="w-20 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-center text-xs font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        />
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
