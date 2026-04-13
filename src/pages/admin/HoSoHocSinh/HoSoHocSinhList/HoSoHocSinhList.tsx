import {
  Search,
  Plus,
  Download,
  GraduationCap,
  Users,
  SlidersHorizontal,
  X,
  UserCheck,
  FileWarning,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  HoSoHocSinhProvider,
  useHoSoHocSinhContext,
} from "../HoSoHocSinhProvider";
import { StatCard } from "../../../../components/ui/StatCard";
import type { FilterState, HeDaoTao, TrangThaiHocSinh } from "../mockType";
import { ALL_HE_DAO_TAO, ALL_TRANG_THAI } from "../mockStyleMapEnum";
import TableHoSoHocSinh from "./TableHoSoHocSinh";
import CardViewList from "../CardViewList";

export default function DanhSachHoSoHocSinh() {
  return (
    <HoSoHocSinhProvider>
      <Inner />
    </HoSoHocSinhProvider>
  );
}

const Inner: React.FC = () => {
  const {
    activeFiltersCount,
    data,
    handleFilter,
    handleSearch,
    lopList,
    pageItems,
    resetFilter,
    search,
    selected,
    setShowFilter,
    setViewMode,
    showFilter,
    stats,
    viewMode,
    filter,
    filtered,
    setSelected,
  } = useHoSoHocSinhContext();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-black text-slate-800 tracking-tight">
              Hồ sơ học sinh
            </h1>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Quản lý danh sách và hồ sơ toàn bộ học sinh các hệ đào tạo
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
              <Download size={13} /> Xuất Excel
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-blue-600 border border-blue-700 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              <Plus size={14} /> Thêm học sinh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Tổng học sinh",
              value: stats.total,
              icon: <Users size={20} className="text-blue-600" />,
              color: "bg-blue-50",
            },
            {
              label: "Đang học",
              value: stats.dangHoc,
              icon: <UserCheck size={20} className="text-emerald-600" />,
              color: "bg-emerald-50",
            },
            {
              label: "Hồ sơ thiếu",
              value: stats.hoSoThieu,
              icon: <FileWarning size={20} className="text-amber-600" />,
              color: "bg-amber-50",
              sub: "cần bổ sung giấy tờ",
            },
            {
              label: "Có học bổng",
              value: stats.hocBong,
              icon: <GraduationCap size={20} className="text-violet-600" />,
              color: "bg-violet-50",
              sub: `${Math.round((stats.hocBong / stats.total) * 100)}% tổng số`,
            },
          ].map((s) => (
            <StatCard
              label={s.label}
              value={s.value}
              icon={s.icon}
              description={s.sub}
            />
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm theo tên, mã HS, SĐT, lớp..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filter.heDaoTao}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleFilter("heDaoTao", e.target.value as HeDaoTao | "")
              }
              className="px-3 py-2 text-[12px] font-semibold border border-slate-200 rounded-xl bg-white text-slate-600 focus:border-blue-400 outline-none cursor-pointer"
            >
              <option value="">Tất cả hệ</option>
              {ALL_HE_DAO_TAO.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <select
              value={filter.trangThai}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleFilter(
                  "trangThai",
                  e.target.value as TrangThaiHocSinh | "",
                )
              }
              className="px-3 py-2 text-[12px] font-semibold border border-slate-200 rounded-xl bg-white text-slate-600 focus:border-blue-400 outline-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              {ALL_TRANG_THAI.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Advanced filter toggle */}
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-xl border transition-all
                ${
                  showFilter || activeFiltersCount > 0
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
              <SlidersHorizontal size={13} />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilter}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={12} /> Xóa lọc
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Advanced filter panel ── */}
        {showFilter && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                Bộ lọc nâng cao
              </span>
              <button
                onClick={resetFilter}
                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Lớp
                </label>
                <select
                  value={filter.lop}
                  onChange={(e) => handleFilter("lop", e.target.value)}
                  className="px-3 py-2 text-[12px] border border-slate-200 rounded-xl bg-white text-slate-700 focus:border-blue-400 outline-none"
                >
                  <option value="">Tất cả lớp</option>
                  {lopList.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Học bổng
                </label>
                <select
                  value={filter.hocBong}
                  onChange={(e) =>
                    handleFilter(
                      "hocBong",
                      e.target.value as FilterState["hocBong"],
                    )
                  }
                  className="px-3 py-2 text-[12px] border border-slate-200 rounded-xl bg-white text-slate-700 focus:border-blue-400 outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="co">Có học bổng</option>
                  <option value="khong">Không có</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hồ sơ thiếu
                </label>
                <select
                  value={filter.hoSoThieu}
                  onChange={(e) =>
                    handleFilter(
                      "hoSoThieu",
                      e.target.value as FilterState["hoSoThieu"],
                    )
                  }
                  className="px-3 py-2 text-[12px] border border-slate-200 rounded-xl bg-white text-slate-700 focus:border-blue-400 outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="co">Còn thiếu giấy tờ</option>
                  <option value="khong">Hồ sơ đầy đủ</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Bulk actions ── */}
        {selected.size > 0 && (
          <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md shadow-blue-200">
            <span className="text-[13px] font-semibold">
              Đã chọn <strong>{selected.size}</strong> học sinh
            </span>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-white/20 rounded-lg hover:bg-white/30 transition-all">
                <Download size={13} /> Xuất danh sách
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                <X size={13} /> Bỏ chọn
              </button>
            </div>
          </div>
        )}

        {/* ── Result count ── */}
        <div className="flex items-center justify-between text-[12px] text-slate-400">
          <span>
            Hiển thị{" "}
            <strong className="text-slate-600">{pageItems.length}</strong> /{" "}
            <strong className="text-slate-600">{filtered.length}</strong> học
            sinh
            {search && (
              <>
                {" "}
                — kết quả cho "
                <span className="text-blue-600 font-semibold">{search}</span>"
              </>
            )}
          </span>
          {filtered.length !== data.length && (
            <span className="text-blue-500 font-semibold">
              Đang lọc ({data.length - filtered.length} bị ẩn)
            </span>
          )}
        </div>

        <TableHoSoHocSinh />

        {/* ── Card view ── */}
        <CardViewList />
      </div>
    </div>
  );
};
