import React, { useState } from 'react'
import {
  X,
  User,
  FileText,
  Award,
  Loader2,
  ExternalLink,
  BookOpen,
  History,
  GraduationCap,
  Users,
  Clock,
} from 'lucide-react'
import { $api } from '../../../../api/client'
import { APPLICATION_STATUS_MAP, DOCUMENT_STATUS_MAP } from '../../../../api/enum'
import type { ApplicationStatusEnum, DocumentStatusEnum } from '../../../../api/enum'
import type { components } from '../../../../api/v1'

// Lấy type trực tiếp từ schema response của API GET /admission-profiles/{id}
type AdmissionProfileDetail = components['schemas']['AdmissionProfileDetailDto']
type TranscriptSubjectScore = NonNullable<AdmissionProfileDetail['transcriptSubjectScores']>[number]

interface Props {
  profileId: number
  onClose: () => void
  onRefetch: () => void
}

export const HoSoDetailModal: React.FC<Props> = ({ profileId, onClose, onRefetch }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'ADMISSION' | 'LOGS'>('INFO')
  const [statusReason] = useState('')

  // Query Profile Detail (Response tự động infer kiểu AdmissionProfileDetail)
  const {
    data: profileData,
    isLoading,
    refetch,
  } = $api.useQuery(
    'get',
    '/admission-profiles/{id}',
    {
      params: { path: { id: profileId } },
    },
    { enabled: !!profileId },
  )

  // Trường hợp API trả về trực tiếp object hoặc unwrap qua response wrapper (.data)
  const profile = profileData?.profile
  const transcriptScores = profileData?.transcriptSubjectScores || []
  const admissionCampaign = profileData?.admissionCampaignMajor?.admissionCampaign
  const admissionCampaignMajor = profileData?.admissionCampaignMajor

  // Mutations
  const { mutate: updateStatus, isPending: isUpdatingStatus } = $api.useMutation(
    'patch',
    '/admission-profiles/{id}/status',
    {
      onSuccess: () => {
        refetch()
        onRefetch()
      },
    },
  )

  const { mutate: verifyDoc, isPending: isVerifyingDoc } = $api.useMutation(
    'patch',
    '/admission-documents/{id}/verify',
    {
      onSuccess: () => {
        refetch()
      },
    },
  )

  const handleStatusChange = (status: ApplicationStatusEnum) => {
    updateStatus({
      params: { path: { id: profileId } },
      body: { status: status, reason: statusReason || undefined },
    })
  }

  const handleVerifyDocument = (docId: number, status: DocumentStatusEnum, reason?: string) => {
    verifyDoc({
      params: { path: { id: docId } },
      body: { status: status, rejectionReason: reason },
    })
  }

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

  // Nhóm điểm học bạ theo lớp (gradeLevel)
  const groupedTranscriptScores = (transcriptScores || []).reduce(
    (acc, item) => {
      if (!acc[item.gradeLevel]) acc[item.gradeLevel] = []
      acc[item.gradeLevel].push(item)
      return acc
    },
    {} as Record<number, TranscriptSubjectScore[]>,
  )

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
          {activeTab === 'INFO' && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
                  <User className="h-4 w-4" /> Thông Tin Thí Sinh
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <span className="text-slate-500">Họ và tên:</span>
                    <p className="font-semibold text-slate-800">{profile.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">CCCD / Định danh:</span>
                    <p className="font-semibold text-slate-800">{profile.identityNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngày sinh:</span>
                    <p className="font-medium text-slate-800">
                      {profile.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Giới tính:</span>
                    <p className="font-medium text-slate-800">
                      {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Trình độ học vấn:</span>
                    <p className="font-medium text-slate-800">{profile.educationLevel}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Số điện thoại:</span>
                    <p className="font-semibold text-slate-800">{profile.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <p className="font-medium text-slate-800">{profile.email || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Địa chỉ chi tiết:</span>
                    <p className="font-medium text-slate-800">{profile.addressDetail || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>

              {/* Parents / Guardian Info */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
                  <Users className="h-4 w-4" /> Thông Tin Gia Đình / Người Giám Hộ
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <span className="text-slate-500">Họ tên Cha:</span>
                    <p className="font-medium text-slate-800">{profile.fatherName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">SĐT Cha:</span>
                    <p className="font-medium text-slate-800">{profile.fatherPhone || 'N/A'}</p>
                  </div>
                  <div className="hidden md:block"></div>
                  <div>
                    <span className="text-slate-500">Họ tên Mẹ:</span>
                    <p className="font-medium text-slate-800">{profile.motherName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">SĐT Mẹ:</span>
                    <p className="font-medium text-slate-800">{profile.motherPhone || 'N/A'}</p>
                  </div>
                  <div className="hidden md:block"></div>
                  <div>
                    <span className="text-slate-500">Người giám hộ:</span>
                    <p className="font-medium text-slate-800">{profile.guardianName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">SĐT Giám hộ:</span>
                    <p className="font-medium text-slate-800">{profile.guardianPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THÔNG TIN XÉT TUYỂN & HỌC BẠ */}
          {activeTab === 'ADMISSION' && (
            <div className="space-y-6">
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
                    <p className="text-sm font-bold text-slate-800">{profile.avgSubjectScore ?? 0}</p>
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

              {/* Attached Documents */}
              <div className="rounded-2xl border border-slate-100 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
                  <FileText className="h-4 w-4" /> Giấy Tờ Đính Kèm ({profileData.documents?.length || 0})
                </h3>
                {profileData.documents && profileData.documents.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {profileData.documents.map((doc: any) => {
                      const docStatus = DOCUMENT_STATUS_MAP[
                        doc.status as NonNullable<DocumentStatusEnum>
                      ] || {
                        label: doc.status,
                        colorClass: 'bg-slate-100 text-slate-600',
                      }
                      return (
                        <div key={doc.id} className="flex items-center justify-between gap-3 py-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">
                                {doc.documentConfigItem?.name || doc.fileName}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${docStatus.colorClass}`}
                              >
                                {docStatus.label}
                              </span>
                            </div>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                            >
                              Xem tệp <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleVerifyDocument(doc.id, 'APPROVED')}
                                disabled={isVerifyingDoc}
                                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                              >
                                Duyệt
                              </button>
                            )}
                            {doc.status !== 'REJECTED' && (
                              <button
                                onClick={() =>
                                  handleVerifyDocument(doc.id, 'REJECTED', 'Giấy tờ không hợp lệ')
                                }
                                disabled={isVerifyingDoc}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
                              >
                                Từ chối
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa có giấy tờ đính kèm.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NHẬT KÝ HỒ SƠ */}
          {activeTab === 'LOGS' && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-indigo-600">
                <History className="h-4 w-4" /> Lịch Sử Thay Đổi Trạng Thái
              </h3>
              {profileData.statusLogs && profileData.statusLogs.length > 0 ? (
                <div className="relative space-y-4 border-l-2 border-indigo-100 pl-4">
                  {profileData.statusLogs.map((log) => {
                    const toStatusConfig = APPLICATION_STATUS_MAP[
                      log.toStatus as NonNullable<ApplicationStatusEnum>
                    ] || { label: log.toStatus, colorClass: 'bg-slate-100 text-slate-700' }

                    return (
                      <div key={log.id} className="group relative">
                        {/* Dot indicator */}
                        <div className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-100" />

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${toStatusConfig.colorClass}`}
                            >
                              {toStatusConfig.label}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock className="h-3 w-3" />
                              {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : ''}
                            </span>
                          </div>

                          {log.reason && (
                            <p className="mt-2 text-xs font-medium text-slate-700">Ghi chú: {log.reason}</p>
                          )}

                          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                            <span>Người thực hiện:</span>
                            <span className="font-semibold text-slate-700">
                              {log.isSystem
                                ? 'Hệ thống (Tự động)'
                                : log.byUser?.username || 'NPH / Quản trị viên'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có nhật ký trạng thái.</p>
              )}
            </div>
          )}
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
