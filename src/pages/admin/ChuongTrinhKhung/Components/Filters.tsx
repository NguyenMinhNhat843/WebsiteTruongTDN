import { Search } from "lucide-react";

const Filters = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pr-2" />
          <input
            placeholder="Tìm mã, tên ngành, khoa…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
          />
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          <option value="all">Tất cả TT</option>
          <option value="active">Đang áp dụng</option>
          <option value="draft">Bản nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
        <p className="text-xs text-slate-400 ml-auto">{0} kết quả</p>
      </div>
      {/* System filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors text-slate-500 hover:bg-slate-100"}`}
        >
          Tất cả hệ
        </button>
      </div>
    </div>
  );
};

export default Filters;
