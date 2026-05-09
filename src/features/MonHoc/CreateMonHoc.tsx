import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { CreatemonHocDto } from "./MonHocProvider";

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
    reset,
    formState: { errors },
  } = useForm<CreatemonHocDto>({
    defaultValues: {
      isMandatory: true,
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleInternalSubmit = (data: CreatemonHocDto) => {
    onSubmit(data, reset);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Tạo Môn Học Mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isPending}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleInternalSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mã môn học
              </label>
              <input
                {...register("subjectCode", { required: "Vui lòng nhập mã" })}
                className={`w-full border rounded-lg p-2 outline-none focus:ring-2 ${errors.subjectCode ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                placeholder="VD: IT101"
              />
              {errors.subjectCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subjectCode.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên môn học
              </label>
              <input
                {...register("subjectName", { required: "Vui lòng nhập tên" })}
                className={`w-full border rounded-lg p-2 outline-none focus:ring-2 ${errors.subjectName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                placeholder="VD: Cấu trúc dữ liệu"
              />
              {errors.subjectName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subjectName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tín chỉ
              </label>
              <input
                type="number"
                {...register("credits", { valueAsNumber: true, min: 1 })}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số giờ Lý thuyết
              </label>
              <input
                type="number"
                {...register("theoryHours", { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số giờ Thực hành
              </label>
              <input
                type="number"
                {...register("practiceHours", { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Loại môn học
            </label>
            <select
              {...register("isMandatory", {
                setValueAs: (v) => v === "true",
              })}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="true">Bắt buộc</option>
              <option value="false">Tự chọn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả (tùy chọn)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition flex items-center gap-2 disabled:bg-blue-400"
            >
              {isPending && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isPending ? "Đang lưu..." : "Lưu môn học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonHocModal;
