import { useState } from "react";
import { HE_DAO_TAO } from "../mockData";

interface CreatePanelProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePanel({ open, onClose }: CreatePanelProps) {
  const [form, setForm] = useState({
    he: "9plus",
    ma: "",
    ten: "",
    khoa: "K2024",
    nganh: "Kế toán",
    chuyenNganh: "Kế toán DN",
    max: 40,
    hk: "HK1 / 2025",
    gvcn: "",
    phong: "",
    hinhThuc: "Tập trung",
    ghiChu: "",
  });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative z-10 w-105 bg-white h-full overflow-y-auto flex flex-col border-l border-gray-200 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-[15px] font-medium">Tạo lớp học mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 px-6 py-4 flex flex-col gap-4">
          {/* Thông tin cơ bản */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2">
            Thông tin cơ bản
          </p>
          <Field label="Hệ đào tạo *">
            <select
              className="input"
              value={form.he}
              onChange={(e) => set("he", e.target.value)}
            >
              {Object.entries(HE_DAO_TAO).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mã lớp *">
              <input
                className="input"
                placeholder="VD: TC-KT-K24A"
                value={form.ma}
                onChange={(e) => set("ma", e.target.value)}
              />
            </Field>
            <Field label="Niên khóa *">
              <select
                className="input"
                value={form.khoa}
                onChange={(e) => set("khoa", e.target.value)}
              >
                {["K2022", "K2023", "K2024"].map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tên lớp">
            <input
              className="input"
              placeholder="VD: Kế toán K24 – Lớp A"
              value={form.ten}
              onChange={(e) => set("ten", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ngành *">
              <select
                className="input"
                value={form.nganh}
                onChange={(e) => set("nganh", e.target.value)}
              >
                {["Kế toán", "CNTT", "Điện – Điện tử", "Cơ khí", "Du lịch"].map(
                  (n) => (
                    <option key={n}>{n}</option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Chuyên ngành">
              <select
                className="input"
                value={form.chuyenNganh}
                onChange={(e) => set("chuyenNganh", e.target.value)}
              >
                {[
                  "Kế toán DN",
                  "Kế toán thuế",
                  "Kế toán tổng hợp",
                  "Lập trình web",
                  "Kỹ thuật phần mềm",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sĩ số tối đa">
              <input
                type="number"
                className="input"
                value={form.max}
                min={1}
                max={80}
                onChange={(e) => set("max", e.target.value)}
              />
            </Field>
            <Field label="Học kỳ bắt đầu">
              <select
                className="input"
                value={form.hk}
                onChange={(e) => set("hk", e.target.value)}
              >
                {["HK1 / 2024", "HK2 / 2024", "HK1 / 2025"].map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Giáo viên & phòng học */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mt-1">
            Giáo viên & phòng học
          </p>
          <Field label="Giáo viên chủ nhiệm">
            <select
              className="input"
              value={form.gvcn}
              onChange={(e) => set("gvcn", e.target.value)}
            >
              <option value="">-- Chưa phân công --</option>
              {[
                "Nguyễn Thị Hoa",
                "Trần Văn Minh",
                "Lê Thị Thu",
                "Phạm Quốc Hùng",
                "Nguyễn Lan Anh",
              ].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phòng học chính">
              <input
                className="input"
                placeholder="VD: A203"
                value={form.phong}
                onChange={(e) => set("phong", e.target.value)}
              />
            </Field>
            <Field label="Hình thức">
              <select
                className="input"
                value={form.hinhThuc}
                onChange={(e) => set("hinhThuc", e.target.value)}
              >
                {["Tập trung", "Vừa học vừa làm", "Trực tuyến"].map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Ghi chú">
            <textarea
              className="input"
              rows={2}
              placeholder="Ghi chú nội bộ..."
              value={form.ghiChu}
              onChange={(e) => set("ghiChu", e.target.value)}
            />
          </Field>

          <div className="flex gap-2 pt-2 pb-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              Tạo lớp học
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}
