import { useDotThiOneContext } from './DotThiOneProvider'
import { BookOpen, Clock, MapPin, Users } from 'lucide-react'

const TabCommonInfo = () => {
  const { dotThiDetail } = useDotThiOneContext()

  // Filter cho Tab "Danh sách thí sinh xếp lịch"
  const studentExams = dotThiDetail?.studentExams || []

  // Thống kê nhanh sinh viên
  const totalScheduledStudents = studentExams.length
  const attendedCount = studentExams.filter((s) => s.isAttended).length
  const violatedCount = studentExams.filter((s) => s.isViolated).length

  if (!dotThiDetail) return null

  return (
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
            <div className="text-xs text-slate-500">Đã xếp lịch thi</div>
            <div className="mt-0.5 text-lg font-bold text-slate-800">{totalScheduledStudents}</div>
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
  )
}

export default TabCommonInfo
