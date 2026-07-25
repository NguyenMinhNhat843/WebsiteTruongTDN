import React, { useState } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
} from 'lucide-react'
import { $api } from '../../../../api/client'

interface ModalDotThiDetailProps {
  isOpen: boolean
  onClose: () => void
  examScheduleId: number | null
}

const ModalDotThiDetail: React.FC<ModalDotThiDetailProps> = ({ isOpen, onClose, examScheduleId }) => {
  // --- States ---
  const [activeTab, setActiveTab] = useState<'info' | 'students'>('info')
  const [searchTerm, setSearchTerm] = useState('')

  // --- Fetch Detail API ---
  const { data: dotThiDetail, isLoading } = $api.useQuery(
    'get',
    '/exam-schedules/{id}',
    {
      params: {
        path: {
          id: examScheduleId as number,
        },
      },
    },
    {
      enabled: isOpen && !!examScheduleId, // Chỉ fetch khi mở modal và có ID
    },
  )

  if (!isOpen) return null

  // Lọc danh sách sinh viên theo từ khóa tìm kiếm
  const studentExams = dotThiDetail?.studentExams || []
  const filteredStudents = studentExams.filter((item) => {
    const student = item.student
    const fullName = student?.fullName || ''
    const studentCode = student?.studentCode || ''
    const sbd = item.identificationNum || ''
    const query = searchTerm.toLowerCase()

    return (
      fullName.toLowerCase().includes(query) ||
      studentCode.toLowerCase().includes(query) ||
      sbd.toLowerCase().includes(query)
    )
  })

  // Thống kê nhanh sinh viên
  const totalStudents = studentExams.length
  const attendedCount = studentExams.filter((s) => s.isAttended).length
  const violatedCount = studentExams.filter((s) => s.isViolated).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* --- HEADER --- */}
        <div className="flex shrink-0 items-center justify-between bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600/30 p-2 text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Chi tiết Đợt thi #{examScheduleId}</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {dotThiDetail?.classSubject?.subject?.subjectName || 'Môn học'} - Lớp:{' '}
                {dotThiDetail?.classSubject?.baseClass?.classCode || 'HP'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- TABS NAVIGATION --- */}
        <div className="flex shrink-0 border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'info'
                ? 'border-indigo-600 bg-white text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'students'
                ? 'border-indigo-600 bg-white text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            Danh sách học sinh dự thi ({totalStudents})
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-slate-500">
              Đang tải thông tin chi tiết đợt thi...
            </div>
          ) : !dotThiDetail ? (
            <div className="py-16 text-center text-xs text-slate-500">
              Không tìm thấy thông tin đợt thi này.
            </div>
          ) : activeTab === 'info' ? (
            /* ================= TAB 1: THÔNG TIN CHUNG ================= */
            <div className="space-y-6">
              {/* Thẻ Lớp HP */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {dotThiDetail.classSubject?.subject?.subjectName || 'Chưa cập nhật tên môn'}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Mã HP:{' '}
                      <strong className="text-slate-700">
                        {dotThiDetail.classSubject?.subject?.subjectCode || 'N/A'}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Lớp HP:{' '}
                      <strong className="text-slate-700">
                        {dotThiDetail.classSubject?.baseClass?.classCode || `#${dotThiDetail.classSubjectId}`}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid thông tin chi tiết */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Thời gian & Ca thi */}
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Thời gian & Đợt thi
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-500">Ngày thi:</span>
                      <strong className="text-sm text-slate-800">
                        {new Date(dotThiDetail.examDate).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-slate-500">Đợt / Lần thi:</span>
                      <strong className="text-sm text-slate-800">Lần {dotThiDetail.examTurn}</strong>
                    </div>

                    <div className="mt-2">
                      <span className="block text-slate-500">Khung giờ:</span>
                      <strong className="text-slate-800">
                        {dotThiDetail.startTime && dotThiDetail.endTime
                          ? `${dotThiDetail.startTime} - ${dotThiDetail.endTime}`
                          : 'Chưa xếp'}
                      </strong>
                    </div>

                    <div className="mt-2">
                      <span className="block text-slate-500">Ca thi:</span>
                      <strong className="text-slate-800">{dotThiDetail.shift || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Phòng thi & Địa điểm */}
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    Địa điểm thi
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-slate-500">Phòng thi:</span>
                      {dotThiDetail.room ? (
                        <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
                          {dotThiDetail.room.roomCode}{' '}
                          {dotThiDetail.room.building ? `(${dotThiDetail.room.building})` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa phân phòng thi</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thống kê học sinh */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Thống kê học sinh
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Tổng sinh viên</div>
                    <div className="mt-0.5 text-lg font-bold text-slate-800">{totalStudents}</div>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <div className="text-xs text-emerald-600">Đã tham gia</div>
                    <div className="mt-0.5 text-lg font-bold text-emerald-700">{attendedCount}</div>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="text-xs text-amber-600">Có vi phạm</div>
                    <div className="mt-0.5 text-lg font-bold text-amber-700">{violatedCount}</div>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {dotThiDetail.note && (
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-xs">
                  <span className="mb-1 block font-semibold text-amber-900">Ghi chú:</span>
                  <p className="text-amber-800">{dotThiDetail.note}</p>
                </div>
              )}
            </div>
          ) : (
            /* ================= TAB 2: DANH SÁCH HỌC SINH ================= */
            <div className="space-y-4">
              {/* Thanh tìm kiếm */}
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

              {/* Bảng danh sách */}
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
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Không tìm thấy học sinh phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((item, index) => {
                          const student = item.student
                          return (
                            <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                              <td className="px-4 py-3 font-medium text-slate-400">{index + 1}</td>

                              {/* Thông tin học sinh */}
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

                              {/* SBD */}
                              <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">
                                {item.identificationNum || '-'}
                              </td>

                              {/* Số bàn */}
                              <td className="px-4 py-3 text-center font-mono text-slate-600">
                                {item.deskNumber || '-'}
                              </td>

                              {/* Điểm danh */}
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

                              {/* Vi phạm */}
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
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-100 px-6 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDotThiDetail
