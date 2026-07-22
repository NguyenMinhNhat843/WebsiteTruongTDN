import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  UserCheck,
  FileText,
  Eye,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { $api } from "../../../../api/client";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  APPLICATION_STATUS_MAP,
  APPLICATION_STATUS_TABS,
} from "../../../../api/enum";
import type { ApplicationStatusEnum } from "../../../../api/enum";
import { HoSoDetailModal } from "./HoSoDetailModal";
import type { AdmissionProfileDto } from "../../../../api/entity";

const HoSoTuyenSinhHome: React.FC = () => {
  const navigate = useNavigate();

  // Filters & State
  const [activeTabStatus, setActiveTabStatus] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected Detail Modal
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  // Query Admission Profiles list
  const { data: response, isLoading, refetch } = $api.useQuery(
    "get",
    "/admission-profiles",
    {
      params: {
        query: {
          fullName: debouncedSearch || undefined,
          identityNumber: debouncedSearch || undefined,
          applicationCode: debouncedSearch || undefined,
          phone: debouncedSearch || undefined,
          status: (activeTabStatus as any) || undefined,
          page,
          limit,
        },
      },
    },
  );

  const profiles = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Mutation Delete
  const { mutate: deleteProfile } = $api.useMutation("delete", "/admission-profiles/{id}", {
    onSuccess: () => refetch(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">
              Quản Lý & Phân Loại Hồ Sơ Tuyển Sinh
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full">
              {total} hồ sơ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi, phân loại trạng thái đăng ký, duyệt trúng tuyển & đối chiếu hồ sơ nhập học.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/tuyen-sinh/ho-so-tuyen-sinh/tao-moi")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Tạo hồ sơ tuyển sinh mới
        </button>
      </div>

      {/* Tabs Phân loại trạng thái */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        {APPLICATION_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTabStatus(tab.value);
              setPage(1);
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTabStatus === tab.value
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo Mã hồ sơ, Họ tên, CCCD, Số điện thoại..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Không tìm thấy hồ sơ tuyển sinh nào</p>
            <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc chuyển tab trạng thái khác.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã Hồ Sơ</th>
                  <th className="py-3.5 px-4">Họ & Tên Thí Sinh</th>
                  <th className="py-3.5 px-4">CCCD / Mã ĐĐ</th>
                  <th className="py-3.5 px-4">Điện Thoại</th>
                  <th className="py-3.5 px-4">Tổng Điểm</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {profiles.map((profile: any) => {
                  const statusConfig = APPLICATION_STATUS_MAP[
                    profile.status as NonNullable<ApplicationStatusEnum>
                  ] || { label: profile.status, colorClass: "bg-slate-100 text-slate-700" };

                  return (
                    <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {profile.applicationCode}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {profile.fullName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{profile.identityNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600">{profile.phone}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {profile.scoreCalculated ?? profile.totalExamScore ?? "0"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusConfig.colorClass}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedProfileId(profile.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Xem chi tiết & Duyệt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Bạn có chắc muốn xóa hồ sơ này?")) {
                              deleteProfile({ params: { path: { id: profile.id } } });
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
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
  );
};

export default HoSoTuyenSinhHome;
