import { useForm, Controller } from "react-hook-form";
import type { CreatemonHocDto } from "./MonHocProvider";
import { BookOpen, Layers, Code, Type, Hash, Clock } from "lucide-react";
import { useAppContext } from "../../../AppProvider";
import Input from "../../../components/ui/Form/Input";
import SelectSearchInput from "../../../components/ui/Form/SelectInput";
import ButtonAction from "../../../components/ui/ButtonAction";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatemonHocDto, reset: () => void) => void;
  isPending: boolean;
}

const CreateMonHocModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatemonHocDto>({
    defaultValues: {
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
      testHours: 0,
    },
  });

  const { departments, isDepartmentsLoading } = useAppContext();
  const departmentOptions =
    departments?.map((dept) => ({
      label: dept.deptName,
      value: dept.id,
    })) || [];

  // Hàm loại bỏ dấu tiếng Việt để sinh mã không bị dính ký tự có dấu (VD: "Hướng" -> "H" thay vì "HƯ")
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Hàm chuyển đổi chuỗi tên thành các ký tự viết tắt đầu tiên
  const generateSubjectCode = (name: string) => {
    if (!name) return "";
    const cleanName = removeVietnameseTones(name);
    return cleanName
      .split(/\s+/) // Tách chuỗi theo khoảng trắng
      .map((word) => word.charAt(0)) // Lấy ký tự đầu tiên của từng từ
      .join("")
      .toUpperCase(); // Chuyển thành chữ viết hoa
  };

  const handleInternalSubmit = (data: CreatemonHocDto) => {
    onSubmit(
      {
        ...data,
      },
      () => {
        reset();
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Tạo Môn Học Mới
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập thông tin chung và cấu hình khung điểm thành phần
                riêng biệt.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            disabled={isPending}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit(handleInternalSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} /> Thông tin cơ bản
            </h4>

            {/* Hàng 1: Tên môn học & Mã môn học */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Custom onChange của React Hook Form cho Tên môn học */}
              <Input
                label="Tên môn học"
                icon={Type}
                require
                placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                error={errors.subjectName?.message}
                {...register("subjectName", {
                  required: "Vui lòng nhập tên môn học",
                  onChange: (e) => {
                    const nameValue = e.target.value;
                    const generatedCode = generateSubjectCode(nameValue);
                    // Tự động set giá trị sang trường subjectCode một cách an toàn
                    setValue("subjectCode", generatedCode, {
                      shouldValidate: true,
                    });
                  },
                })}
              />

              <Input
                label="Mã môn học"
                icon={Code}
                require
                placeholder="VD: IT101"
                error={errors.subjectCode?.message}
                {...register("subjectCode", {
                  required: "Vui lòng nhập mã môn học",
                })}
              />
            </div>

            {/* Hàng 3: Cấu hình Tín chỉ / Số giờ */}
            <div className="grid grid-cols-4 gap-4">
              <Input
                type="number"
                label="Tín chỉ"
                icon={Hash}
                error={errors.credits?.message}
                {...register("credits", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Tối thiểu là 0" },
                })}
              />

              <Input
                type="number"
                label="Lý thuyết (h)"
                icon={Clock}
                error={errors.theoryHours?.message}
                {...register("theoryHours", { valueAsNumber: true })}
              />

              <Input
                type="number"
                label="Thực hành (h)"
                icon={Clock}
                error={errors.practiceHours?.message}
                {...register("practiceHours", { valueAsNumber: true })}
              />

              <Input
                type="number"
                label="Kiểm tra (h)"
                icon={Clock}
                error={errors.testHours?.message}
                {...register("testHours", { valueAsNumber: true })}
              />
            </div>

            {/* Hàng 2: Chọn Khoa/Bộ môn (Department) */}
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="departmentId"
                control={control}
                render={({ field: { onChange, value, name, ref } }) => (
                  <SelectSearchInput
                    ref={ref}
                    name={name}
                    label="Khoa / Bộ môn quản lý"
                    placeholder={
                      isDepartmentsLoading
                        ? "Đang tải danh sách khoa..."
                        : "--- Chọn khoa / bộ môn ---"
                    }
                    isLoading={isDepartmentsLoading}
                    options={departmentOptions}
                    value={value ?? ""}
                    error={errors.departmentId?.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val ? Number(val) : null);
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <ButtonAction
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </ButtonAction>

            <ButtonAction type="submit" variant="primary" loading={isPending}>
              Lưu môn học
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonHocModal;
