import { useState } from "react";
import { X, PlusCircle, Loader2, CheckSquare, Square } from "lucide-react";
import { $api } from "../../../../api/client";
import { useAppContext } from "../../../../AppProvider";

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
  const { hocKysOptions } = useAppContext(); // Danh sách học kỳ [{ value: number, label: string }] hoặc cấu trúc tương tự
  const [name, setName] = useState("");
  const [semesterId, setSemesterId] = useState<number | "">("");
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>(
    [],
  );
  const [error, setError] = useState("");

  // 1. Tải danh sách tiêu chí từ API
  const { data: criteria, isLoading: isLoadingCriteria } = $api.useQuery(
    "get",
    "/assessment/criteria",
    {
      enabled: isOpen, // Chỉ tự động gọi API khi modal được mở ra
    },
  );

  // 2. Hook mutation để tạo đợt đánh giá
  const { mutate: createDotDanhGiaDiemRenLuyen, isPending } = $api.useMutation(
    "post",
    "/assessment/periods",
    {
      onSuccess: () => {
        setName("");
        setSemesterId("");
        setSelectedCriterionIds([]);
        setError("");
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        setError(
          (err as any)?.message || "Có lỗi xảy ra khi kết nối đến máy chủ.",
        );
      },
    },
  );

  // Xử lý chọn/bỏ chọn tiêu chí đánh giá
  const toggleCriterion = (id: number) => {
    setSelectedCriterionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return setError("Vui lòng nhập tên đợt đánh giá.");
    if (!semesterId) return setError("Vui lòng chọn học kỳ áp dụng.");
    if (selectedCriterionIds.length === 0)
      return setError("Vui lòng cấu hình ít nhất một tiêu chí.");

    setError("");

    createDotDanhGiaDiemRenLuyen({
      body: {
        name: name.trim(),
        semesterId: Number(semesterId),
        criterionIds: selectedCriterionIds,
      } as any, // Ép kiểu cho khớp với openapi typescript client sinh ra
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={isPending ? undefined : onClose}
      />

      {/* Nội dung Khung Modal */}
      <div className="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-2.5 mb-5 flex-shrink-0">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tạo mới đợt đánh giá điểm rèn luyện
          </h3>
        </div>

        {/* Form nhập liệu */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto pr-1"
        >
          {/* 1. Chọn học kỳ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Học kỳ áp dụng <span className="text-red-500">*</span>
            </label>
            <select
              value={semesterId}
              disabled={isPending}
              onChange={(e) => {
                setSemesterId(e.target.value ? Number(e.target.value) : "");
                if (error) setError("");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Chọn học kỳ --</option>
              {hocKysOptions?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Nhập tên đợt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên đợt đánh giá <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled={isPending}
              placeholder="Ví dụ: Đợt đánh giá rèn luyện Học kỳ I"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-50"
            />
          </div>

          {/* 3. Cấu hình danh mục tiêu chí */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cấu hình các tiêu chí áp dụng{" "}
              <span className="text-red-500">*</span>
            </label>

            {isLoadingCriteria ? (
              <div className="flex items-center justify-center py-6 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                Đang tải danh mục tiêu chí...
              </div>
            ) : !criteria || criteria.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400">
                Không tìm thấy tiêu chí nào trên hệ thống.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-56 overflow-y-auto bg-gray-50/30">
                {criteria.map((item: any) => {
                  const isChecked = selectedCriterionIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isPending && toggleCriterion(item.id)}
                      className={`flex items-start gap-3 p-3 text-sm cursor-pointer transition-colors hover:bg-gray-50 ${
                        isChecked ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 text-gray-400">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          Điểm tối đa: {item.maxScore} đ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hiển thị thông báo lỗi (Nếu có) */}
          {error && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          {/* Nhóm nút bấm điều hướng */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Tạo đợt"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDotDanhGia;
