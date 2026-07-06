import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Save,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
} from "lucide-react";
import { $api } from "../../../../api/client";
import { useAppContext } from "../../../../AppProvider";

interface DetailDotDanhGiaModalProps {
  periodId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const DetailDotDanhGiaModal = ({
  periodId,
  onClose,
  onSuccess,
}: DetailDotDanhGiaModalProps) => {
  const { hocKysOptions } = useAppContext();
  const isOpen = periodId !== null;

  // States quản lý Form
  const [name, setName] = useState("");
  const [semesterId, setSemesterId] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>(
    [],
  );
  const [error, setError] = useState("");

  // 1. Query Lấy chi tiết đợt đánh giá (Lồng dữ liệu 3 cấp)
  const { data: periodDetail, isLoading: isLoadingDetail } = $api.useQuery(
    "get",
    "/assessment/periods/{id}",
    {
      params: { path: { id: periodId ?? 0 } },
    },
    { enabled: isOpen && !!periodId },
  );

  // 2. Query Lấy toàn bộ danh mục tiêu chí gốc để thay đổi cấu hình nếu muốn
  const { data: allCriteria, isLoading: isLoadingCriteria } = $api.useQuery(
    "get",
    "/assessment/criteria",
    { enabled: isOpen },
  );

  // 3. Mutation Cập nhật dữ liệu
  const { mutate: updatePeriod, isPending: isUpdating } = $api.useMutation(
    "patch",
    "/assessment/periods/{id}",
    {
      onSuccess: () => {
        alert("Cập nhật thông tin đợt đánh giá thành công!");
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        setError(
          (err as any)?.message || "Có lỗi xảy ra khi cập nhật dữ liệu.",
        );
      },
    },
  );

  // Đồng bộ dữ liệu chi tiết từ API vào Form States khi tải xong
  useEffect(() => {
    if (periodDetail) {
      setName(periodDetail.name);
      setSemesterId(periodDetail.semesterId);
      setIsActive(periodDetail.isActive);
      setIsFrozen(periodDetail.isFrozen);

      const activeIds =
        periodDetail.periodCriteria?.map((pc) => pc.criterionId) || [];
      setSelectedCriterionIds(activeIds);
    }
  }, [periodDetail]);
  console.log("Selected criterion IDs:", selectedCriterionIds);

  const toggleCriterion = (id: number) => {
    setSelectedCriterionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Tên đợt đánh giá không được để trống.");
    if (!semesterId) return setError("Vui lòng chọn học kỳ áp dụng.");
    if (selectedCriterionIds.length === 0)
      return setError("Vui lòng chọn ít nhất một tiêu chí.");

    setError("");

    updatePeriod({
      params: { path: { id: periodId! } },
      body: {
        name: name.trim(),
        semesterId: Number(semesterId),
        isActive,
        isFrozen,
        criterionIds: selectedCriterionIds,
      } as any,
    });
  };

  if (!isOpen) return null;

  const isLoading = isLoadingDetail || isLoadingCriteria;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className="fixed inset-0"
        onClick={isUpdating ? undefined : onClose}
      />

      <div className="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isUpdating}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <div className="mb-5 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">
            Chi tiết đợt đánh giá
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Xem thông tin chi tiết và chỉnh sửa cấu hình hệ thống.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3 flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">
              Đang tải thông tin chi tiết...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-1 overflow-y-auto pr-1"
          >
            {/* 1. Chọn học kỳ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Học kỳ áp dụng *
              </label>
              <select
                value={semesterId}
                disabled={isUpdating}
                onChange={(e) => setSemesterId(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-50"
              >
                {hocKysOptions?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Tên đợt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đợt đánh giá *
              </label>
              <input
                type="text"
                disabled={isUpdating}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>

            {/* 3. Toggle Điều khiển Trạng thái nhanh */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    Trạng thái hiển thị
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {isActive ? "Sinh viên nhìn thấy đợt" : "Ẩn khỏi sinh viên"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setIsActive(!isActive)}
                  className="text-gray-600 hover:text-blue-600 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {isActive ? (
                    <ToggleRight className="h-7 w-7 text-blue-600" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Frozen Toggle */}
              <div className="flex items-center justify-between border-l border-gray-200 pl-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    Khóa nhập điểm
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {isFrozen ? "Đóng khóa chỉnh sửa" : "Đang mở chấm điểm"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setIsFrozen(!isFrozen)}
                  className="text-gray-600 hover:text-blue-600 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {isFrozen ? (
                    <span className="inline-flex items-center gap-0.5 text-amber-600">
                      <Lock className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-blue-600">
                      <Unlock className="h-5 w-5" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 4. Cấu hình tiêu chí */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cấu hình tiêu chí áp dụng *
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto bg-gray-50/20">
                {allCriteria?.map((item) => {
                  const isChecked = selectedCriterionIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isUpdating && toggleCriterion(item.id)}
                      className={`flex items-start gap-3 p-2.5 text-xs cursor-pointer transition-colors hover:bg-gray-50 ${isChecked ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="mt-0.5 flex-shrink-0 text-gray-400">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Điểm tối đa: {item.maxScore} đ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm disabled:opacity-70"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DetailDotDanhGiaModal;
