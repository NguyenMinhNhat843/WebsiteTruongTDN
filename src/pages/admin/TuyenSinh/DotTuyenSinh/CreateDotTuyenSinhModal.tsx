import { useEffect, useState } from "react";
import { $api } from "../../../../api/client";
import type { paths } from "../../../../api/v1";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Hash,
  FileText,
} from "lucide-react";
import type { AdmissionCampaignDto } from "../../../../api/entity";

// Lấy type Body từ OpenAPI paths cho Create
type CreateAdmissionCampaignBody =
  paths["/admission-campaigns"]["post"]["requestBody"]["content"]["application/json"];

type CampaignItemInput = CreateAdmissionCampaignBody["items"][number];

interface CreateDotTuyenSinhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  data?: AdmissionCampaignDto;
  isLoading?: boolean;
}

const DEFAULT_FORM_STATE: CreateAdmissionCampaignBody = {
  name: "",
  code: "",
  academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  batchId: null,
  startDate: "",
  endDate: "",
  description: "",
  status: "PLANNING",
  targetQuota: null,
  items: [],
};

const CreateDotTuyenSinhModal = ({
  isOpen,
  onClose,
  onSuccess,
  data,
  isLoading = false,
}: CreateDotTuyenSinhModalProps) => {
  const [formData, setFormData] =
    useState<CreateAdmissionCampaignBody>(DEFAULT_FORM_STATE);

  const isEditMode = Boolean(data?.id);

  // Sync dữ liệu từ prop `data` vào form khi ở chế độ Edit
  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData({
          name: data.name ?? "",
          code: data.code ?? "",
          academicYear: data.academicYear ?? "",
          batchId: data.batchId ?? null,
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          description: data.description ?? "",
          status: data.status ?? "PLANNING",
          targetQuota: data.targetQuota ?? null,
          items: (data as any).items || [],
        });
      } else {
        setFormData(DEFAULT_FORM_STATE);
      }
    }
  }, [isOpen, data]);

  // Mutation POST (Tạo mới)
  const createMutation = $api.useMutation("post", "/admission-campaigns", {
    onSuccess: () => {
      handleReset();
      onSuccess?.();
      onClose();
    },
  });

  // Mutation PATCH (Cập nhật)
  const updateMutation = $api.useMutation(
    "patch",
    "/admission-campaigns/{id}",
    {
      onSuccess: () => {
        handleReset();
        onSuccess?.();
        onClose();
      },
    },
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleReset = () => {
    setFormData(DEFAULT_FORM_STATE);
  };

  if (!isOpen) return null;

  // Thêm mới 1 item ngành
  const handleAddItem = () => {
    const newItem: CampaignItemInput = {
      majorId: 0,
      quota: 0,
      benchmarkScore: null,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Cập nhật giá trị 1 item ngành
  const handleUpdateItem = (
    index: number,
    field: keyof CampaignItemInput,
    value: any,
  ) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  // Xóa 1 item ngành
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      batchId: formData.batchId ? Number(formData.batchId) : null,
      targetQuota: formData.targetQuota ? Number(formData.targetQuota) : null,
      description: formData.description || null,
      items: formData.items.map((item) => ({
        majorId: Number(item.majorId),
        quota: Number(item.quota),
        benchmarkScore: item.benchmarkScore
          ? Number(item.benchmarkScore)
          : null,
      })),
    };

    if (isEditMode && data?.id) {
      updateMutation.mutate({
        params: {
          path: { id: data.id },
        },
        body: payload,
      });
    } else {
      createMutation.mutate({
        body: payload,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditMode
                ? "Cập nhật Đợt Tuyển Sinh"
                : "Tạo mới Đợt Tuyển Sinh"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? "Chỉnh sửa thông tin chung và cấu hình các ngành tuyển sinh"
                : "Nhập thông tin chung và cấu hình các ngành tuyển sinh"}
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
          id="campaign-form"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-6 relative"
        >
          {/* Layer Loading khi fetching dữ liệu chi tiết */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 animate-pulse">
                Đang tải dữ liệu...
              </span>
            </div>
          )}

          <fieldset disabled={isLoading || isSubmitting} className="space-y-6">
            {/* Thông tin chung */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Thông tin chung
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên đợt tuyển sinh */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tên đợt tuyển sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đợt tuyển sinh ĐH Chính quy 2024 - Đợt 1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  />
                </div>

                {/* Mã đợt */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mã đợt tuyển sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: TS2024-D1"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, code: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  />
                </div>

                {/* Năm học */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Năm học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2024-2025"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        academicYear: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  />
                </div>

                {/* Ngày bắt đầu */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày bắt đầu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={
                        formData.startDate
                          ? new Date(formData.startDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Ngày kết thúc */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày kết thúc <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={
                        formData.endDate
                          ? new Date(formData.endDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, endDate: e.target.value }))
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
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                  >
                    <option value="PLANNING">Lập kế hoạch (PLANNING)</option>
                    <option value="OPEN">Đang mở (OPEN)</option>
                    <option value="CLOSED">Đã đóng (CLOSED)</option>
                    <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
                  </select>
                </div>

                {/* Chỉ tiêu tổng */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tổng chỉ tiêu
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min={0}
                      placeholder="Chỉ tiêu tổng (nếu có)"
                      value={formData.targetQuota ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          targetQuota: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ghi chú / Mô tả
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Nhập ghi chú thêm..."
                    value={formData.description ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Cấu hình Ngành Tuyển Sinh (items) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Cấu hình ngành tuyển sinh (`items`)
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={isLoading || isSubmitting}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ngành</span>
                </button>
              </div>

              {formData.items.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  Chưa có ngành nào được thêm vào đợt tuyển sinh này.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {/* ID Ngành */}
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">
                          Major ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          placeholder="Mã ngành ID"
                          value={item.majorId || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "majorId",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                        />
                      </div>

                      {/* Chỉ tiêu */}
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">
                          Chỉ tiêu ngành{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          placeholder="Số lượng"
                          value={item.quota || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "quota",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                        />
                      </div>

                      {/* Điểm chuẩn */}
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">
                          Điểm chuẩn
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="Điểm sàn / chuẩn"
                          value={item.benchmarkScore ?? ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "benchmarkScore",
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                        />
                      </div>

                      {/* Nút Xóa */}
                      <div className="pt-5">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={isLoading || isSubmitting}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Xóa ngành"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            form="campaign-form"
            disabled={isLoading || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditMode
                ? "Lưu thay đổi"
                : "Tạo đợt tuyển sinh"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDotTuyenSinhModal;
