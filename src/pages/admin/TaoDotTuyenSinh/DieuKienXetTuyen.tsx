import React, { type FunctionComponent } from "react";
import {
  ClipboardCheck,
  GraduationCap,
  Wallet,
  Gift,
  X,
  CheckCircle2,
} from "lucide-react";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DieuKienXetTuyenProps {
  formData: any; // Thay 'any' bằng kiểu dữ liệu thực tế của formData
  setFormData: (data: any) => void; // Thay 'any' bằng kiểu dữ liệu thực tế của formData
}

const DieuKienXetTuyen: FunctionComponent<DieuKienXetTuyenProps> = ({
  formData,
  setFormData,
}) => {
  // State lưu danh sách các điều kiện đã chọn
  const selectedConditions = formData.conditions || [];

  const conditionOptions = [
    { value: "thcs", label: "Tốt nghiệp THCS" },
    { value: "thpt", label: "Tốt nghiệp THPT" },
    { value: "suc-khoe", label: "Đủ sức khỏe học tập" },
    { value: "hanh-kiem", label: "Hạnh kiểm Khá trở lên" },
    { value: "do-tuoi", label: "Trong độ tuổi quy định" },
    { value: "all", label: "Không yêu cầu bằng cấp" },
  ];

  // Hàm thêm điều kiện (tránh trùng lặp)
  const handleSelectCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedConditions.includes(val)) {
      setFormData({ ...formData, conditions: [...selectedConditions, val] });
    }
    // Reset value của select về rỗng để có thể chọn lại cái khác
    e.target.value = "";
  };

  // Hàm xóa điều kiện
  const removeCondition = (val: string) => {
    setFormData({
      ...formData,
      conditions: selectedConditions.filter((c: any) => c !== val),
    });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <ClipboardCheck size={18} />
        </div>
        <h3 className="font-bold text-slate-700 uppercase text-[13px] tracking-wider">
          Điều kiện & Chính sách
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phần Điều kiện xét tuyển (Multi-select) */}
        <div className="space-y-3">
          <SelectOption
            label="Điều kiện xét tuyển"
            icon={<GraduationCap size={16} />}
            options={[
              { value: "", label: "-- Chọn điều kiện --" },
              ...conditionOptions.filter(
                (opt) => !selectedConditions.includes(opt.value),
              ),
            ]}
            onChange={handleSelectCondition}
          />

          {/* Hiển thị danh sách các dòng điều kiện đã chọn */}
          <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            {selectedConditions.length > 0 ? (
              selectedConditions.map((val: any) => {
                const label = conditionOptions.find(
                  (o) => o.value === val,
                )?.label;
                return (
                  <div
                    key={val}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-xl shadow-sm animate-in fade-in zoom-in duration-200"
                  >
                    <CheckCircle2 size={14} className="text-amber-500" />
                    <span className="text-[13px] font-bold">{label}</span>
                    <button
                      type="button"
                      onClick={() => removeCondition(val)}
                      className="p-0.5 hover:bg-amber-100 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            ) : (
              <span className="text-[12px] text-slate-400 italic ml-1 mt-1">
                Chưa có điều kiện nào được chọn...
              </span>
            )}
          </div>
        </div>

        {/* Học phí */}
        <Input
          label="Học phí dự kiến (đ/kỳ)"
          placeholder="VD: 4.500.000"
          icon={Wallet}
          value={formData.hocPhi}
          onChange={(e) => setFormData({ ...formData, hocPhi: e.target.value })}
        />
      </div>

      {/* Chính sách ưu tiên */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-700 ml-1 flex items-center gap-2">
          <Gift size={14} /> Chính sách ưu tiên & Học bổng
        </label>
        <textarea
          className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-all min-h-25 text-[14px]"
          placeholder="VD: Miễn 100% học phí cho học sinh hộ nghèo, giảm 50% cho bộ đội xuất ngũ..."
          value={formData.chinhSach}
          onChange={(e) =>
            setFormData({ ...formData, chinhSach: e.target.value })
          }
        />
      </div>
    </section>
  );
};

export default DieuKienXetTuyen;
