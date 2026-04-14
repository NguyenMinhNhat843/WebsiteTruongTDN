import { useState } from "react";
import CreateForm from "./Components/CreateForm";
import type { CreateFormState } from "./chuongTrinhKhung.type";

function CreateModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: CreateFormState;
  onSave: (f: CreateFormState) => void;
  onClose: () => void;
}) {
  const defaultForm: CreateFormState = {
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

  const [form, setForm] = useState<CreateFormState>(initial ?? defaultForm);

  // Hàm set dùng chung
  const set = <K extends keyof CreateFormState>(k: K, v: CreateFormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Logic validation có thể dùng ngay tại đây
  const valid = !!(form.code.trim() && form.name.trim() && form.major.trim());
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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

        <CreateForm form={form} onChange={set} />

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

export default CreateModal;
