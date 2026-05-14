import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";

// Khai báo kiểu dữ liệu dựa trên DTO bạn cung cấp
interface UpdateBatchInput {
  batchName: string;
  curriculumId: number | null;
}

interface UpdateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: khoaDaoTaoDto | null; // Dữ liệu khóa học đang chọn để sửa
  onSave: (id: number, payload: UpdateBatchInput) => void;
  isSubmitting?: boolean;
}

export const UpdateBatchModal = ({
  isOpen,
  onClose,
  data,
  onSave,
  isSubmitting,
}: UpdateBatchModalProps) => {
  const { curriculums } = useKhoaDaoTaoContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateBatchInput>();

  // Reset form khi data thay đổi (khi mở modal)
  useEffect(() => {
    if (data) {
      reset({
        batchName: data.batchName,
        curriculumId: data.curriculumId, // Giả sử lấy từ API hoặc data hiện tại nếu có
      });
    }
  }, [data, reset, isOpen]);

  if (!isOpen || !data) return null;

  const onSubmit = (formData: UpdateBatchInput) => {
    console.log(formData);
    onSave(data.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            Cập nhật khóa đào tạo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Thông tin chỉ đọc (Read-only) */}
          <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase">
                Mã khóa
              </label>
              <p className="text-sm font-semibold text-slate-700">
                {data.batchCode}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase">
                Ngành học
              </label>
              <p className="text-sm font-semibold text-slate-700">
                {data.major?.majorName || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase">
                Thời gian
              </label>
              <p className="text-sm font-semibold text-slate-700">
                {data.startYear} - {data.endYear}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase">
                Trạng thái
              </label>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  data.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Các trường được phép chỉnh sửa */}
          <div className="space-y-4">
            {/* Tên khóa đào tạo */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Tên khóa đào tạo <span className="text-red-500">*</span>
              </label>
              <input
                {...register("batchName", {
                  required: "Tên khóa không được để trống",
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.batchName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="VD: Khóa 2024 - CNTT"
              />
              {errors.batchName && (
                <p className="mt-1 text-[11px] text-red-500 italic">
                  {errors.batchName.message}
                </p>
              )}
            </div>

            {/* Curriculum ID (Sửa id chương trình học) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Chương trình đào tạo (ID)
              </label>
              <select
                {...register("curriculumId", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">-- Chọn chương trình học --</option>
                {curriculums?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.curriculumName} - Phiên bản: {item.version}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-gray-400 italic">
                * Lưu ý: Thay đổi này sẽ ảnh hưởng đến lộ trình học của sinh
                viên trong khóa.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md disabled:bg-indigo-400 transition-all"
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
