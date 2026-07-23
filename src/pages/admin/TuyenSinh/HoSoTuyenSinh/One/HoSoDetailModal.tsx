import { useState } from 'react'
import { X, User, Loader2, History, GraduationCap } from 'lucide-react'
import { APPLICATION_STATUS_MAP } from '../../../../../api/enum'
import type { ApplicationStatusEnum } from '../../../../../api/enum'
import { HoSoTuyenSinhOneProvider, useHoSoTuyenSinhOneContext } from './HoSoTuyenSinhOneProvider'
import TabCommonInfo from './TabCommonInfo'
import TabAdmissionInfo from './TabAdmissionInfo'
import TabAdmissionDocument from './TabAdmissionDocument'
import TabNhatKyHoSo from './TabNhatKyHoSo'

interface Props {
  profileId: number
  onClose: () => void
  onRefetch: () => void
}
export const HoSoDetailModal = ({ profileId, onClose }: Props) => {
  return (
    <HoSoTuyenSinhOneProvider profileId={profileId} onClose={onClose}>
      <Inner />
    </HoSoTuyenSinhOneProvider>
  )
}

export const Inner = () => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'ADMISSION' | 'DOCUMENT' | 'LOGS'>('INFO')
  const { handleStatusChange, isLoading, isUpdatingStatus, profile, onClose } = useHoSoTuyenSinhOneContext()

  if (isLoading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-8 shadow-xl">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-xs font-medium text-slate-700">Đang tải chi tiết hồ sơ...</span>
        </div>
      </div>
    )
  }

  const statusConfig = APPLICATION_STATUS_MAP[profile.status as NonNullable<ApplicationStatusEnum>] || {
    label: profile.status,
    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-8 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600">{profile.applicationCode}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusConfig.colorClass}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <h2 className="mt-1 text-base font-bold text-slate-800">Thí sinh: {profile.fullName}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100/50 bg-indigo-50/40 px-6 py-3">
          <div className="text-xs">
            <span className="font-semibold text-slate-700">Duyệt hồ sơ nhanh</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {profile.status !== 'APPROVED' && profile.status !== 'ENROLLED' && (
              <button
                onClick={() => handleStatusChange('APPROVED')}
                disabled={isUpdatingStatus}
                className="rounded-xl bg-emerald-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                Trúng Tuyển (APPROVED)
              </button>
            )}
            {profile.status === 'APPROVED' && (
              <button
                onClick={() => handleStatusChange('CONFIRMED')}
                disabled={isUpdatingStatus}
                className="rounded-xl bg-teal-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
              >
                Xác Nhận Nhập Học (CONFIRMED)
              </button>
            )}
            {(profile.status === 'CONFIRMED' || profile.status === 'APPROVED') && (
              <button
                onClick={() => handleStatusChange('ENROLLED')}
                disabled={isUpdatingStatus}
                className="rounded-xl bg-purple-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                Nhập Học Chính Thức (ENROLLED)
              </button>
            )}
            {profile.status !== 'REJECTED' && (
              <button
                onClick={() => handleStatusChange('REJECTED')}
                disabled={isUpdatingStatus}
                className="rounded-xl bg-rose-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                Từ Chối (REJECTED)
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-white px-6">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'INFO'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-4 w-4" /> Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab('ADMISSION')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'ADMISSION'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Thông tin xét tuyển & Học bạ
          </button>
          <button
            onClick={() => setActiveTab('DOCUMENT')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'DOCUMENT'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Giấy tờ xét tuyển
          </button>
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === 'LOGS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="h-4 w-4" /> Nhật ký hồ sơ
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 text-xs">
          {/* TAB 1: THÔNG TIN CƠ BẢN */}
          {activeTab === 'INFO' && <TabCommonInfo />}

          {/* TAB 2: THÔNG TIN XÉT TUYỂN & HỌC BẠ */}
          {activeTab === 'ADMISSION' && (
            <div className="space-y-6">
              <TabAdmissionInfo />
            </div>
          )}

          {activeTab === 'DOCUMENT' && <TabAdmissionDocument />}

          {/* TAB 3: NHẬT KÝ HỒ SƠ */}
          {activeTab === 'LOGS' && <TabNhatKyHoSo />}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 p-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default HoSoDetailModal
