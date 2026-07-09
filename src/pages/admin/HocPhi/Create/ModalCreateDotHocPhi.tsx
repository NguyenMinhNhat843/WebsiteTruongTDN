import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { $api } from "../../../../api/client";

interface ModalCreateDotHocPhiProps {
  isOpen: boolean;
  onClose: () => void;
  tuitionId?: number; // Nếu có id -> Mode Update, không có -> Mode Create
  onSuccess?: () => void;
}

const ModalCreateDotHocPhi = ({
  isOpen,
  onClose,
  tuitionId,
  onSuccess,
}: ModalCreateDotHocPhiProps) => {
  const isUpdateMode = !!tuitionId;

  // --- State quản lý Form ---
  const [formData, setFormData] = useState({
    name: "",
    semesterId: "", // Lưu dạng string để quản lý thẻ <select> dễ dàng
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // 1. Query: Lấy chi tiết đợt học phí (Chỉ chạy ở Mode Update và khi Modal mở)
  const { data: dotHocPhiOne, isPending: isPendingFetch } = $api.useQuery(
    "get",
    "/tuition-periods/{id}",
    {
      params: {
        path: { id: tuitionId! },
      },
    },
    {
      enabled: isUpdateMode && isOpen,
    },
  );

  // Lấy danh sách học kỳ cho thẻ Select (Chỉ gọi khi modal mở)
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
    {}, // Cần truyền object trống cho config/params nếu api ko yêu cầu, tùy thuộc bản api client của bạn
    {
      enabled: isOpen,
    },
  );

  // 2. Mutations: Tạo mới & Cập nhật
  const { mutate: createDotHocPhi, isPending: isPendingCreate } =
    $api.useMutation("post", "/tuition-periods");

  const { mutate: updateDotHocPhi, isPending: isPendingUpdate } =
    $api.useMutation("patch", "/tuition-periods/{id}");

  // 3. Đổ dữ liệu cũ vào form khi fetch thành công (Mode Update) hoặc reset form (Mode Create)
  useEffect(() => {
    if (isUpdateMode && dotHocPhiOne) {
      // Helper convert ISO string sang định dạng input datetime-local (YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateStr: string) =>
        dateStr ? dateStr.substring(0, 16) : "";

      setFormData({
        name: dotHocPhiOne.name ?? "",
        semesterId: String(dotHocPhiOne.semesterId ?? ""),
        startDate: formatDateTime(dotHocPhiOne.startDate ?? ""),
        endDate: formatDateTime(dotHocPhiOne.endDate ?? ""),
        isActive: dotHocPhiOne.isActive ?? true,
      });
    } else if (!isUpdateMode) {
      // Reset form khi chuyển về mode Create
      setFormData({
        name: "",
        semesterId: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });
    }
  }, [dotHocPhiOne, isUpdateMode, isOpen]);

  if (!isOpen) return null;

  // --- Xử lý thay đổi Input & Select ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // --- Submit Form ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      semesterId: Number(formData.semesterId),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive,
    };

    if (isUpdateMode) {
      updateDotHocPhi(
        {
          params: { path: { id: tuitionId! } },
          body: payload as any,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
        },
      );
    } else {
      createDotHocPhi(
        {
          body: payload as any,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
        },
      );
    }
  };

  const isSubmitting = isPendingCreate || isPendingUpdate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">
            {isUpdateMode ? "Cập nhật đợt học phí" : "Thêm mới đợt học phí"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading khi fetch dữ liệu cũ */}
        {isUpdateMode && isPendingFetch ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500">
              Đang tải dữ liệu đợt học phí...
            </p>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Tên đợt học phí */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên đợt học phí
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-slate-800"
                placeholder="Ví dụ: Học phí học kỳ 1 - Đợt 1"
              />
            </div>

            {/* Chọn Học kỳ (Dropdown Select) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Chọn học kỳ
              </label>
              <div className="relative">
                <select
                  name="semesterId"
                  required
                  value={formData.semesterId}
                  onChange={handleChange}
                  disabled={isLoadingSemesters}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                >
                  <option value="" disabled hidden>
                    {isLoadingSemesters
                      ? "Đang tải học kỳ..."
                      : "-- Chọn học kỳ --"}
                  </option>
                  {semesters?.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
                {/* Custom arrow cho thẻ select nếu cần (hoặc dùng mặc định của trình duyệt) */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  {isLoadingSemesters ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Thời gian cấu hình */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Trạng thái Kích hoạt */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  Trạng thái hoạt động
                </span>
                <span className="text-xs text-slate-400">
                  Cho phép áp dụng đợt học phí này ngay
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>{isUpdateMode ? "Cập nhật" : "Tạo mới"}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalCreateDotHocPhi;
