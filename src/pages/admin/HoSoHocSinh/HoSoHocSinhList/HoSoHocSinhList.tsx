import { Plus, Download, GraduationCap, X } from "lucide-react";
import {
  HoSoHocSinhProvider,
  useHoSoHocSinhContext,
} from "../HoSoHocSinhProvider";
import TableHoSoHocSinh from "./TableHoSoHocSinh";
import CardViewList from "../CardViewList";
import PageShell from "../../../../components/ui/PageShell";
import StatOverview from "../components/StatOverview";
import ToolBar from "../components/ToolBar";
import ButtonImportExcel from "../../../../components/ui/ButtonImportExcel";
import ButtonExportExcel from "../../../../components/ui/ButtonExportExcel";
import ButtonAction from "../../../../components/ui/ButtonAction";

export default function DanhSachHoSoHocSinh() {
  return (
    <HoSoHocSinhProvider>
      <Inner />
    </HoSoHocSinhProvider>
  );
}

const Inner: React.FC = () => {
  const { data, pageItems, search, selected, filtered, setSelected } =
    useHoSoHocSinhContext();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageShell
      title="Hồ sơ học sinh"
      sub="Quản lý danh sách và hồ sơ toàn bộ học sinh các hệ đào tạo"
      icon={<GraduationCap size={26} />}
      renderRight={
        <div className="flex gap-2">
          <ButtonAction
            label="Thêm học sinh"
            className="bg-blue-600 text-white font-semibold"
            icon={<Plus size={14} />}
          />
          <ButtonImportExcel label="Nhập excel" />
          <ButtonExportExcel label="Xuất Excel" />
        </div>
      }
    >
      <div className="py-5 space-y-5">
        {/* ── Stats ── */}
        <StatOverview />

        {/* ── Toolbar ── */}
        <ToolBar />

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
    </PageShell>
  );
};
