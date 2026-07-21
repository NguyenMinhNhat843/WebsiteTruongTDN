import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Plus,
  Trash2,
  X,
  Layers,
  Calendar,
  Info,
  Calculator,
} from "lucide-react";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { useGetAcademicYears } from "../../../../hooks/useAcademicYear";
import type { AdmissionCampaignDetailDto } from "../../../../api/entity";
import { useGetMajors } from "../../../../hooks/useMajor";
import { toast } from "sonner";

export type CreateAdmissionCampaignDto =
  components["schemas"]["CreateAdmissionCampaignDto"];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AdmissionCampaignDetailDto | null;
}

const CreateDotTuyenSinhModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEdit = Boolean(initialData?.id);

  // 1. API Mutations & Queries
  const { mutate: createDotTuyenSinh, isPending: isCreating } =
    $api.useMutation("post", "/admission-campaigns");

  const { mutate: updateDotTuyenSinh, isPending: isUpdating } =
    $api.useMutation("patch", "/admission-campaigns/{id}");

  const { data: academicYears, isLoading: isAcademicYearsLoading } =
    useGetAcademicYears({ status: "ACTIVE" });

  const { data: majors, isLoading: isLoadingMajors } = useGetMajors();

  const isSubmitting = isCreating || isUpdating;

  const initFormData: Partial<CreateAdmissionCampaignDto> = {
    academicYearId: undefined,
    code: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "PLANNING",
    targetQuota: 0,
    description: "",
    items: [],
  };

  // 2. Setup React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAdmissionCampaignDto>({
    defaultValues: {
      ...initFormData,
    },
  });

  // Dynamic Array cho items ngành
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // 3. Tự động tính Tổng Chỉ tiêu dựa trên danh sách ngành bên phải
  const watchedItems = useWatch({ control, name: "items" });

  useEffect(() => {
    const calculatedTotal = (watchedItems || []).reduce((acc, item) => {
      const quotaNum = Number(item?.quota) || 0;
      return acc + quotaNum;
    }, 0);

    setValue("targetQuota", calculatedTotal);
  }, [watchedItems, setValue]);

  // 4. Đồng bộ dữ liệu khi ở chế độ Edit/Create
  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        academicYearId: initialData.academicYearId,
        code: initialData.code,
        name: initialData.name,
        startDate: initialData.startDate
          ? initialData.startDate.slice(0, 10)
          : "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
        status: initialData.status,
        targetQuota: initialData.targetQuota || 0,
        description: initialData.description || "",
        items:
          initialData.campaignMajors?.map((item) => ({
            majorId: item.majorId,
            quota: item.quota,
          })) || [],
      });
    } else if (!initialData && isOpen) {
      reset({
        academicYearId: undefined,
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        status: "PLANNING",
        targetQuota: 0,
        description: "",
        items: [],
      });
    }
  }, [initialData, isOpen, reset]);

  // 5. Submit handler
  const onSubmit = (formData: CreateAdmissionCampaignDto) => {
    const payload = {
      ...formData,
      academicYearId: Number(formData.academicYearId),
      targetQuota: Number(formData.targetQuota),
      items: formData.items?.map((item) => ({
        majorId: Number(item.majorId),
        quota: Number(item.quota),
      })),
    };

    if (isEdit && initialData?.id) {
      updateDotTuyenSinh(
        {
          params: { path: { id: initialData.id } },
          body: payload,
        },
        {
          onSuccess: () => {
            reset(initFormData);
            onSuccess?.();
            onClose();
            toast.success("Cập nhật đợt tuyển sinh thành công");
          },
          onError: () => {
            toast.error("Cập nhật đợt tuyển sinh thất bại");
          },
        },
      );
    } else {
      createDotTuyenSinh(
        { body: payload },
        {
          onSuccess: () => {
            reset(initFormData);
            onSuccess?.();
            onClose();
            toast.success("Cập nhật đợt tuyển sinh thành công");
          },
          onError: () => {
            toast.error("Tạo mới đợt tuyển sinh thất bại");
          },
        },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEdit ? "Cập nhật đợt tuyển sinh" : "Tạo mới đợt tuyển sinh"}
            </h3>
            <p className="text-xs text-slate-500">
              Thiết lập thông tin đợt và phân bổ chỉ tiêu tuyển sinh từng ngành
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form Layout 2 Cột */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
            {/* CỘT TRÁI: Thông tin đợt tuyển sinh (5 cols) */}
            <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-4 lg:border-r lg:border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Info className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-slate-800">
                  Thông tin đợt tuyển sinh
                </h4>
              </div>

              {/* Năm học */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Năm học <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("academicYearId", {
                    required: "Vui lòng chọn năm học",
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  disabled={isAcademicYearsLoading}
                >
                  <option value="">-- Chọn năm học --</option>
                  {academicYears?.data?.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.code} {year.isCurrent ? "(Hiện tại)" : ""}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.academicYearId.message}
                  </p>
                )}
              </div>

              {/* Mã & Tên đợt tuyển sinh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mã đợt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: DTS2026"
                    {...register("code", { required: "Nhập mã" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {errors.code && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tên đợt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Tuyển sinh Đợt 1 2026"
                    {...register("name", { required: "Nhập tên" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Thời gian Bắt đầu - Kết thúc */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("startDate", {
                      required: "Chọn ngày bắt đầu",
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("endDate", { required: "Chọn ngày kết thúc" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Trạng thái & Tổng chỉ tiêu Auto */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="PLANNING">Đang kế hoạch</option>
                    <option value="OPEN">Mở đăng ký</option>
                    <option value="CLOSED">Đã đóng</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span>Chỉ tiêu tổng</span>
                    <span className="text-[10px] text-indigo-600 font-normal flex items-center gap-0.5">
                      <Calculator className="w-3 h-3" /> Tự động
                    </span>
                  </label>
                  <input
                    type="number"
                    readOnly
                    {...register("targetQuota")}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ghi chú / Mô tả
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chi tiết đợt tuyển sinh..."
                  {...register("description")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* CỘT PHẢI: Ngành & Chỉ tiêu (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-slate-800">
                    Danh sách Ngành tuyển sinh ({fields.length})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => append({ majorId: 0, quota: 0 })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm ngành
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
                  <Layers className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    Chưa có ngành nào được chọn
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Bấm "Thêm ngành" để thiết lập chỉ tiêu cho từng ngành
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all"
                    >
                      {/* Chọn Ngành từ List */}
                      <div className="flex-[3]">
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                          Tên ngành tuyển sinh
                        </label>

                        <div className="relative">
                          <select
                            {...register(`items.${index}.majorId` as const, {
                              required: "Chọn ngành",
                              valueAsNumber: true,
                            })}
                            disabled={isLoadingMajors}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[38px] max-h-[100px] overflow-y-auto"
                          >
                            <option value={0}>-- Chọn ngành --</option>
                            {majors?.map((m) => (
                              <option
                                key={m.id}
                                value={m.id}
                                className="py-1 px-2 hover:bg-indigo-50"
                              >
                                {m.majorName} ({m.majorCode})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Nhập Chỉ tiêu */}
                      <div className="flex-[2]">
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                          Chỉ tiêu
                        </label>
                        <input
                          type="number"
                          min={1}
                          placeholder="Số lượng"
                          {...register(`items.${index}.quota` as const, {
                            required: true,
                            valueAsNumber: true,
                          })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      {/* Button Xóa */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa ngành này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm shadow-indigo-200"
            >
              {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDotTuyenSinhModal;
