import { useForm } from "react-hook-form";
import {
  X,
  Calendar,
  Tag,
  CalendarDays,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { CreateHocKyDto } from "./HocKyProvider";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  createHocKy: (data: CreateHocKyDto, onSuccess: () => void) => void;
  isCreateHocKyPending: boolean;
  isCreateHocKyError: boolean;
}

export const CreateHocKyModal = ({
  isOpen,
  onClose,
  createHocKy,
  isCreateHocKyPending,
  isCreateHocKyError,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateHocKyDto>({
    defaultValues: {
      isCurrent: false,
      year: new Date().getFullYear(),
    },
  });

  const watchTerm = watch("term");
  const watchYear = watch("year");

  // Tự động cập nhật name
  useEffect(() => {
    if (watchTerm && watchYear) {
      setValue("name", `HK${watchTerm} - ${watchYear}`);
    }
  }, [watchTerm, watchYear, setValue]);

  const onSubmit = (data: CreateHocKyDto) => {
    // Chuyển đổi dữ liệu year sang number trước khi gửi
    createHocKy(
      {
        ...data,
        year: Number(data.year),
      },
      () => {
        reset(); // Reset form sau khi tạo thành công
        onClose(); // Đóng modal sau khi tạo thành công
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Mở học kỳ mới</h3>
            <p className="text-xs text-gray-500">
              Thiết lập thời gian và trạng thái học kỳ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex gap-4 justify-between items-center">
            {/* Số kỳ */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <Calendar size={14} /> Số kỳ
              </label>
              <input
                type="number"
                {...register("term", {
                  required: "Vui lòng nhập số kỳ",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Năm học */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <Calendar size={14} /> Năm học
              </label>
              <input
                type="number"
                {...register("year", {
                  required: "Vui lòng nhập năm",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Tên học kỳ */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
              <Tag size={14} /> Tên học kỳ
            </label>
            <input
              {...register("name", { required: "Vui lòng nhập tên học kỳ" })}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100"} rounded-xl focus:ring-4 focus:border-indigo-500 outline-none transition-all`}
              placeholder="VD: Học kỳ 1 - 2026"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu & Kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <CalendarDays size={14} /> Bắt đầu
              </label>
              <input
                type="date"
                {...register("startDate", { required: "Bắt buộc" })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <CalendarDays size={14} /> Kết thúc
              </label>
              <input
                type="date"
                {...register("endDate", { required: "Bắt buộc" })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Checkbox Học kỳ hiện tại */}
          <label className="flex items-center gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                {...register("isCurrent")}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-indigo-900">
                Đặt làm học kỳ hiện tại
              </span>
              <span className="text-[11px] text-indigo-600">
                Mọi dữ liệu tài chính và môn học sẽ mặc định vào kỳ này
              </span>
            </div>
          </label>

          {/* Thông báo lỗi từ Server */}
          {isCreateHocKyError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>Có lỗi xảy ra khi tạo học kỳ. Vui lòng thử lại.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isCreateHocKyPending}
              className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              {isCreateHocKyPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isCreateHocKyPending ? "Đang xử lý..." : "Xác nhận mở kỳ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
