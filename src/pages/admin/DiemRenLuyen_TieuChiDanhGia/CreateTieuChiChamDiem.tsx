import { useState } from "react";
import { X, Award, Loader2, BarChart2 } from "lucide-react";
import type { components } from "../../../api/v1";
import { $api } from "../../../api/client";

export type CreateTieuChiChamDiemDto =
  components["schemas"]["CreateCriterionDto"];

interface CreateTieuChiChamDiemProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateTieuChiChamDiem = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateTieuChiChamDiemProps) => {
  // Quản lý trạng thái form theo cấu trúc payload
  const [title, setTitle] = useState("");
  const [maxScore, setMaxScore] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<number | undefined>(undefined);

  const [validationError, setValidationError] = useState("");

  const { mutate: createTieuChiChamDiem, isPending } = $api.useMutation(
    "post",
    "/assessment/criteria",
    {
      onSuccess: () => {
        // Reset toàn bộ form về mặc định
        setTitle("");
        setMaxScore(0);
        setSortOrder(undefined);
        setValidationError("");

        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        setValidationError("Có lỗi xảy ra trong quá trình tạo tiêu chí.");
        console.error(err);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra tiêu đề công việc
    if (!title.trim()) {
      setValidationError("Vui lòng nhập tiêu đề của tiêu chí.");
      return;
    }

    // 2. Kiểm tra điểm tối đa
    if (maxScore <= 0) {
      setValidationError("Điểm số tối đa của tiêu chí phải lớn hơn 0.");
      return;
    }

    setValidationError("");

    // Gửi payload lên API
    createTieuChiChamDiem({
      body: {
        title: title.trim(),
        maxScore: Number(maxScore),
        sortOrder:
          sortOrder !== undefined && !isNaN(sortOrder) ? Number(sortOrder) : 0,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop mờ phủ toàn trang */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={isPending ? undefined : onClose}
      />

      {/* Khung nội dung Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng (X) góc phải */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề Modal */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Tạo tiêu chí chấm điểm
          </h3>
        </div>

        {/* Thân Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường 1: Tiêu đề tiêu chí */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Tên tiêu chí <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              autoFocus
              disabled={isPending}
              placeholder="Ví dụ: Ý thức tham gia các hoạt động học thuật, câu lạc bộ..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
            />
          </div>

          {/* Grid chia 2 cột cho Điểm và Thứ tự */}
          <div className="grid grid-cols-2 gap-4">
            {/* Trường 2: Điểm số tối đa */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Điểm tối đa <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                disabled={isPending}
                placeholder="0"
                value={maxScore || ""}
                onChange={(e) => {
                  setMaxScore(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  );
                  if (validationError) setValidationError("");
                }}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              />
            </div>

            {/* Trường 3: Thứ tự sắp xếp (Optional) */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="0"
                disabled={isPending}
                placeholder="Mặc định"
                value={sortOrder ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSortOrder(val === "" ? undefined : Number(val));
                }}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Khu vực thông báo lỗi hiển thị động */}
          {validationError && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {validationError}
            </p>
          )}

          {/* Khu vực nút điều phối hành động */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tạo tiêu chí"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTieuChiChamDiem;
