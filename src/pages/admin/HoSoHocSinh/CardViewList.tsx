import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import StudentCard from "./components/CardViewItem";
import { useHoSoHocSinhContext } from "./HoSoHocSinhProvider";

const CardViewList = () => {
  const {
    viewMode,
    pageItems,
    handleSearch,
    resetFilter,
    totalPages,
    safePage,
    setPage,
  } = useHoSoHocSinhContext();
  return (
    <div>
      {viewMode === "card" &&
        (pageItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 flex flex-col items-center gap-2 text-slate-400">
            <Search size={28} className="opacity-30" />
            <span className="text-[13px] font-semibold">
              Không tìm thấy học sinh nào
            </span>
            <button
              onClick={() => {
                handleSearch("");
                resetFilter();
              }}
              className="text-[12px] text-blue-500 hover:underline mt-1"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pageItems.map((row) => (
                <StudentCard key={row.id} row={row} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all border
                          ${
                            p === safePage
                              ? "bg-blue-600 text-white border-blue-700"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default CardViewList;
