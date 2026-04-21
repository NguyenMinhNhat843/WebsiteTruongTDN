import { forwardRef, useImperativeHandle, useState } from "react";
import { LayoutGrid, Hash, UserCircle, Palette, FileText } from "lucide-react";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";

export interface CreateKhoaFormRef {
  submitForm: () => void;
}

const CreateKhoaForm = forwardRef<CreateKhoaFormRef, unknown>((props, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headOfDepartment: "",
    color: "#4f46e5",
    description: "",
    status: "active",
  });

  const handleActualSubmit = () => {
    if (!formData.name || !formData.code) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    console.log("Submitting Data:", formData);
    // Gọi API lưu dữ liệu...
  };

  // Lộ hàm submitForm ra bên ngoài thông qua ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleActualSubmit();
    },
  }));

  return (
    <form className="space-y-6">
      {/* Phần tiêu đề phụ */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-indigo-600 rounded-full" />
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Thông tin cơ bản
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tên Khoa */}
        <Input
          label="Tên khoa chuyên môn"
          placeholder="VD: Khoa Công nghệ Ô tô"
          icon={LayoutGrid}
          require={true}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Mã Khoa */}
        <Input
          label="Mã khoa"
          placeholder="VD: KCNOTO"
          icon={Hash}
          require={true}
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Trưởng Khoa */}
        <Input
          label="Trưởng khoa (Họ tên)"
          placeholder="VD: ThS. Nguyễn Văn A"
          icon={UserCircle}
          require={true}
          value={formData.headOfDepartment}
          onChange={(e) =>
            setFormData({ ...formData, headOfDepartment: e.target.value })
          }
        />

        {/* Màu sắc định danh */}
        <SelectOption
          label="Trạng thái"
          options={["Hoạt động ngay", "Chưa hoạt động"].map((status) => ({
            value: status,
            label: status,
          }))}
          icon={<Palette size={18} />}
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        />
      </div>

      {/* Mô tả ngắn */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-700 ml-1 flex items-center gap-2">
          <FileText size={14} /> Mô tả chức năng / nhiệm vụ
        </label>
        <textarea
          className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[100px] text-[14px]"
          placeholder="Nhập mô tả ngắn về khoa..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </form>
  );
});

export default CreateKhoaForm;
