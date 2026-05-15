import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Settings, Percent, AlertCircle } from "lucide-react";
import type { CreateGradeComponentDto } from "./GradeComponentProvider";

interface AddGradeComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateGradeComponentDto,
    onSuccess: () => void,
  ) => Promise<void> | void;
  isSubmitting?: boolean;
}

const AddGradeComponentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddGradeComponentModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGradeComponentDto>({
    defaultValues: {
      name: "",
      weight: 0.1, // Giá trị mặc định ban đầu là số thập phân
    },
  });

  // Reset form sạch sẽ mỗi khi đóng hoặc mở modal
  useEffect(() => {
    if (isOpen) {
      reset({ name: "", weight: 0.1 });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateGradeComponentDto) => {
    onSubmit(
      {
        name: data.name.trim(),
        weight: Number(data.weight),
      },
      () => {
        onClose();
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop nền mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Thân Modal */}
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl relative z-10 overflow-hidden transform transition-all scale-100">
        {/* Header - Tăng cỡ chữ lên text-lg */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              Thêm thành phần điểm
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Tạo mới loại điểm hệ số quy đổi tổng kết
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form chính điều khiển bởi React Hook Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 space-y-5">
            {/* Lỗi tổng quan từ server */}
            {errors.root && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2.5 text-sm font-medium">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* 1. Trường nhập tên loại điểm - Chữ hiển thị text-base */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Settings size={14} /> Tên thành phần điểm
              </label>
              <input
                type="text"
                placeholder="Ví dụ: midterm, final, attendance..."
                {...register("name", {
                  required: "Vui lòng nhập tên thành phần điểm.",
                })}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all duration-200 ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/10"
                    : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {errors.name.message}
                </p>
              )}
            </div>

            {/* 2. Trường nhập trọng số dạng FLOAT - Chữ hiển thị text-base */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Percent size={14} /> Trọng số điểm (Hệ số thập phân)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                placeholder="Nhập số thập phân từ 0.01 đến 1.0 (Ví dụ: 0.3)"
                {...register("weight", {
                  required: "Vui lòng nhập trọng số.",
                  min: { value: 0.01, message: "Trọng số thấp nhất là 0.01" },
                  max: { value: 1, message: "Trọng số cao nhất là 1.0" },
                  valueAsNumber: true, // Tự động ép kiểu chuỗi nhập về dạng số Float
                })}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-mono ${
                  errors.weight
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/10"
                    : "border-slate-200 focus:border-blue-500"
                }`}
              />

              {errors.weight ? (
                <p className="text-sm text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> {errors.weight.message}
                </p>
              ) : (
                <p className="text-xs text-slate-400 font-medium">
                  Vui lòng nhập đúng định dạng số thập phân. Ví dụ:{" "}
                  <span className="font-bold text-slate-600">0.1</span> (Chuyên
                  cần), <span className="font-bold text-slate-600">0.3</span>{" "}
                  (Giữa kỳ),{" "}
                  <span className="font-bold text-slate-600">0.6</span> (Cuối
                  kỳ).
                </p>
              )}
            </div>
          </div>

          {/* Footer nút hành động */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-100 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Xác nhận thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGradeComponentModal;
