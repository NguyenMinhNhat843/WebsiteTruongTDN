import { useState } from "react";
import { HE_DAO_TAO } from "../mockData";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";

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
          <SelectOption
            label="Hệ đào tạo *"
            options={Object.entries(HE_DAO_TAO).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            value={form.he}
            onChange={(value) => set("he", value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hệ đào tạo *"
              placeholder="VD: TC-KT-K24A"
              value={form.ma}
              onChange={(e) => set("ma", e.target.value)}
            />
            <SelectOption
              label="Niên khóa *"
              options={["K2022", "K2023", "K2024"].map((k) => ({
                value: k,
                label: k,
              }))}
              value={form.khoa}
              onChange={(value) => set("khoa", value)}
            />
          </div>
          <Input
            label="Mã lớp"
            placeholder="VD: TC-KT-K24A"
            value={form.ma}
            onChange={(e) => set("ma", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectOption
              label="Ngành *"
              options={[
                "Kế toán",
                "CNTT",
                "Điện – Điện tử",
                "Cơ khí",
                "Du lịch",
              ].map((n) => ({
                value: n,
                label: n,
              }))}
              value={form.nganh}
              onChange={(value) => set("nganh", value)}
            />
            <SelectOption
              label="Chuyên ngành"
              options={[
                {
                  label: "Kế toán DN",
                  value: "Kế toán DN",
                },
                {
                  label: "Kỹ thuật phần mềm",
                  value: "Kỹ thuật phần mềm",
                },
              ]}
              value={form.chuyenNganh}
              onChange={(e) => set("chuyenNganh", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Sĩ số tối đa"
              type="number"
              min={1}
              max={80}
              value={form.max}
              onChange={(e) => set("max", e.target.value)}
            />
            <SelectOption
              label="Học kỳ bắt đầu"
              options={[
                {
                  label: "HK1 / 2024",
                  value: "HK1 / 2024",
                },
                {
                  label: "HK2 / 2024",
                  value: "HK2 / 2024",
                },
                {
                  label: "HK1 / 2025",
                  value: "HK1 / 2025",
                },
              ]}
              value={form.hk}
              onChange={(e) => set("hk", e.target.value)}
            />
          </div>

          {/* Giáo viên & phòng học */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mt-1">
            Giáo viên & phòng học
          </p>
          <SelectOption
            label="Giáo viên chủ nhiệm"
            options={[
              {
                label: "Nguyễn Thị Hoa",
                value: "Nguyễn Thị Hoa",
              },
              {
                label: "Trần Văn Minh",
                value: "Trần Văn Minh",
              },
            ]}
            value={form.gvcn}
            onChange={(e) => set("gvcn", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phòng học chính"
              placeholder="VD: A203"
              value={form.phong}
              onChange={(e) => set("phong", e.target.value)}
            />
            <SelectOption
              label="Hình thức"
              value={form.hinhThuc}
              onChange={(e) => set("hinhThuc", e.target.value)}
              options={[
                {
                  label: "Tập trung",
                  value: "Tập trung",
                },
                {
                  label: "Vừa học vừa làm",
                  value: "Vừa học vừa làm",
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-800">Ghi chú</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Ghi chú nội bộ..."
              value={form.ghiChu}
              onChange={(e) => set("ghiChu", e.target.value)}
            />
          </div>

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
