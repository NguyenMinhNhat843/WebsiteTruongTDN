import { Award, BookOpen, GraduationCap } from 'lucide-react'
import { useHoSoTuyenSinhOneContext } from './HoSoTuyenSinhOneProvider'

const TabAdmissionInfo = () => {
  const { profile, admissionCampaign, admissionCampaignMajor, groupedTranscriptScores } =
    useHoSoTuyenSinhOneContext()
  return (
    <div>
      {/* Program & Campaign info */}
      <div className="rounded-2xl border border-slate-100 bg-indigo-50/30 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
          <GraduationCap className="h-4 w-4" /> Đợt & Ngành Đăng Ký Xét Tuyển
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-slate-500">Đợt tuyển sinh:</span>
            <p className="font-semibold text-slate-800">
              {admissionCampaign?.name || 'N/A'} ({admissionCampaign?.code})
            </p>
          </div>
          <div>
            <span className="text-slate-500">Ngành xét tuyển:</span>
            <p className="font-semibold text-slate-800">
              {admissionCampaignMajor?.major?.majorName} ({admissionCampaignMajor?.major?.majorCode})
            </p>
          </div>
          <div>
            <span className="text-slate-500">Tổ hợp môn:</span>
            <p className="font-medium text-slate-800">
              {admissionCampaignMajor?.subjectCombination?.name || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Scores summary */}
      <div className="rounded-2xl border border-slate-100 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
          <Award className="h-4 w-4" /> Kết Quả Điểm Số
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[11px] text-slate-500">Điểm thi/Học bạ gốc</span>
            <p className="text-sm font-bold text-slate-800">{profile?.avgSubjectScore ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Transcript details */}
      {Object.keys(groupedTranscriptScores).length > 0 && (
        <div className="rounded-2xl border border-slate-100 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
            <BookOpen className="h-4 w-4" /> Chi Tiết Điểm Học Bạ
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(groupedTranscriptScores).map(([grade, items]) => (
              <div key={grade} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="mb-2 block font-bold text-slate-700">Lớp {grade}</span>
                <div className="space-y-1.5">
                  {items.map((scoreItem) => (
                    <div
                      key={scoreItem.id}
                      className="flex justify-between border-b border-slate-100 pb-1 text-xs"
                    >
                      <span className="text-slate-600">{scoreItem.subjectCode}</span>
                      <span className="font-bold text-slate-800">{scoreItem.score} điểm</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TabAdmissionInfo
