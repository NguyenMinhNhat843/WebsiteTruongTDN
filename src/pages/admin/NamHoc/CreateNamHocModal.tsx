import { useEffect, useState } from "react";
import { $api } from "../../../api/client";
import { X, Calendar, Hash, Layers } from "lucide-react";
import type { AcademicYearDto } from "../../../api/entity";

interface CreateNamHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data?: AcademicYearDto | null;
  isLoading?: boolean;
}

const DEFAULT_FORM_STATE: AcademicYearDto = {
  id: 0,
  code: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  status: "PLANNING",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

const CreateNamHocModal = ({
  isOpen,
  onClose,
  onSuccess,
  data,
  isLoading = false,
}: CreateNamHocModalProps) => {
  const [formData, setFormData] =
    useState<Omit<AcademicYearDto, "id">>(DEFAULT_FORM_STATE);

  const isEditMode = Boolean(data?.id);

  // Sync dữ liệu từ prop `data` khi mở Modal chỉnh sửa
  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData({
          code: data.code ?? "",
          status: data.status ?? "PLANNING",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          isCurrent: data.isCurrent ?? false,
        });
      } else {
        setFormData(DEFAULT_FORM_STATE);
      }
    }
  }, [isOpen, data]);

  // Mutation POST (Tạo mới)
  const createMutation = $api.useMutation("post", "/academic-years", {
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  // Mutation PATCH (Cập nhật)
  const updateMutation = $api.useMutation("patch", "/academic-years/{id}", {
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      status: formData.status,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isCurrent: formData.isCurrent,
    };

    if (isEditMode && data?.id) {
      updateMutation.mutate({
        params: {
          path: { id: data.id },
        },
        body: payload, // Payload hỗ trợ Partial tương tự Create
      });
    } else {
      createMutation.mutate({
        body: payload,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditMode ? "Cập nhật Năm Học" : "Tạo mới Năm Học"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? "Chỉnh sửa thông tin chi tiết của năm học"
                : "Nhập thông tin để khởi tạo năm học mới"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form
          id="academic-year-form"
          onSubmit={handleSubmit}
          className="p-6 space-y-4 relative"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 animate-pulse">
                Đang tải dữ liệu...
              </span>
            </div>
          )}

          <fieldset disabled={isLoading || isSubmitting} className="space-y-4">
            {/* Mã / Tên Năm học */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mã / Tên Năm Học <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 2024-2025"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Trạng thái <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      status: e.target.value as AcademicYearDto["status"],
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                >
                  <option value="PLANNING">Lập kế hoạch (PLANNING)</option>
                  <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
                  <option value="CLOSED">Đã đóng (CLOSED)</option>
                </select>
              </div>
            </div>

            {/* Ngày bắt đầu & Kết thúc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ngày bắt đầu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ngày kết thúc <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Đặt làm năm học hiện tại */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isCurrent: e.target.checked }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Đặt làm năm học hiện tại (Current Academic Year)
                </span>
              </label>
            </div>
          </fieldset>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="academic-year-form"
            disabled={isLoading || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditMode
                ? "Lưu thay đổi"
                : "Tạo năm học"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNamHocModal;
