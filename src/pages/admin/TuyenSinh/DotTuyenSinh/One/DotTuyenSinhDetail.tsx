import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Layers,
  FileText,
  Info,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
} from 'lucide-react'
import { $api } from '../../../../../api/client'
import { useGetAcademicYears } from '../../../../../hooks/useAcademicYear'
import TabDanhSachHoSo from './TabDanhSachHoSo'

const AdmissionCampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const campaignId = Number(id)

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'applications'>('info')

  // 1. Fetch dữ liệu Đợt tuyển sinh chi tiết
  const { data: campaign, isLoading: isCampaignLoading } = $api.useQuery(
    'get',
    '/admission-campaigns/{id}',
    {
      params: { path: { id: campaignId } },
    },
    { enabled: !!campaignId },
  )

  // Fetch danh sách năm học để map tên nếu API trả về ID
  const { data: academicYears } = useGetAcademicYears()
  const academicYear = academicYears?.data?.find((y) => y.id === campaign?.academicYearId)

  // Render Badge Trạng thái
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Đang mở đăng ký
          </span>
        )
      case 'PLANNING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            Đang kế hoạch
          </span>
        )
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            Đã đóng
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
            Hoàn thành
          </span>
        )
      default:
        return null
    }
  }

  if (isCampaignLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="my-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">Không tìm thấy thông tin đợt tuyển sinh.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header & Back Button */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            title="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{campaign.name}</h1>
              {renderStatusBadge(campaign.status)}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Mã đợt: <span className="font-mono font-medium text-slate-700">{campaign.code}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === 'info'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Info className="h-4 w-4" />
          Thông tin đợt tuyển
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <FileText className="h-4 w-4" />
          Hồ sơ nộp vào
        </button>
      </div>

      {/* TAB 1: THÔNG TIN ĐỢT TUYỂN */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cột Trái: Thông tin chung */}
          <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">Chi tiết thông tin</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="mb-1 block text-xs text-slate-400">Năm học</span>
                <p className="text-sm font-semibold text-slate-800">
                  {academicYear?.code || 'Chưa xác định'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-1 block text-xs text-slate-400">Ngày bắt đầu</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {campaign.startDate ? campaign.startDate.slice(0, 10) : 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="mb-1 block text-xs text-slate-400">Ngày kết thúc</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {campaign.endDate ? campaign.endDate.slice(0, 10) : 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs text-slate-400">Chỉ tiêu tổng</span>
                <div className="text-2xl font-black text-indigo-600">
                  {0} <span className="text-xs font-normal text-slate-500">chỉ tiêu</span>
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs text-slate-400">Ghi chú / Mô tả</span>
                <p className="min-h-[80px] rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                  {campaign.description || 'Không có mô tả nào.'}
                </p>
              </div>
            </div>
          </div>

          {/* Cột Phải: Danh sách Ngành & Chỉ tiêu */}
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">Phân bổ chỉ tiêu ngành tuyển sinh</h3>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                {campaign.campaignMajors?.length || 0} Ngành
              </span>
            </div>

            {!campaign.campaignMajors || campaign.campaignMajors.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Đợt tuyển sinh này chưa được gán ngành tuyển sinh.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {campaign.campaignMajors.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item?.major?.majorName || `Ngành ID: ${item.majorId}`}
                      </p>
                      {item?.major?.majorCode && (
                        <p className="mt-0.5 font-mono text-xs text-slate-400">
                          Mã: {item?.major?.majorCode}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-slate-400">Chỉ tiêu</span>
                      <span className="text-sm font-bold text-indigo-600">{item.quota}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HỒ SƠ NỘP VÀO */}
      {activeTab === 'applications' && <TabDanhSachHoSo admissionCampaignId={campaignId} />}
    </div>
  )
}

export default AdmissionCampaignDetail
