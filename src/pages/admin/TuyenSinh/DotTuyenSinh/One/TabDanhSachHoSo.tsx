import React, { useState } from 'react'
import { Search, Plus, FileText, Eye, Trash2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { $api } from '../../../../../api/client'
import { useDebounce } from '../../../../../hooks/useDebounce'
import { APPLICATION_STATUS_MAP, APPLICATION_STATUS_TABS } from '../../../../../api/enum'
import type { ApplicationStatusEnum } from '../../../../../api/enum'
import { HoSoDetailModal } from '../../HoSoTuyenSinh/HoSoDetailModal'

interface TabDanhSachHoSoProps {
  admissionCampaignId: number
}

const TabDanhSachHoSo: React.FC<TabDanhSachHoSoProps> = ({ admissionCampaignId }) => {
  const navigate = useNavigate()

  // Filters & State
  const [activeTabStatus, setActiveTabStatus] = useState<ApplicationStatusEnum | undefined>(undefined)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const [page, setPage] = useState(1)
  const limit = 10

  // Selected Detail Modal
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null)

  // Query Admission Profiles list cho ĐỢT XÉT TUYỂN HIỆN TẠI
  const {
    data: response,
    isLoading,
    refetch,
  } = $api.useQuery(
    'get',
    '/admission-profiles',
    {
      params: {
        query: {
          admissionCampaignId: admissionCampaignId,
          fullName: debouncedSearch || undefined,
          identityNumber: debouncedSearch || undefined,
          applicationCode: debouncedSearch || undefined,
          phone: debouncedSearch || undefined,
          status: activeTabStatus || undefined,
          page,
          limit,
        },
      },
    },
    {
      enabled: !!admissionCampaignId,
    },
  )

  const profiles = response?.data || []
  const total = response?.total || 0
  const totalPages = Math.ceil(total / limit)

  // Mutation Delete Profile
  const { mutate: deleteProfile } = $api.useMutation('delete', '/admission-profiles/{id}', {
    onSuccess: () => refetch(),
  })

  return (
    <div className="space-y-6">
      {/* Header mini trong Tab */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">Danh Sách Hồ Sơ Đợt Tuyển Sinh</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {total} hồ sơ
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Quản lý và xét duyệt các hồ sơ nộp trực tiếp vào đợt tuyển sinh này.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/admin/tuyen-sinh/ho-so-tuyen-sinh/tao-moi?campaignId=${admissionCampaignId}`)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Thêm hồ sơ đợt này
        </button>
      </div>

      {/* Tabs Phân loại trạng thái */}
      <div className="custom-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        {APPLICATION_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTabStatus(tab.value as ApplicationStatusEnum | undefined)
              setPage(1)
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTabStatus === tab.value
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo Mã hồ sơ, Họ tên, CCCD, Số điện thoại..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-xs transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Không có hồ sơ nào trong đợt tuyển sinh này</p>
            <p className="mt-1 text-xs text-slate-400">
              Thử tìm kiếm với từ khóa khác hoặc chuyển sang trạng thái hồ sơ khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  <th className="px-4 py-3.5">Mã Hồ Sơ</th>
                  <th className="px-4 py-3.5">Họ & Tên Thí Sinh</th>
                  <th className="px-4 py-3.5">CCCD / Mã ĐĐ</th>
                  <th className="px-4 py-3.5">Điện Thoại</th>
                  <th className="px-4 py-3.5">Tổng Điểm</th>
                  <th className="px-4 py-3.5">Trạng Thái</th>
                  <th className="px-4 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {profiles.map((profile) => {
                  const statusConfig = APPLICATION_STATUS_MAP[
                    profile.status as NonNullable<ApplicationStatusEnum>
                  ] || { label: profile.status, colorClass: 'bg-slate-100 text-slate-700' }

                  return (
                    <tr key={profile.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-600">
                        {profile.applicationCode}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{profile.fullName}</td>
                      <td className="px-4 py-3.5 text-slate-600">{profile.identityNumber}</td>
                      <td className="px-4 py-3.5 text-slate-600">{profile.phone}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {profile.scoreCalculated ?? profile.totalExamScore ?? '0'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusConfig.colorClass}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="space-x-1 px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedProfileId(profile.id)}
                          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                          title="Xem chi tiết & Duyệt"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Bạn có chắc muốn xóa hồ sơ này?')) {
                              deleteProfile({ params: { path: { id: profile.id } } })
                            }
                          }}
                          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs">
            <span className="text-slate-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedProfileId && (
        <HoSoDetailModal
          profileId={selectedProfileId}
          onClose={() => setSelectedProfileId(null)}
          onRefetch={refetch}
        />
      )}
    </div>
  )
}

export default TabDanhSachHoSo
