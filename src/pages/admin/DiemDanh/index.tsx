import { useQueryClient } from '@tanstack/react-query'
import { $api } from '../../../api/client'
import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  UserCheck,
  Search,
  BookOpen,
  User,
  Check,
  CalendarX,
  ArrowRight,
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { AttendanceStatus } from '../../../api/enum'

// 1. Hook lấy Ma trận điểm danh (Attendance Sheet)
const useAttendanceSheet = (classSubjectId: number) => {
  return $api.useQuery('get', '/attendance/sheet/{classSubjectId}', {
    params: {
      path: { classSubjectId },
    },
    enabled: !!classSubjectId,
  })
}

// 2. Hook điểm danh hàng loạt cho cả lớp (Bulk Attendance)
const useBulkAttendance = () => {
  const queryClient = useQueryClient()

  return $api.useMutation('post', '/attendance/bulk', {
    onSuccess: (_, variables) => {
      // Invalidate để refetch lại ma trận điểm danh sau khi lưu thành công
      queryClient.invalidateQueries({
        queryKey: [
          'get',
          '/attendance/sheet/{classSubjectId}',
          { params: { path: { classSubjectId: variables?.body.classSubjectId } } },
        ],
      })
    },
  })
}

export const DiemDanhSheet = () => {
  const navigate = useNavigate()
  const { classSubjectId } = useParams<{ classSubjectId: string }>()
  const classSubjectIdNum = classSubjectId ? parseInt(classSubjectId, 10) : null

  const { data: sheetData, isLoading } = useAttendanceSheet(classSubjectIdNum!)
  const bulkAttendanceMutation = useBulkAttendance()

  // --- States ---
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // State lưu tạm các chỉnh sửa điểm danh trên UI trước khi bấm Lưu
  // Structure: { [studentId]: { status: AttendanceStatus, note?: string } }
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, { status: AttendanceStatus; note?: string }>
  >({})

  // Tự động chọn buổi học đầu tiên khi load dữ liệu xong
  useEffect(() => {
    if (sheetData?.schedules && sheetData.schedules.length > 0 && !selectedScheduleId) {
      setSelectedScheduleId(sheetData.schedules[0].scheduleDetailId)
    }
  }, [sheetData, selectedScheduleId])

  // Reset pending changes khi đổi buổi học
  useEffect(() => {
    setPendingChanges({})
  }, [selectedScheduleId])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="font-medium">Đang tải bảng điểm danh...</span>
        </div>
      </div>
    )
  }

  if (!sheetData) return null

  const { info, schedules, students } = sheetData

  // --- KIỂM TRA NẾU CHƯA CÓ BUỔI HỌC / KẾ HOẠCH GIẢNG DẠY ---
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <CalendarX className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">Chưa có buổi học nào được thiết lập!</h3>
        <p className="mt-1 max-w-md text-xs text-slate-500">
          Hình như bạn chưa thiết lập kế hoạch giảng dạy cho lớp môn học này. Hãy tạo kế hoạch giảng dạy để có
          thể bắt đầu điểm danh.
        </p>
        <button
          onClick={() => navigate('/admin/dao-tao/tien-do-dao-tao')}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Thiết lập kế hoạch giảng dạy
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // Lọc danh sách sinh viên theo từ khóa tìm kiếm
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Lấy ra buổi học đang được chọn trên Toolbar
  const currentSchedule = schedules.find((s) => s.scheduleDetailId === selectedScheduleId)

  // Lấy trạng thái điểm danh hiện tại của 1 sinh viên (kết hợp pending local state)
  const getStudentStatus = (studentId: number, scheduleDetailId: number) => {
    if (scheduleDetailId === selectedScheduleId && pendingChanges[studentId]) {
      return pendingChanges[studentId].status
    }
    return students.find((s) => s.studentId === studentId)?.attendances?.[scheduleDetailId]?.status
  }

  // Handler cập nhật điểm danh tạm thời vào Pending State
  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setPendingChanges((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  // Đánh dấu tất cả sinh viên là "Có mặt" cho buổi đang chọn
  const handleMarkAllPresent = () => {
    if (!selectedScheduleId) return
    const newPending: Record<number, { status: AttendanceStatus }> = {}
    filteredStudents.forEach((s) => {
      newPending[s.studentId] = { status: 'PRESENT' }
    })
    setPendingChanges(newPending)
  }

  // Lưu điểm danh hàng loạt về Backend
  const handleSaveBulk = async () => {
    if (!selectedScheduleId) return

    const attendancesPayload = Object.entries(pendingChanges).map(([studentId, item]) => ({
      studentId: Number(studentId),
      status: item.status,
      note: item.note ?? null,
    }))

    if (attendancesPayload.length === 0) return

    await bulkAttendanceMutation.mutateAsync(
      {
        body: {
          classSubjectId: Number(classSubjectId),
          scheduleDetailId: selectedScheduleId,
          attendances: attendancesPayload,
        },
      },
      {
        onSuccess: () => {
          toast.success('Lưu điểm danh thành công!')
          setPendingChanges({})
        },
        onError: () => {
          toast.error('Lưu điểm danh thất bại. Vui lòng thử lại.')
        },
      },
    )

    setPendingChanges({})
  }

  return (
    <div className="space-y-6 rounded-2xl bg-slate-50 p-6">
      {/* HEADER THÔNG TIN LỚP HỌC */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {info.semesterName}
            </span>
            <h1 className="text-xl font-bold text-slate-800">{info.subjectName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Lớp: {info.className || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> CBGD: {info.teacherName || 'Chưa phân công'}
            </span>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Tên hoặc MSSV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* QUICK ACTION TOOLBAR BƯỚC ĐIỂM DANH */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Đang chọn buổi:</span>
          <select
            value={selectedScheduleId || ''}
            onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {schedules.map((sch) => (
              <option key={sch.scheduleDetailId} value={sch.scheduleDetailId}>
                Tuần {sch.weekNumber} - {sch.dayOfWeek} (
                {sch.studyDate ? new Date(sch.studyDate).toLocaleDateString('vi-VN') : 'N/A'})
              </option>
            ))}
          </select>

          {currentSchedule && (
            <span className="text-xs text-slate-500">
              (Tiết {currentSchedule.startPeriod} - {currentSchedule.endPeriod} | Phòng:{' '}
              {currentSchedule.roomCode || 'N/A'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          >
            <UserCheck className="h-4 w-4" /> Điểm danh tất cả Có mặt
          </button>

          {Object.keys(pendingChanges).length > 0 && (
            <button
              onClick={() => setPendingChanges({})}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Hủy thay đổi
            </button>
          )}

          <button
            onClick={handleSaveBulk}
            disabled={Object.keys(pendingChanges).length === 0 || bulkAttendanceMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {bulkAttendanceMutation.isPending ? 'Đang lưu...' : 'Lưu điểm danh'}
          </button>
        </div>
      </div>

      {/* MA TRẬN BẢNG ĐIỂM DANH */}
      <div className="custom-scrollbar overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-[11px] tracking-wider text-slate-700 uppercase">
            <tr>
              <th className="sticky left-0 z-20 w-[48px] min-w-[48px] bg-slate-100 px-2 py-3 text-center">
                STT
              </th>
              <th className="sticky left-[48px] z-20 w-[112px] min-w-[112px] bg-slate-100 px-3 py-3">MSSV</th>
              <th className="sticky left-[160px] z-20 min-w-[180px] bg-slate-100 px-3 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Họ và tên
              </th>
              {schedules.map((sch) => {
                const isSelected = sch.scheduleDetailId === selectedScheduleId
                return (
                  <th
                    key={sch.scheduleDetailId}
                    onClick={() => setSelectedScheduleId(sch.scheduleDetailId)}
                    className={`min-w-[70px] cursor-pointer border-l border-slate-200 p-2 text-center transition-colors ${
                      isSelected ? 'bg-blue-100 font-bold text-blue-800' : 'hover:bg-slate-200'
                    }`}
                  >
                    <div>T{sch.weekNumber}</div>
                    <div className="text-[10px] font-normal text-slate-500">
                      {sch.studyDate
                        ? new Date(sch.studyDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                          })
                        : ''}
                    </div>
                  </th>
                )
              })}

              <th className="border-l-2 border-slate-300 bg-slate-100 px-3 py-3 text-center font-bold">
                Vắng (Tiết)
              </th>
              <th className="bg-slate-100 px-3 py-3 text-center font-bold">% Vắng</th>
              <th className="bg-slate-100 px-3 py-3 text-center font-bold">Xét thi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student, idx) => {
              const summary = student.summary

              return (
                <tr key={student.studentId} className="hover:bg-slate-50/80">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2.5 text-center font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="sticky left-12 z-10 bg-white px-3 py-2.5 font-semibold text-slate-700">
                    {student.studentCode}
                  </td>
                  <td className="sticky left-40 z-10 bg-white px-3 py-2.5 font-medium text-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {student.fullName}
                  </td>

                  {schedules.map((sch) => {
                    const status = getStudentStatus(student.studentId, sch.scheduleDetailId)
                    const isEditingCell = sch.scheduleDetailId === selectedScheduleId

                    return (
                      <td
                        key={sch.scheduleDetailId}
                        className={`border-l border-slate-100 p-1 text-center ${
                          isEditingCell ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {isEditingCell ? (
                          <div className="flex justify-center gap-1">
                            <button
                              title="Có mặt"
                              onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                              className={`rounded p-1 ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              title="Vắng mặt"
                              onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                              className={`rounded p-1 ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600'
                              }`}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            {status === 'PRESENT' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            {status === 'ABSENT' && <XCircle className="h-4 w-4 text-rose-500" />}
                            {!status && <span className="text-slate-300">-</span>}
                          </div>
                        )}
                      </td>
                    )
                  })}

                  <td className="border-l-2 border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">
                    {summary?.totalAbsentPeriods ?? 0} / {summary?.totalPeriods ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center font-medium">
                    <span
                      className={`${
                        (summary?.absentPercentage || 0) > 20 ? 'font-bold text-rose-600' : 'text-slate-600'
                      }`}
                    >
                      {summary?.absentPercentage?.toFixed(1) ?? 0}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {summary?.examStatus === 'ELIGIBLE' && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Đủ điều kiện
                      </span>
                    )}
                    {summary?.examStatus === 'INELIGIBLE' && (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                        Cấm thi
                      </span>
                    )}
                    {(!summary || summary?.examStatus === 'PENDING') && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        Chưa xét
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
