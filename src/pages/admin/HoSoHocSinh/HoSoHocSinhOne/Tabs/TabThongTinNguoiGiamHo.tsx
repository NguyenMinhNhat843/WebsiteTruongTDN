import { useHoSoHocSinhOneContext } from "../HoSoHocSinhOneProvider";

// 1. Mang component phụ ra NGOÀI hẳn component chính
const FormItemVertical = ({
  label,
  field,
  type = "text",
  isEditMode,
  formData,
  onChange,
}: {
  label: string;
  field: string;
  type?: string;
  isEditMode: boolean;
  formData: any;
  onChange: (field: string, value: any) => void;
}) => {
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-slate-50/50 p-2.5 text-sm text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-1">
      <label className={labelClass}>{label}</label>
      {isEditMode ? (
        <input
          type={type}
          className={inputClass}
          value={formData[field] ?? ""}
          onChange={(e) =>
            onChange(
              field,
              type === "number"
                ? e.target.value
                  ? Number(e.target.value)
                  : null
                : e.target.value,
            )
          }
        />
      ) : (
        <div className="text-sm font-semibold text-gray-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 min-h-[42px] flex items-center">
          {formData[field] || "---"}
        </div>
      )}
    </div>
  );
};

const TabThongTinNguoiGiamHo = () => {
  const { isEditMode, formData, setFormData } = useHoSoHocSinhOneContext();

  if (!formData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-slate-50/50 p-2.5 text-sm text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Khối Cha */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
          Thông Tin Cha
        </h2>
        <div className="space-y-4">
          <FormItemVertical
            label="Họ và tên"
            field="fatherName"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <FormItemVertical
            label="Số điện thoại"
            field="fatherPhone"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <FormItemVertical
            label="Số CCCD"
            field="fatherCCCD"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormItemVertical
              label="Năm sinh"
              field="fatherYearOfBirth"
              type="number"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
            <FormItemVertical
              label="Nghề nghiệp"
              field="fatherJob"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Khối Mẹ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-pink-500"></div>
          Thông Tin Mẹ
        </h2>
        <div className="space-y-4">
          <FormItemVertical
            label="Họ và tên"
            field="motherName"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <FormItemVertical
            label="Số điện thoại"
            field="motherPhone"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <FormItemVertical
            label="Số CCCD"
            field="motherCCCD"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormItemVertical
              label="Năm sinh"
              field="motherYearOfBirth"
              type="number"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
            <FormItemVertical
              label="Nghề nghiệp"
              field="motherJob"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Khối Người giám hộ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-teal-500"></div>
          Người Giám Hộ{" "}
          <span className="text-sm font-medium text-gray-400">
            {formData.guardianRelationship
              ? `(${formData.guardianRelationship})`
              : ""}
          </span>
        </h2>
        <div className="space-y-4">
          <FormItemVertical
            label="Họ và tên"
            field="guardianName"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />

          {isEditMode && (
            <div className="space-y-1">
              <label className={labelClass}>Mối quan hệ</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Ví dụ: Ông, Bà, Cô, Chú..."
                value={formData.guardianRelationship ?? ""}
                onChange={(e) =>
                  handleChange("guardianRelationship", e.target.value)
                }
              />
            </div>
          )}

          <FormItemVertical
            label="Số điện thoại"
            field="guardianPhone"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <FormItemVertical
            label="Số CCCD"
            field="guardianCCCD"
            isEditMode={isEditMode}
            formData={formData}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormItemVertical
              label="Năm sinh"
              field="guardianYearOfBirth"
              type="number"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
            <FormItemVertical
              label="Nghề nghiệp"
              field="guardianJob"
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabThongTinNguoiGiamHo;
