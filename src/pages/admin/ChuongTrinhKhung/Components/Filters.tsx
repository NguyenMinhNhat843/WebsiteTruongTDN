import { Search } from "lucide-react";
import { useChuongTrinhKhungContext } from "../ChuongTrinhKhungProvider";
import type { EduSystem, Status } from "../chuongTrinhKhung.type";
import { EDU_SYSTEM_META } from "../chuongTrinhKhung.constant";

const Filters = () => {
  const {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterSys,
    setFilterSys,
    filtered,
    frameworks,
  } = useChuongTrinhKhungContext();
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã, tên ngành, khoa…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status | "all")}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">Tất cả TT</option>
          <option value="active">Đang áp dụng</option>
          <option value="draft">Bản nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
        <p className="text-xs text-slate-400 ml-auto">
          {filtered.length} kết quả
        </p>
      </div>
      {/* System filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setFilterSys("all")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterSys === "all" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}
        >
          Tất cả hệ
        </button>
        {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
          const m = EDU_SYSTEM_META[sys];
          const sel = filterSys === sys;
          const count = frameworks.filter((f) => f.eduSystem === sys).length;
          return (
            <button
              key={sys}
              onClick={() => setFilterSys(sys)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${sel ? `${m.bg} ${m.color} ${m.border}` : "border-transparent text-slate-500 hover:bg-slate-100"}`}
            >
              {m.short}
              <span
                className={`text-[9px] font-black px-1 rounded-full ${sel ? m.color + " opacity-70" : "bg-slate-200 text-slate-500"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
