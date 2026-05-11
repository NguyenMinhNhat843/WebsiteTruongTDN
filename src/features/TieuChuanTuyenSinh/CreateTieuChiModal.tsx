import { useForm } from "react-hook-form";
import type { CreateTieuChiDto } from "./TieuChuanTuyenSinhProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTieuChiDto, reset: () => void) => void;
}

const FormCreateTieuChi = ({ isOpen, onClose, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTieuChiDto>();

  if (!isOpen) return null;

  const handleFormSubmit = (data: CreateTieuChiDto) => {
    onSubmit(data, reset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Thêm tiêu chí mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Tên tiêu chí */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tiêu chí
            </label>
            <input
              {...register("criterionName", {
                required: "Vui lòng nhập tên tiêu chí",
              })}
              placeholder="VD: Điểm trung bình tích lũy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            {errors.criterionName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.criterionName.message}
              </span>
            )}
          </div>

          {/* Loại dữ liệu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại dữ liệu
            </label>
            <select
              {...register("type")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="NUMBER">NUMBER</option>
              <option value="STRING">STRING</option>
              <option value="BOOLEAN">BOOLEAN</option>
            </select>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (tùy chọn)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Nhập mô tả chi tiết..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-95 transition-all"
            >
              Lưu tiêu chí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCreateTieuChi;
