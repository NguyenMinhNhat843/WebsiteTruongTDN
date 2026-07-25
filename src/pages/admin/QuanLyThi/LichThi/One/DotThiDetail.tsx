import React, { useState } from 'react'
import { X, Calendar, Users, FileText, UserCheck } from 'lucide-react'
import { DotThiOneProvider, useDotThiOneContext } from './DotThiOneProvider'
import TabCommonInfo from './TabCommonInfo'
import TabDanhSachHocSinh from './TabDanhSachHocSinh'
import TabDanhSachThi from './TabDanhSachThi'

interface ModalDotThiDetailProps {
  isOpen: boolean
  onClose: () => void
  examScheduleId: number | null
}

const ModalDotThiDetail: React.FC<ModalDotThiDetailProps> = ({ isOpen, onClose, examScheduleId }) => {
  return (
    <DotThiOneProvider examScheduleId={examScheduleId} isOpen={isOpen} onClose={onClose}>
      <Inner />
    </DotThiOneProvider>
  )
}

const Inner = () => {
  const { dotThiDetail, isLoading, examScheduleId, isOpen, onClose } = useDotThiOneContext()
  const [activeTab, setActiveTab] = useState<'info' | 'allStudents' | 'scheduledStudents'>('info')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
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
            onClick={() => setActiveTab('allStudents')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'allStudents'
                ? 'border-indigo-600 bg-white text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            Danh sách học sinh
          </button>

          <button
            onClick={() => setActiveTab('scheduledStudents')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'scheduledStudents'
                ? 'border-indigo-600 bg-white text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Danh sacsh thi
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
            <TabCommonInfo />
          ) : activeTab === 'allStudents' ? (
            <TabDanhSachHocSinh />
          ) : (
            <TabDanhSachThi />
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
