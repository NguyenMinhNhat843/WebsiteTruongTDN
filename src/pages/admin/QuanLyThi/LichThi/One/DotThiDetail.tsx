import React, { useState, useEffect } from 'react'
import { X, Calendar, Users, FileText, UserCheck, Loader2 } from 'lucide-react'
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
  if (!isOpen) return null

  return (
    <DotThiOneProvider examScheduleId={examScheduleId} isOpen={isOpen} onClose={onClose}>
      <Inner />
    </DotThiOneProvider>
  )
}

type TabType = 'info' | 'allStudents' | 'scheduledStudents'

const Inner: React.FC = () => {
  const { dotThiDetail, isLoading, examScheduleId, isOpen, onClose } = useDotThiOneContext()
  const [activeTab, setActiveTab] = useState<TabType>('info')

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'info', label: 'Thông tin chung', icon: FileText },
    { id: 'allStudents', label: 'Danh sách học sinh', icon: Users },
    { id: 'scheduledStudents', label: 'Danh sách thi', icon: UserCheck },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-xs transition-all duration-200 sm:p-4 md:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-exam-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-200">
        <div className="flex shrink-0 items-center justify-between border-b border-blue-700 bg-blue-700 px-6 py-4 text-white">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/80 text-blue-300 ring-1 ring-blue-700/50">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="modal-exam-title" className="text-base font-semibold tracking-tight text-white">
                  Chi tiết Đợt thi #{examScheduleId ?? 'N/A'}
                </h2>
                <span className="inline-flex items-center rounded bg-blue-900/80 px-2 py-0.5 text-[11px] font-medium text-blue-200 ring-1 ring-blue-700/60">
                  Đang diễn ra
                </span>
              </div>
              <p className="mt-0.5 text-xs text-blue-200/80">
                <span className="font-medium text-white">
                  {dotThiDetail?.classSubject?.subject?.subjectName || 'Môn học'}
                </span>
                {' • '}Lớp:{' '}
                <span className="font-mono font-medium text-blue-100">
                  {dotThiDetail?.classSubject?.baseClass?.classCode || 'HP'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="rounded-lg p-2 text-blue-300 transition-colors hover:bg-blue-900 hover:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- TABS NAVIGATION (Xanh Dương Chuẩn Edu) --- */}
        <div className="flex shrink-0 gap-1 border-b border-slate-200 bg-blue-50/50 px-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex min-h-[42px] items-center gap-2 rounded-t-md border-b-2 px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isActive
                    ? 'border-blue-700 bg-white text-blue-800 shadow-2xs'
                    : 'border-transparent text-slate-600 hover:bg-blue-100/50 hover:text-blue-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* --- BODY --- */}
        <div className="min-h-[320px] flex-1 overflow-y-auto bg-slate-50/60 p-6">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
              <p className="text-xs font-medium text-slate-600">Đang tải thông tin chi tiết đợt thi...</p>
            </div>
          ) : !dotThiDetail ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-2xs">
              <p className="text-sm font-medium text-slate-700">Không tìm thấy thông tin đợt thi</p>
              <p className="mt-1 text-xs text-slate-400">Vui lòng thử lại hoặc chọn một đợt thi khác.</p>
            </div>
          ) : (
            <div className="animate-in fade-in-50 duration-150">
              {activeTab === 'info' && <TabCommonInfo />}
              {activeTab === 'allStudents' && <TabDanhSachHocSinh />}
              {activeTab === 'scheduledStudents' && <TabDanhSachThi />}
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-3.5">
          <p className="text-[11px] text-slate-500">
            Nhấn{' '}
            <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
              Esc
            </kbd>{' '}
            để đóng
          </p>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDotThiDetail
