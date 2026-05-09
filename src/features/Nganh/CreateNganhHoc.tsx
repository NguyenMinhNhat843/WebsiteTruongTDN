import { useForm } from "react-hook-form";
import {
  X,
  PlusCircle,
  BookOpen,
  Hash,
  Building2,
  FileText,
} from "lucide-react";
import type { createNganhDto } from "./NganhProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createNganhDto, reset: () => void) => void;
  isPending?: boolean;
}

const CreateNganhModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createNganhDto>();

  if (!isOpen) return null;

  const handleFormSubmit = (data: createNganhDto) => {
    onSubmit(data, reset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <PlusCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Thêm Ngành Học Mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mã ngành */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Hash size={14} /> Mã ngành
              </label>
              <input
                {...register("majorCode", {
                  required: "Vui lòng nhập mã ngành",
                })}
                placeholder="VD: CNTT"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none ${
                  errors.majorCode
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-100"
                }`}
              />
              {errors.majorCode && (
                <p className="text-red-500 text-xs">
                  {String(errors.majorCode.message)}
                </p>
              )}
            </div>

            {/* Tên ngành */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen size={14} /> Tên ngành
              </label>
              <input
                {...register("majorName", {
                  required: "Vui lòng nhập tên ngành",
                })}
                placeholder="VD: Công nghệ thông tin"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none ${
                  errors.majorName
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-100"
                }`}
              />
              {errors.majorName && (
                <p className="text-red-500 text-xs">
                  {String(errors.majorName.message)}
                </p>
              )}
            </div>

            {/* ID Khoa/Phòng ban */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 size={14} /> ID Khoa (deptId)
              </label>
              <input
                type="number"
                {...register("deptId", {
                  required: "Bắt buộc",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={14} /> Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Nhập mô tả về ngành học..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-300"
            >
              {isPending ? "Đang xử lý..." : "Tạo ngành học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNganhModal;
