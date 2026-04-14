import { useState } from "react";
import type {
  EduSystem,
  ModuleType,
  Status,
  UnitType,
} from "./chuongTrinhKhung.type";
import {
  EDU_SYSTEM_META,
  MODULE_TYPE_META,
  UNIT_LABEL,
} from "./chuongTrinhKhung.constant";
import { StatusBadge } from "./Components/StatusBadge";
import { EduBadge } from "./Components/EduBadge";
import { ModTypeBadge } from "./Components/ModTypeBadge";
import { StatCard } from "../../../components/ui/StatCard";
import { Plus } from "lucide-react";
import {
  ChuongTrinhKhungProvider,
  useChuongTrinhKhungContext,
} from "./ChuongTrinhKhungProvider";
import Filters from "./Components/Filters";
import ChuongTrinhKhungList from "./Components/ChuongTrinhKhungList";

// ─── Form ─────────────────────────────────────────────────────────────────────

export type FormState = {
  code: string;
  name: string;
  major: string;
  department: string;
  eduSystem: EduSystem;
  totalUnits: number;
  unitType: UnitType;
  duration: string;
  status: Status;
  effectiveYear: number;
  issuedBy: string;
  decisionNo: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
      />
    </div>
  );
}

function FormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: FormState;
  onSave: (f: FormState) => void;
  onClose: () => void;
}) {
  const defaultForm: FormState = {
    code: "",
    name: "",
    major: "",
    department: "",
    eduSystem: "trung_cap",
    totalUnits: 65,
    unitType: "tin_chi",
    duration: "2 năm",
    status: "draft",
    effectiveYear: 2025,
    issuedBy: "",
    decisionNo: "",
  };
  const [form, setForm] = useState<FormState>(initial ?? defaultForm);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));
  const valid = form.code.trim() && form.name.trim() && form.major.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Chương trình khung
            </p>
            <h3 className="text-base font-black text-slate-800">
              {initial ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Hệ đào tạo <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
                const m = EDU_SYSTEM_META[sys];
                const sel = form.eduSystem === sys;
                return (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => set("eduSystem", sys)}
                    className={`rounded-xl px-3 py-2.5 text-left border-2 transition-all ${sel ? `${m.bg} ${m.border} ${m.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    <p className="text-sm font-black">{m.short}</p>
                    <p className="text-[10px] leading-tight mt-0.5 opacity-80">
                      {m.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Mã chương trình *"
              value={form.code}
              onChange={(v) => set("code", v)}
              placeholder="VD: CTK-CĐ-CNTT-2025"
            />
            <Field
              label="Năm áp dụng"
              type="number"
              value={String(form.effectiveYear)}
              onChange={(v) => set("effectiveYear", +v)}
            />
          </div>
          <Field
            label="Tên ngành / nghề đào tạo *"
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="VD: Công nghệ thông tin"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Ngành / Nghề chính thức *"
              value={form.major}
              onChange={(v) => set("major", v)}
              placeholder="VD: Điện công nghiệp"
            />
            <Field
              label="Khoa / Bộ môn"
              value={form.department}
              onChange={(v) => set("department", v)}
              placeholder="VD: Khoa Điện – Điện tử"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Đơn vị học tập
              </label>
              <select
                value={form.unitType}
                onChange={(e) => set("unitType", e.target.value as UnitType)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
              >
                <option value="tin_chi">Tín chỉ (TC)</option>
                <option value="don_vi_hoc_trinh">ĐVHT</option>
                <option value="gio">Giờ học</option>
              </select>
            </div>
            <Field
              label={`Tổng ${UNIT_LABEL[form.unitType]}`}
              type="number"
              value={String(form.totalUnits)}
              onChange={(v) => set("totalUnits", +v)}
            />
            <Field
              label="Thời gian đào tạo"
              value={form.duration}
              onChange={(v) => set("duration", v)}
              placeholder="VD: 2 năm, 3 tháng"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cơ quan ban hành"
              value={form.issuedBy}
              onChange={(v) => set("issuedBy", v)}
              placeholder="VD: Bộ LĐTBXH"
            />
            <Field
              label="Số quyết định"
              value={form.decisionNo}
              onChange={(v) => set("decisionNo", v)}
              placeholder="VD: 2713/QĐ-BLĐTBXH"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as Status)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            >
              <option value="draft">Bản nháp</option>
              <option value="active">Đang áp dụng</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
          >
            {initial ? "Lưu thay đổi" : "Tạo chương trình"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CurriculumFrameworkPage() {
  return (
    <ChuongTrinhKhungProvider>
      <Inner />
    </ChuongTrinhKhungProvider>
  );
}

function Inner() {
  const {
    setFrameworks,
    activeTab,
    setActiveTab,
    showForm,
    setShowForm,
    editTarget,
    setEditTarget,
    selected,
    stats,
    handleSave,
    handleDelete,
    breakdown,
    hrs,
  } = useChuongTrinhKhungContext();

  return (
    <div className="min-h-screen bg-[#f4f5f8]">
      {/* Top nav */}
      <div className="bg-white px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none">
                Chương trình khung
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus />
            Thêm chương trình
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              l: "Tổng chương trình",
              v: stats.total,
            },
            {
              l: "Đang áp dụng",
              v: stats.active,
            },
            {
              l: "Bản nháp",
              v: stats.draft,
            },
            {
              l: "Số hệ đào tạo",
              v: stats.systems,
            },
          ].map((s) => (
            <StatCard label={s.l} value={s.v} />
          ))}
        </div>

        <Filters />

        {/* Master / Detail */}
        <div className="flex gap-4 items-start">
          <ChuongTrinhKhungList />

          {/* Detail */}
          {selected ? (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-w-0">
              {/* Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <EduBadge sys={selected.eduSystem} />
                      <StatusBadge status={selected.status} />
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {selected.code}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-800">
                      {selected.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Ngành:{" "}
                      <strong className="text-slate-600">
                        {selected.major}
                      </strong>{" "}
                      · {selected.department} · Từ năm{" "}
                      <strong className="text-slate-600">
                        {selected.effectiveYear}
                      </strong>
                    </p>
                    {selected.decisionNo !== "—" && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        QĐ:{" "}
                        <span className="font-mono text-slate-600">
                          {selected.decisionNo}
                        </span>
                        {selected.issuedBy && (
                          <span> — {selected.issuedBy}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => {
                        setEditTarget(selected);
                        setShowForm(true);
                      }}
                      className="text-xs font-semibold text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Sửa
                    </button>
                    {selected.status === "draft" && (
                      <button
                        onClick={() =>
                          setFrameworks((p) =>
                            p.map((f) =>
                              f.id === selected.id
                                ? { ...f, status: "active" }
                                : f,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✓ Áp dụng
                      </button>
                    )}
                    {selected.status === "active" && (
                      <button
                        onClick={() =>
                          setFrameworks((p) =>
                            p.map((f) =>
                              f.id === selected.id
                                ? { ...f, status: "archived" }
                                : f,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-amber-600 border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Lưu trữ
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {(["overview", "modules"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {t === "overview"
                        ? "Tổng quan"
                        : "Danh mục môn học / mô-đun"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overview */}
              {activeTab === "overview" && breakdown && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        l: "Tổng " + UNIT_LABEL[selected.unitType],
                        v: selected.totalUnits,
                      },
                      { l: "Thời gian", v: selected.duration },
                      { l: "Tổng giờ (LT+TH)", v: hrs + "h" },
                      { l: "Học kỳ / Giai đoạn", v: selected.terms.length },
                    ].map((item) => (
                      <div
                        key={item.l}
                        className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200"
                      >
                        <p className="text-lg font-black text-slate-800">
                          {item.v}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          {item.l}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown */}
                  <div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
                      Phân bổ khối lượng theo loại
                    </p>
                    <div className="space-y-2">
                      {(Object.keys(MODULE_TYPE_META) as ModuleType[]).map(
                        (t) => {
                          const val = breakdown[t];
                          if (val === 0) return null;
                          const pct =
                            selected.totalUnits > 0
                              ? Math.round((val / selected.totalUnits) * 100)
                              : 0;
                          const m = MODULE_TYPE_META[t];
                          return (
                            <div key={t} className="flex items-center gap-3">
                              <span
                                className={`text-[10px] px-2 py-1 rounded font-bold w-28 text-center ${m.color}`}
                              >
                                {m.label}
                              </span>
                              <div className="flex-1 bg-slate-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${m.bar}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 w-28 text-right font-semibold">
                                {val} {UNIT_LABEL[selected.unitType]}{" "}
                                <span className="text-slate-400 font-normal">
                                  ({pct}%)
                                </span>
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Term map */}
                  {selected.terms.length > 0 && (
                    <div>
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
                        Sơ đồ học kỳ / giai đoạn
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {selected.terms.map((term) => (
                          <div
                            key={term.id}
                            className={`rounded-xl border px-4 py-3 min-w-30 text-center ${term.internship ? "border-orange-200 bg-gradient-to-b from-orange-50 to-white" : "border-slate-200 bg-gradient-to-b from-slate-50 to-white"}`}
                          >
                            <p className="text-base font-black text-slate-700">
                              {term.modules.length}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {term.internship ? "🏭 Thực tập" : "môn / mô-đun"}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                              {term.label}
                            </p>
                            <p className="text-xs font-black text-slate-600 mt-1.5">
                              {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
                              <span className="font-normal text-slate-400 text-[10px]">
                                {UNIT_LABEL[selected.unitType]}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-300 border-t border-slate-100 pt-3">
                    Tạo: {selected.createdAt} · Cập nhật: {selected.updatedAt}
                  </p>
                </div>
              )}

              {/* Modules tab */}
              {activeTab === "modules" && (
                <div className="p-5 space-y-5">
                  {selected.terms.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm">Chưa có môn học / mô-đun nào.</p>
                      <p className="text-xs mt-1">
                        Cần tích hợp chức năng quản lý chi tiết từng học kỳ.
                      </p>
                    </div>
                  )}
                  {selected.terms.map((term) => (
                    <div key={term.id}>
                      <div
                        className={`flex items-center gap-3 mb-2 pb-2 border-b ${term.internship ? "border-orange-200" : "border-slate-200"}`}
                      >
                        <h3
                          className={`text-sm font-black ${term.internship ? "text-orange-600" : "text-slate-700"}`}
                        >
                          {term.internship ? "🏭 " : ""}
                          {term.label}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {term.modules.length} MH/MĐ
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
                          {UNIT_LABEL[selected.unitType]}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                          LT: {term.modules.reduce((a, m) => a + m.theory, 0)}t
                          &nbsp;|&nbsp; TH:{" "}
                          {term.modules.reduce((a, m) => a + m.practice, 0)}t
                        </span>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-sm min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                              <th className="text-left px-3 py-2">Mã</th>
                              <th className="text-left px-3 py-2">
                                Tên môn học / mô-đun
                              </th>
                              <th className="text-center px-3 py-2">
                                {UNIT_LABEL[selected.unitType]}
                              </th>
                              <th className="text-center px-3 py-2">LT</th>
                              <th className="text-center px-3 py-2">TH</th>
                              <th className="text-left px-3 py-2">Loại</th>
                              <th className="text-left px-3 py-2">
                                Tiên quyết
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {term.modules.map((mod, i) => (
                              <tr
                                key={mod.id}
                                className={`border-b border-slate-100 last:border-0 ${mod.isKey ? "bg-blue-50/40" : i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                              >
                                <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-blue-600">
                                  {mod.code}
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="font-semibold text-slate-700 text-sm">
                                    {mod.name}
                                  </span>
                                  {mod.isKey && (
                                    <span className="ml-2 text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                      Trọng tâm
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 text-center font-black text-slate-700">
                                  {mod.units}
                                </td>
                                <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                                  {mod.theory}
                                </td>
                                <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                                  {mod.practice}
                                </td>
                                <td className="px-3 py-2.5">
                                  <ModTypeBadge type={mod.type} />
                                </td>
                                <td className="px-3 py-2.5">
                                  {mod.prerequisite?.length ? (
                                    mod.prerequisite.map((p) => (
                                      <span
                                        key={p}
                                        className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mr-1"
                                      >
                                        {p}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-300 text-xs">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-slate-300"
                >
                  <path
                    d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10h8M8 14h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-black text-slate-500">
                  Chọn chương trình để xem chi tiết
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Bấm vào một chương trình ở danh sách bên trái.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 justify-center max-w-sm">
                {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
                  const m = EDU_SYSTEM_META[sys];
                  return (
                    <span
                      key={sys}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${m.bg} ${m.color} ${m.border}`}
                    >
                      {m.short} — {m.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <FormModal
          initial={
            editTarget
              ? {
                  code: editTarget.code,
                  name: editTarget.name,
                  major: editTarget.major,
                  department: editTarget.department,
                  eduSystem: editTarget.eduSystem,
                  totalUnits: editTarget.totalUnits,
                  unitType: editTarget.unitType,
                  duration: editTarget.duration,
                  status: editTarget.status,
                  effectiveYear: editTarget.effectiveYear,
                  issuedBy: editTarget.issuedBy,
                  decisionNo: editTarget.decisionNo,
                }
              : undefined
          }
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}
