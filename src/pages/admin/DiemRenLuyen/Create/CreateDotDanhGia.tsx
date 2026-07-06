import { useState } from "react";
import { X, PlusCircle, Loader2 } from "lucide-react";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { useAppContext } from "../../../../AppProvider";

export type CreateDotDanhGiaDto = components["schemas"]["CreatePeriodDto"];

interface CreateDotDanhGiaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateDotDanhGia = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateDotDanhGiaProps) => {
  const { hocKysOptions } = useAppContext();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Hook mutation từ API client của bạn
  const { mutate: createDotDanhGiaDiemRenLuyen, isPending } = $api.useMutation(
    "post",
    "/assessment/periods",
    {
      onSuccess: () => {
        setName("");
        setError("");
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        setError("Có lỗi xảy ra khi kết nối đến máy chủ.");
        console.error(err);
      },
    },
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop nền mờ */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={isPending ? undefined : onClose}
      />

      {/* Nội dung Khung Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-5xl"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tạo đợt đánh giá
          </h3>
        </div>

        {/* Form nhập liệu */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên đợt đánh giá <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              disabled={isPending}
              placeholder="Ví dụ: Học kỳ I - Năm học 2026-2027"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              } disabled:bg-gray-50 disabled:text-gray-500`}
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
            )}
          </div>

          {/* Nhóm nút điều hướng/hành động */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm shadow-blue-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tạo mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDotDanhGia;
