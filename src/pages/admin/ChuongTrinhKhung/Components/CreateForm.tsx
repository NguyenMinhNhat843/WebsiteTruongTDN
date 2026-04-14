import { EDU_SYSTEM_META, UNIT_LABEL } from "../chuongTrinhKhung.constant";
import type { CreateFormState, EduSystem } from "../chuongTrinhKhung.type";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";

interface FieldProps {
  form: CreateFormState; // Chuyển state ra ngoài
  onChange: <K extends keyof CreateFormState>(
    k: K,
    v: CreateFormState[K],
  ) => void;
}

const CreateForm = ({ form, onChange }: FieldProps) => {
  const set = onChange;
  return (
    <form className="overflow-y-auto px-6 py-5 space-y-6 bg-slate-50/20">
      {/* HỆ ĐÀO TẠO */}
      <section>
        <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
          Hệ đào tạo <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
            const m = EDU_SYSTEM_META[sys],
              sel = form.eduSystem === sys;
            return (
              <button
                key={sys}
                type="button"
                onClick={() => set("eduSystem", sys)}
                className={`rounded-2xl p-3.5 text-left border-2 transition-all ${sel ? `${m.bg} ${m.border} ${m.color} shadow-sm` : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
              >
                <p className="text-sm font-black">{m.short}</p>
                <p className="text-[10px] leading-tight mt-0.5 opacity-80 uppercase font-medium">
                  {m.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* CÁC NHÓM INPUT GRID */}
      {[
        {
          items: [
            { n: "code", l: "Mã chương trình *", p: "VD: CTK-CĐ-CNTT-2025" },
            { n: "effectiveYear", l: "Năm áp dụng", t: "number" },
          ],
          cols: "grid-cols-2",
        },
        {
          items: [
            {
              n: "name",
              l: "Tên ngành / nghề đào tạo *",
              p: "VD: Công nghệ thông tin",
            },
          ],
          cols: "grid-cols-1",
        },
        {
          items: [
            {
              n: "major",
              l: "Ngành / Nghề chính thức *",
              p: "VD: Điện công nghiệp",
            },
            {
              n: "department",
              l: "Khoa / Bộ môn",
              p: "VD: Khoa Điện – Điện tử",
            },
          ],
          cols: "grid-cols-2",
        },
        {
          items: [
            {
              n: "unitType",
              l: "Đơn vị học tập",
              type: "select",
              opt: [
                { value: "tin_chi", label: "Tín chỉ (TC)" },
                { value: "don_vi_hoc_trinh", label: "ĐVHT" },
                { value: "gio", label: "Giờ học" },
              ],
            },
            {
              n: "totalUnits",
              l: `Tổng ${UNIT_LABEL[form.unitType]}`,
              t: "number",
            },
            { n: "duration", l: "Thời gian đào tạo", p: "VD: 2 năm, 3 tháng" },
          ],
          cols: "grid-cols-3",
        },
        {
          items: [
            { n: "issuedBy", l: "Cơ quan ban hành", p: "VD: Bộ LĐTBXH" },
            { n: "decisionNo", l: "Số quyết định", p: "VD: 2713/QĐ-BLĐTBXH" },
          ],
          cols: "grid-cols-2",
        },
        {
          items: [
            {
              n: "status",
              l: "Trạng thái",
              type: "select",
              opt: [
                { value: "draft", label: "Bản nháp" },
                { value: "active", label: "Đang áp dụng" },
                { value: "archived", label: "Lưu trữ" },
              ],
            },
          ],
          cols: "grid-cols-1",
        },
      ].map((group, i) => (
        <div key={i} className={`grid ${group.cols} gap-3`}>
          {group.items.map((f) =>
            f.type === "select" ? (
              <SelectOption
                options={f.opt}
                key={f.n}
                label={f.l}
                labelClassName="text-xs"
                onChange={(v) => set(f.n as keyof typeof form, v.target.value)}
                value={form[f.n as keyof typeof form]}
              />
            ) : (
              <Input
                key={f.n}
                label={f.l}
                type={f.t || "text"}
                value={form[f.n as keyof typeof form]}
                placeholder={f.p}
                onChange={(v) =>
                  set(
                    f.n as keyof typeof form,
                    f.t === "number" ? +v.target.value : v.target.value,
                  )
                }
                labelClassName="text-xs font-semibold text-slate-600 mb-1.5"
                className="rounded-xl border-slate-200"
              />
            ),
          )}
        </div>
      ))}
    </form>
  );
};

export default CreateForm;
