import { useState, useMemo, useEffect } from "react";
import { $api } from "../../../api/client";
import type { paths } from "../../../api/v1";
import CreateNamHocModal from "./CreateNamHocModal";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Filter,
  CheckCircle2,
  Edit2,
  Sparkles,
  Zap,
} from "lucide-react";
import type { AcademicYearDto } from "../../../api/entity";
import { useDebounce } from "../../../hooks/useDebounce";

export type QueryAcademicYearDto =
  paths["/academic-years"]["get"]["parameters"]["query"];

const STATUS_CONFIG: Record<
  NonNullable<AcademicYearDto["status"]>,
  { label: string; className: string }
> = {
  PLANNING: {
    label: "Lập kế hoạch",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACTIVE: {
    label: "Đang hoạt động",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CLOSED: {
    label: "Đã đóng",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const NamHocHome = () => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchCode = useDebounce(searchInput, 500);
  const [queryParams, setQueryParams] = useState<
    NonNullable<QueryAcademicYearDto>
  >({
    code: "",
    status: undefined,
    isCurrent: undefined,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      code: debouncedSearchCode,
      page: 1, // Reset về trang 1 khi tìm kiếm
    }));
  }, [debouncedSearchCode]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYearDto | null>(null);

  // API Lấy danh sách năm học
  const {
    data: academicYears,
    isLoading,
    refetch,
  } = $api.useQuery("get", "/academic-years", {
    params: {
      query: {
        code: queryParams.code || undefined,
        status: queryParams.status || undefined,
        isCurrent: queryParams.isCurrent ?? undefined,
        page: queryParams.page,
        limit: queryParams.limit,
      },
    },
  });

  // Mutation cập nhật nhanh năm học (Dùng để Active nhanh)
  const updateMutation = $api.useMutation("patch", "/academic-years/{id}", {
    onSuccess: () => refetch(),
  });

  const rawYears = academicYears?.data || [];
  const totalItems = academicYears?.total || 0;
  const limit = queryParams.limit ?? 10;
  const page = queryParams.page ?? 1;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Lấy ra Năm học hiện tại để làm Hero Banner
  const currentAcademicYear = useMemo(() => {
    return rawYears.find((y) => y.isCurrent);
  }, [rawYears]);

  // Sắp xếp danh sách: Đưa Năm hiện tại lên đầu tiên, sau đó đến các năm mới hơn
  const sortedYears = useMemo(() => {
    return [...rawYears].sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      // Sắp xếp theo ngày bắt đầu giảm dần/tăng dần tùy nhu cầu
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [rawYears]);

  const handleResetFilters = () => {
    setSearchInput("");
    setQueryParams({
      code: "",
      status: undefined,
      isCurrent: undefined,
      page: 1,
      limit: 10,
    });
  };

  const handleQuickSetActive = (id: number) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn kích hoạt năm học này làm Năm Học Hiện Tại?",
      )
    ) {
      updateMutation.mutate({
        params: { path: { id } },
        body: { isCurrent: true, status: "ACTIVE" },
      });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedAcademicYear(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AcademicYearDto) => {
    setSelectedAcademicYear(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Năm Học
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập năm học hiện tại và quản lý kế hoạch các năm tiếp theo
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo năm học mới</span>
        </button>
      </div>

      {/* Hero Section: HIGHLIGHT NĂM HỌC HIỆN TẠI */}
      {currentAcademicYear && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 shadow-lg border border-indigo-700/50">
          <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Năm Học Hiện Tại (Current Active)</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Năm học: {currentAcademicYear.code}
              </h2>
              <p className="text-sm text-indigo-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-300" />
                Thời gian:{" "}
                <span className="font-medium text-white">
                  {new Date(currentAcademicYear.startDate).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>{" "}
                đến{" "}
                <span className="font-medium text-white">
                  {new Date(currentAcademicYear.endDate).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleOpenEditModal(currentAcademicYear as AcademicYearDto)
                }
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-4 py-2.5 rounded-xl transition-all text-sm backdrop-blur-md"
              >
                <Edit2 className="w-4 h-4" />
                <span>Chỉnh sửa thông tin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Bộ lọc danh sách</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã năm học..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <select
              value={queryParams.status ?? ""}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  status: (e.target.value ||
                    undefined) as AcademicYearDto["status"],
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PLANNING">Lập kế hoạch</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã / Năm Học</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 text-center">Năm Hiện Tại</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">
                  Thao Tác Kích Hoạt / Sửa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-28"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-36"></div>
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
              ) : sortedYears.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Không tìm thấy năm học nào.
                  </td>
                </tr>
              ) : (
                sortedYears.map((item) => {
                  const statusInfo = STATUS_CONFIG[item.status];
                  const isCurrent = item.isCurrent;

                  return (
                    <tr
                      key={item.id}
                      onClick={() =>
                        handleOpenEditModal(item as AcademicYearDto)
                      }
                      className={`transition-colors cursor-pointer group ${
                        isCurrent
                          ? "bg-indigo-50/60 hover:bg-indigo-50 border-l-4 border-l-indigo-600 font-medium"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Mã năm học */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${isCurrent ? "text-indigo-900 text-base" : "text-slate-900"}`}
                          >
                            {item.code}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                              Đang chọn
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Thời gian */}
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

                      {/* Trạng thái Is Current */}
                      <td className="py-4 px-4 text-center">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>HIỆN TẠI</span>
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo?.className}`}
                        >
                          {statusInfo?.label ?? item.status}
                        </span>
                      </td>

                      {/* Nút thao tác kích hoạt & Sửa */}
                      <td className="py-4 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleQuickSetActive(item.id)}
                              disabled={updateMutation.isPending}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                              title="Kích hoạt làm năm học hiện tại"
                            >
                              <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                              <span>Kích hoạt</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEditModal(item as AcademicYearDto)
                            }
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {sortedYears.length}
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
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
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
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateNamHocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        data={selectedAcademicYear}
      />
    </div>
  );
};

export default NamHocHome;
