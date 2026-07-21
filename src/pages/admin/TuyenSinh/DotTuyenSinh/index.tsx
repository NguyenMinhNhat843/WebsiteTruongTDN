import { useState } from "react";
import { $api } from "../../../../api/client";
import type { paths } from "../../../../api/v1";
import CreateDotTuyenSinhModal from "./CreateDotTuyenSinhModal";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Filter,
  Edit2,
} from "lucide-react";

export type AdmissionCampaignQueryDto =
  paths["/admission-campaigns"]["get"]["parameters"]["query"];

// Mapping hiển thị label và màu sắc theo Status type gốc
const STATUS_CONFIG: Record<
  NonNullable<AdmissionCampaignQueryDto["status"]>,
  { label: string; className: string }
> = {
  PLANNING: {
    label: "Lập kế hoạch",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  OPEN: {
    label: "Đang mở",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CLOSED: {
    label: "Đã đóng",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const DotTuyenSinhHome = () => {
  // State quản lý bộ lọc
  const [queryParams, setQueryParams] = useState<AdmissionCampaignQueryDto>({
    name: "",
    status: undefined,
    page: 1,
    limit: 10,
  });

  // State quản lý Modal và ID đợt tuyển sinh được chọn để sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );

  // Gọi API danh sách đợt tuyển sinh
  const {
    data: admissionCampaigns,
    isLoading,
    refetch: refetchCampaigns,
  } = $api.useQuery("get", "/admission-campaigns", {
    params: {
      query: {
        name: queryParams.name || undefined,
        status: queryParams.status || undefined,
        page: queryParams.page,
        limit: queryParams.limit,
      },
    },
  });

  // API getDetail - Chỉ gọi khi selectedCampaignId có giá trị (không null)
  const { data: campaignDetail, isLoading: isLoadingDetail } = $api.useQuery(
    "get",
    "/admission-campaigns/{id}",
    {
      params: {
        path: {
          id: selectedCampaignId!,
        },
      },
    },
    {
      enabled: typeof selectedCampaignId === "number" && isModalOpen,
    },
  );

  const campaigns = admissionCampaigns?.data || [];
  const totalItems = admissionCampaigns?.total || 0;
  const limit = queryParams.limit ?? 10;
  const page = queryParams.page ?? 1;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const handleResetFilters = () => {
    setQueryParams({
      name: "",
      status: undefined,
      page: 1,
      limit: 10,
    });
  };

  // Mở modal để tạo mới
  const handleOpenCreateModal = () => {
    setSelectedCampaignId(null);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa khi chọn 1 đợt tuyển sinh
  const handleOpenEditModal = (id: number) => {
    setSelectedCampaignId(id);
    setIsModalOpen(true);
  };

  // Đóng modal và reset ID chọn
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaignId(null);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Đợt Tuyển Sinh
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các đợt tuyển sinh và kế hoạch mở hồ sơ
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo đợt tuyển sinh</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Bộ lọc tìm kiếm</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by Name */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên đợt tuyển sinh..."
              value={queryParams.name ?? ""}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  name: e.target.value,
                  page: 1,
                }))
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={queryParams.status ?? ""}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  status: (e.target.value ||
                    undefined) as AdmissionCampaignQueryDto["status"],
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PLANNING">Lập kế hoạch</option>
              <option value="OPEN">Đang mở</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã / Tên đợt</th>
                <th className="py-3.5 px-4">Năm học</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4 text-center">Chỉ tiêu</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-8 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Không tìm thấy đợt tuyển sinh nào phù hợp.
                  </td>
                </tr>
              ) : (
                campaigns.map((item) => {
                  const statusInfo = STATUS_CONFIG[item.status];
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenEditModal(item.id)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {item.code}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {item.academicYear}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(item.startDate).toLocaleDateString(
                              "vi-VN",
                            )}{" "}
                            -{" "}
                            {new Date(item.endDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-slate-700">
                        {item.targetQuota ?? "—"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo?.className}`}
                        >
                          {statusInfo?.label ?? item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(item.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Chỉnh sửa đợt tuyển sinh"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {campaigns.length}
            </span>{" "}
            / <span className="font-medium text-slate-700">{totalItems}</span>{" "}
            kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setQueryParams((p) => ({
                  ...p,
                  page: Math.max(1, (p.page ?? 1) - 1),
                }))
              }
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() =>
                setQueryParams((p) => ({
                  ...p,
                  page: Math.min(totalPages, (p.page ?? 1) + 1),
                }))
              }
              disabled={page >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Component Modal dùng chung cho cả Create và Edit */}
      <CreateDotTuyenSinhModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => refetchCampaigns()}
        data={campaignDetail as any}
        isLoading={Boolean(selectedCampaignId && isLoadingDetail)}
      />
    </div>
  );
};

export default DotTuyenSinhHome;
