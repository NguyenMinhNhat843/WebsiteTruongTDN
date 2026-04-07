import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import SortBtn from "./components/SortButton";
import { useHoSoHocSinhContext } from "../HoSoHocSinhProvider";
import { HeDaoTaoBadge } from "../../../../components/ui/HeDaoTaoBadge";
import { TrangThaiBadge } from "../../../../components/ui/BadgeStatus";
import HoSoProgress from "./components/HoSoProgress";
import RowActions from "./components/RowAction";
import { avatarColor, fmtDate, getAvatar } from "../helpers";

const TableHoSoHocSinh = () => {
  const {
    viewMode,
    allPageSelected,
    toggleSelectAll,
    pageItems,
    selected,
    toggleSelect,
    sort,
    handleSort,
    handleSearch,
    resetFilter,
    totalPages,
    safePage,
    setPage,
    navigate,
  } = useHoSoHocSinhContext();
  return (
    <div>
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50/80 text-gray-500 text-[11px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 w-8">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5">
                    <SortBtn
                      field="maSoHocSinh"
                      sort={sort}
                      onSort={handleSort}
                    >
                      Mã HS
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5">
                    <SortBtn field="hoTen" sort={sort} onSort={handleSort}>
                      Họ và tên
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5 text-center">
                    <SortBtn field="heDaoTao" sort={sort} onSort={handleSort}>
                      Hệ đào tạo
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5">
                    <SortBtn field="lop" sort={sort} onSort={handleSort}>
                      Lớp
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5">Ngành</th>
                  <th className="px-4 py-3.5 text-center">
                    <SortBtn field="trangThai" sort={sort} onSort={handleSort}>
                      Trạng thái
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5">Hồ sơ</th>
                  <th className="px-4 py-3.5 text-center">
                    <SortBtn field="diemTB" sort={sort} onSort={handleSort}>
                      ĐTB
                    </SortBtn>
                  </th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Search size={28} className="opacity-30" />
                        <span className="text-[13px] font-semibold">
                          Không tìm thấy học sinh nào
                        </span>
                        <button
                          onClick={() => {
                            handleSearch("");
                            resetFilter();
                          }}
                          className="text-[12px] text-blue-500 hover:underline"
                        >
                          Xóa bộ lọc
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageItems.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-slate-50/80 ${selected.has(row.id) ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {row.maSoHocSinh}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColor(row.id)} flex items-center justify-center text-white font-black text-[12px] shrink-0`}
                          >
                            {getAvatar(row.hoTen)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-[13px]">
                              {row.hoTen}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {row.gioiTinh} · {fmtDate(row.ngaySinh)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <HeDaoTaoBadge value={row.heDaoTao} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-[12px] text-slate-700">
                          {row.lop}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {row.khoaHoc}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[12px] text-slate-600">
                          {row.nganh}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <TrangThaiBadge value={row.trangThai} />
                      </td>

                      <td className="px-4 py-3">
                        <HoSoProgress
                          nop={row.soGiayToNop}
                          chuaNop={row.soGiayToChuaNop}
                        />
                        {row.soGiayToChuaNop > 0 && (
                          <div className="text-[10px] text-red-400 mt-0.5">
                            Thiếu {row.soGiayToChuaNop} giấy tờ
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-[14px] font-black ${row.diemTB >= 8 ? "text-emerald-600" : row.diemTB >= 6.5 ? "text-blue-600" : "text-amber-600"}`}
                        >
                          {row.diemTB.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <RowActions
                          onView={() => {
                            console.log("👁 Xem:", row);
                            navigate(`/admin/hoc-sinh/ho-so/${row.id}`);
                          }}
                          onEdit={() => console.log("✏️ Sửa:", row)}
                          onDelete={() => console.log("🗑 Xóa:", row)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <span className="text-[12px] text-slate-400">
                Trang <strong className="text-slate-600">{safePage}</strong> /{" "}
                {totalPages}
              </span>
              <div className="flex items-center gap-1">
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
                            ? "bg-blue-600 text-white border-blue-700 shadow-sm"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableHoSoHocSinh;
