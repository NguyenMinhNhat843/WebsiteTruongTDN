import {
  ChevronDown,
  Edit3,
  History,
  Save,
  Lock,
  X,
  CheckCircle2,
} from "lucide-react";
import { TRANG_THAI_OPTIONS, type DiemField } from "../type";
import { tinhTongKet } from "./helpers";
import {
  TableDiemSinhVienProvider,
  useTableDiemSinhVienContext,
} from "./TableDiemSinhVienProvider";
import StatusBadge from "./components/StatusBadge";
import { useDanhSachDiemThiContext } from "../DanhSachDiemThiProvider";
import ActionButton from "../../../../components/ui/ActionButton";
import ButtonImportExcel from "../../../../components/ui/ButtonImportExcel";
import ButtonAction from "../../../../components/ui/ButtonAction";

interface ScoreInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ value, onChange }) => (
  <input
    type="number"
    min={0}
    max={10}
    step={0.5}
    value={value}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value)
    }
    className="w-14 px-1 py-1 text-center bg-white border border-blue-200 rounded-md
               focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 outline-none
               font-bold text-blue-600 shadow-sm text-sm"
  />
);

// ─────────────────────────────────────────────────────────────────────────────

interface DiemFieldConfig {
  field: DiemField;
  label: string;
  pct: string;
}

const DIEM_FIELD_CONFIGS: DiemFieldConfig[] = [
  { field: "chuyenCan", label: "Chuyên cần", pct: "10%" },
  { field: "thuongKy", label: "Thường kỳ", pct: "10%" },
  { field: "gk", label: "GK", pct: "20%" },
  { field: "ck", label: "CK", pct: "50%" },
];

export default function TableNhapDiemSinhVien() {
  return (
    <TableDiemSinhVienProvider>
      <Inner />
    </TableDiemSinhVienProvider>
  );
}

const Inner: React.FC = () => {
  const { setOpenLichSuThaoTac } = useDanhSachDiemThiContext();
  const {
    allLocked,
    data,
    editBuffer,
    handleCancel,
    handleChotDiemAll,
    handleChotDiemRow,
    handleSave,
    handleScoreChange,
    handleStartEdit,
    handleTrangThaiChange,
    isEditingAll,
    saved,
  } = useTableDiemSinhVienContext();

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex md:flex-row md:items-end justify-between gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="space-y-2">
          {/* Hàng 1: Tiêu đề chính & Trạng thái */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Danh sách điểm thi
            </h2>

            <div className="flex gap-2">
              {isEditingAll && (
                <span className="flex items-center gap-1.5 text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-lg animate-pulse font-bold">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  CHẾ ĐỘ CHỈNH SỬA
                </span>
              )}

              {saved && (
                <span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-lg font-bold">
                  <CheckCircle2 size={12} /> ĐÃ LƯU
                </span>
              )}
            </div>
          </div>

          {/* Hàng 2: Thông tin chi tiết (Lớp, Môn) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="font-medium text-slate-400">Lớp:</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                DHCNTT17C
              </span>
            </div>

            <div className="hidden md:block w-px h-4 bg-slate-300"></div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="font-medium text-slate-400">Môn:</span>
              <span className="font-semibold text-slate-700">
                Lập trình hướng đối tượng
              </span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2.5">
          {/* Import Excel luôn hiển thị */}
          <ButtonImportExcel label="Nhập file Excel" size="sm" />

          {!isEditingAll ? (
            <>
              {/* Chốt điểm - Chỉ hiện khi chưa chỉnh sửa */}
              <ButtonAction
                disabled={allLocked}
                icon={
                  allLocked ? <CheckCircle2 size={14} /> : <Lock size={14} />
                }
                label={allLocked ? "Đã chốt tất cả" : "Chốt điểm tất cả"}
                onClick={handleChotDiemAll}
                // Giả sử component có prop variant hoặc màu sắc
                className={
                  allLocked
                    ? "opacity-50"
                    : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                }
              />

              {/* Chỉnh sửa */}
              <ButtonAction
                icon={<Edit3 size={14} />}
                label="Chỉnh sửa"
                onClick={handleStartEdit}
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              />
            </>
          ) : (
            <>
              {/* Hủy bỏ */}
              <ButtonAction
                icon={<X size={14} />}
                label="Hủy bỏ"
                onClick={handleCancel}
                className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              />

              {/* Lưu tất cả */}
              <ButtonAction
                icon={<Save size={14} />}
                label="Lưu tất cả"
                onClick={handleSave}
                className="bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm"
              />
            </>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-225">
          <thead className="bg-gray-50/60 text-gray-500 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-4 py-3.5 border-b border-gray-100">
                Sinh viên
              </th>
              <th className="px-4 py-3.5 border-b border-gray-100">Môn học</th>
              {DIEM_FIELD_CONFIGS.map(({ field, label, pct }) => (
                <th
                  key={field}
                  className="px-4 py-3.5 border-b border-gray-100 text-center"
                >
                  {label}
                  <br />
                  <span className="text-[9px] normal-case font-normal text-gray-400">
                    ({pct})
                  </span>
                </th>
              ))}
              <th className="px-4 py-3.5 border-b border-gray-100 text-center">
                Tổng kết
              </th>
              <th className="px-4 py-3.5 border-b border-gray-100 w-40">
                Trạng thái
              </th>
              <th className="px-4 py-3.5 border-b border-gray-100 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 text-sm">
            {data.map((row) => {
              const buf = editBuffer[row.id];
              const editing = isEditingAll && !row.daChot;

              // Giá trị hiển thị: ưu tiên buffer khi đang edit
              const displayScores: Record<DiemField, string | number> = {
                chuyenCan: buf?.chuyenCan ?? row.chuyenCan,
                thuongKy: buf?.thuongKy ?? row.thuongKy,
                gk: buf?.gk ?? row.gk,
                ck: buf?.ck ?? row.ck,
              };

              const tongKet = tinhTongKet(
                displayScores.chuyenCan,
                displayScores.thuongKy,
                displayScores.gk,
                displayScores.ck,
              );
              const tongKetNum = parseFloat(tongKet);

              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.daChot
                      ? "bg-slate-50/60"
                      : editing
                        ? "bg-blue-50/20"
                        : "hover:bg-gray-50"
                  }`}
                >
                  {/* Sinh viên */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {row.daChot && (
                        <Lock size={12} className="text-slate-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-slate-700">
                          {row.mssv}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {row.hoTen}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Môn học */}
                  <td className="px-4 py-3 text-gray-600 text-xs font-medium">
                    {row.monHoc}
                  </td>

                  {/* Điểm thành phần */}
                  {DIEM_FIELD_CONFIGS.map(({ field }) => {
                    const val = displayScores[field];
                    return (
                      <td
                        key={field}
                        className="px-2 py-3 text-center font-mono"
                      >
                        {editing ? (
                          <ScoreInput
                            value={buf ? buf[field] : String(val)}
                            onChange={(v) =>
                              handleScoreChange(row.id, field, v)
                            }
                          />
                        ) : (
                          <span
                            className={
                              parseFloat(String(val)) < 4
                                ? "text-red-500 font-bold"
                                : "text-slate-600"
                            }
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Tổng kết */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold px-2 py-1 rounded-lg border text-sm ${
                        tongKetNum < 5
                          ? "text-red-600 bg-red-50 border-red-100"
                          : tongKetNum < 7
                            ? "text-amber-600 bg-amber-50 border-amber-100"
                            : "text-emerald-600 bg-emerald-50 border-emerald-100"
                      }`}
                    >
                      {tongKet}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3">
                    {editing ? (
                      <div className="relative">
                        <select
                          value={buf?.trangThai ?? row.trangThai}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleTrangThaiChange(row.id, e.target.value)
                          }
                          className="w-full appearance-none bg-white border border-blue-200 text-[12px] font-semibold text-slate-700 py-1.5 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-blue-400/20 outline-none cursor-pointer"
                        >
                          {TRANG_THAI_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <StatusBadge status={row.trangThai} />
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {!row.daChot && !isEditingAll && (
                        <ActionButton
                          onClick={() => handleChotDiemRow(row.id)}
                          tooltip="Chốt điểm"
                          color="#8b5cf6"
                          icon={<Lock size={14} />}
                        />
                      )}
                      <ActionButton
                        onClick={() => setOpenLichSuThaoTac(true)}
                        tooltip="Lịch sử thao tác"
                        color="#3b82f6"
                        icon={<History size={14} />}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between text-[11px] text-gray-400">
        <span>
          Tổng: <strong className="text-slate-600">{data.length}</strong> sinh
          viên
        </span>
        <span>
          Đã chốt:{" "}
          <strong className="text-violet-600">
            {data.filter((r) => r.daChot).length}
          </strong>
          {" / "}
          Chưa chốt:{" "}
          <strong className="text-amber-600">
            {data.filter((r) => !r.daChot).length}
          </strong>
        </span>
      </div>
    </div>
  );
};
