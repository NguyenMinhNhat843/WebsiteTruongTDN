import { useForm } from "react-hook-form";
import {
  X,
  Hash,
  Book,
  Calendar,
  Info,
  Layers,
  FileText,
  Activity,
} from "lucide-react";
import {
  useKhoaDaoTaoContext,
  type createKhoaDaoTaoDTO,
} from "./KhoaHocProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createKhoaDaoTaoDTO) => void;
  isPending: boolean;
}

const CreateBatchModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const { majors } = useKhoaDaoTaoContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createKhoaDaoTaoDTO>({
    defaultValues: {
      status: "ACTIVE", // Giá trị mặc định cho status
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="text-blue-600" size={24} /> Thêm Khóa Đào Tạo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batch Code */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Hash size={14} /> Mã khóa
              </label>
              <input
                {...register("batchCode", { required: "Không được để trống" })}
                placeholder="VD: K24-CNTT"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none transition-all ${errors.batchCode ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100"}`}
              />
              {errors.batchCode && (
                <span className="text-red-500 text-xs">
                  {errors.batchCode.message}
                </span>
              )}
            </div>

            {/* Batch Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Info size={14} /> Tên khóa
              </label>
              <input
                {...register("batchName", { required: "Không được để trống" })}
                placeholder="VD: Khóa 2024 Công nghệ thông tin"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none transition-all ${errors.batchName ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100"}`}
              />
              {errors.batchName && (
                <span className="text-red-500 text-xs">
                  {errors.batchName.message}
                </span>
              )}
            </div>

            {/* Start Year */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={14} /> Năm bắt đầu
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Bắt buộc",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* End Year */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={14} /> Năm kết thúc
              </label>
              <input
                type="number"
                {...register("endYear", {
                  required: "Bắt buộc",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Major ID Selection */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers size={14} className="text-blue-500" /> Ngành học
              </label>
              <select
                {...register("majorId", {
                  required: "Vui lòng chọn ngành học",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="">-- Chọn ngành học --</option>
                {majors?.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.majorName}
                  </option>
                ))}
              </select>
            </div>

            {/* Curriculum ID */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={14} /> Chương trình khung (ID)
              </label>
              <input
                type="number"
                {...register("curriculumId", { valueAsNumber: true })}
                placeholder="Tùy chọn"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Activity size={14} /> Trạng thái
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
                <option value="UPCOMING">Sắp mở</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Mô tả
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Đang xử lý..." : "Lưu khóa đào tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchModal;
