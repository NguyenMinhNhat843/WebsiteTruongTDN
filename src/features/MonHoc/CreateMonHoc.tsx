import { useForm } from "react-hook-form";
import type { CreatemonHocDto } from "./MonHocProvider";
import { Check, BookOpen, Layers } from "lucide-react";

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
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
    },
  });

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mã môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectCode", {
                    required: "Vui lòng nhập mã môn học",
                  })}
                  className={`w-full text-sm font-medium border rounded-xl px-3.5 py-2 outline-none transition-all ${
                    errors.subjectCode
                      ? "border-red-400 focus:border-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50/30 focus:bg-white"
                  }`}
                  placeholder="VD: IT101"
                />
                {errors.subjectCode && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.subjectCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectName", {
                    required: "Vui lòng nhập tên môn học",
                  })}
                  className={`w-full text-sm font-medium border rounded-xl px-3.5 py-2 outline-none transition-all ${
                    errors.subjectName
                      ? "border-red-400 focus:border-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50/30 focus:bg-white"
                  }`}
                  placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                />
                {errors.subjectName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.subjectName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tín chỉ
                </label>
                <input
                  type="number"
                  {...register("credits", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tối thiểu là 0" },
                  })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Lý thuyết (h)
                </label>
                <input
                  type="number"
                  {...register("theoryHours", { valueAsNumber: true })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Thực hành (h)
                </label>
                <input
                  type="number"
                  {...register("practiceHours", { valueAsNumber: true })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md 
                shadow-blue-500/5 transition-all flex items-center gap-1.5
               bg-blue-600/80 hover:bg-blue-700 cursor-pointer
               disabled:bg-blue-400 disabled:cursor-not-allowed`}
            >
              {isPending ? (
                <>
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
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Lưu môn học</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonHocModal;
