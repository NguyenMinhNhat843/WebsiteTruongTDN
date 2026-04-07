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

// ─────────────────────────────────────────────────────────────────────────────

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

export default function GradeTable() {
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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-white">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800">Danh sách điểm thi</h2>
          {isEditingAll && (
            <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider font-bold">
              Chế độ chỉnh sửa
            </span>
          )}
          {saved && (
            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold flex items-center gap-1">
              <CheckCircle2 size={10} /> Đã lưu
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {!isEditingAll && (
            <button
              disabled={allLocked}
              onClick={handleChotDiemAll}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all
                ${
                  allLocked
                    ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
                }`}
            >
              <Lock size={14} />
              {allLocked ? "Đã chốt tất cả" : "Chốt điểm tất cả"}
            </button>
          )}

          {!isEditingAll ? (
            <button
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all"
            >
              <Edit3 size={14} /> Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
              >
                <X size={14} /> Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600 transition-all shadow-sm"
              >
                <Save size={14} /> Lưu tất cả
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
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
