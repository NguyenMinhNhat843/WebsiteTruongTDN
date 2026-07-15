import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";

interface UpdateBatchInput {
  batchName: string;
  curriculumId: number | null;
}

interface UpdateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: khoaDaoTaoDto | null;
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

  // Reset form khi dữ liệu data thay đổi hoặc khi mở modal
  useEffect(() => {
    if (data) {
      reset({
        batchName: data.batchName,
        curriculumId: data.curriculumId ?? null,
      });
    }
  }, [data, reset, isOpen]);

  if (!isOpen || !data) return null;

  const onSubmit = (formData: UpdateBatchInput) => {
    onSave(data.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Cập nhật khóa đào tạo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chỉnh sửa thông tin hành chính và khung chương trình học
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Metadata Cards (Read-only) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mã khóa đào tạo
              </span>
              <p className="text-sm font-semibold text-slate-700 py-0.5">
                {data.batchCode}
              </p>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ngành học tuyển sinh
              </span>
              <p
                className="text-sm font-semibold text-slate-700 py-0.5 truncate"
                title={data.major?.majorName || "N/A"}
              >
                {data.major?.majorName || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Thời gian đào tạo
              </span>
              <p className="text-sm font-medium text-slate-600 py-0.5">
                Năm học:{" "}
                <span className="font-semibold text-slate-700">
                  {data.startYear} — {data.endYear}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Trạng thái hiện tại
              </span>
              <div className="py-0.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    data.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${data.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`}
                  />
                  {data.status === "ACTIVE"
                    ? "Đang hoạt động"
                    : "Ngưng kích hoạt"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Tên khóa đào tạo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Tên khóa đào tạo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("batchName", {
                    required: "Tên khóa không được bỏ trống",
                  })}
                  className={`w-full px-3.5 py-2.5 text-sm text-slate-800 border rounded-xl shadow-sm outline-none transition-all duration-200 bg-white focus:ring-4 focus:ring-indigo-500/10 ${
                    errors.batchName
                      ? "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500"
                  }`}
                  placeholder="Ví dụ: Khóa 2024 — Công nghệ thông tin"
                />
              </div>
              {errors.batchName && (
                <p className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.batchName.message}
                </p>
              )}
            </div>

            {/* Chương trình đào tạo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Chương trình đào tạo áp dụng
              </label>
              <div className="relative">
                <select
                  {...register("curriculumId", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl shadow-sm outline-none transition-all duration-200 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">-- Chọn chương trình học --</option>
                  {curriculums?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.curriculumName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-2 bg-amber-50/60 border border-amber-100 rounded-lg p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-amber-800 leading-normal font-medium">
                  Lưu ý: Thay đổi chương trình học sẽ lập tức cập nhật lộ trình
                  học mới cho tất cả sinh viên thuộc khóa này.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:bg-indigo-400 transition-all duration-150 flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
