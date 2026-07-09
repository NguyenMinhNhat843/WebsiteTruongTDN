import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { toast } from "sonner";

export type CreateConfigTuitionProps =
  components["schemas"]["CreateTuitionConfigDto"];

interface ModalConfigTuitionProps {
  isOpen: boolean;
  onClose: () => void;
  periodId: number; // Đợt học phí hiện tại lấy từ URL cha
  tuitionConfigId?: number; // Có id -> UPDATE, không có id -> CREATE
  onSuccess?: () => void;
}

const ModalConfigTuition = ({
  isOpen,
  onClose,
  periodId,
  tuitionConfigId,
  onSuccess,
}: ModalConfigTuitionProps) => {
  const isUpdateMode = !!tuitionConfigId;

  // ==========================================
  // 1. API QUERIES & MUTATIONS
  // ==========================================

  // API: Lấy danh sách ngành CHƯA được cấu hình cho đợt học phí này (Chỉ gọi ở chế độ CREATE)
  const { data: unconfiguredMajors, isLoading: isLoadingMajors } =
    $api.useQuery(
      "get",
      "/tuition-configs/unconfigured-majors",
      {
        params: { query: { periodId } },
      },
      {
        enabled: isOpen && !isUpdateMode, // Chỉ chạy khi mở modal ở chế độ tạo mới
      },
    );

  // API: Lấy chi tiết cấu hình học phí để sửa (Chỉ gọi ở chế độ UPDATE)
  const { data: tuitionConfigOne, isLoading: isLoadingDetail } = $api.useQuery(
    "get",
    "/tuition-configs/{id}",
    {
      params: { path: { id: tuitionConfigId ?? 0 } },
    },
    {
      enabled: isOpen && isUpdateMode && !!tuitionConfigId,
    },
  );

  const { mutate: createConfig, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/tuition-configs",
  );
  const { mutate: updateConfig, isPending: isPendingUpdate } = $api.useMutation(
    "patch",
    "/tuition-configs/{id}",
  );

  // ==========================================
  // 2. REACT HOOK FORM SETUP
  // ==========================================
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateConfigTuitionProps>({
    defaultValues: {
      periodId: periodId,
      majorId: undefined, // Sẽ được chọn qua select dropdown
      batchId: null,
      totalAmount: 0,
      minRequiredAmount: 0,
      items: [{ name: "Học phí lý thuyết/thực hành", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Tự động tính toán tổng số tiền khi các khoản thu thay đổi
  const watchItems = watch("items");
  useEffect(() => {
    if (watchItems) {
      const total = watchItems.reduce(
        (sum, item) => sum + (Number(item?.amount) || 0),
        0,
      );
      setValue("totalAmount", total);
    }
  }, [watchItems, setValue]);

  // Đồng bộ dữ liệu vào Form tùy theo trạng thái CREATE hay UPDATE
  useEffect(() => {
    if (isOpen) {
      if (isUpdateMode && tuitionConfigOne) {
        reset({
          periodId: tuitionConfigOne.periodId,
          majorId: tuitionConfigOne.majorId,
          batchId: tuitionConfigOne.batchId,
          totalAmount: tuitionConfigOne.totalAmount,
          minRequiredAmount: tuitionConfigOne.minRequiredAmount,
          items: tuitionConfigOne.items.map((i) => ({
            name: i.name,
            amount: i.amount,
          })),
        });
      } else if (!isUpdateMode) {
        reset({
          periodId: periodId,
          majorId: undefined,
          batchId: null,
          totalAmount: 0,
          minRequiredAmount: 0,
          items: [{ name: "Học phí chuyên ngành", amount: 0 }],
        });
      }
    }
  }, [tuitionConfigOne, isUpdateMode, isOpen, reset, periodId]);

  // ==========================================
  // 3. HANDLER SUBMIT
  // ==========================================
  const onSubmit = (formData: CreateConfigTuitionProps) => {
    const payload = {
      ...formData,
      periodId,
      majorId: Number(formData.majorId), // Đảm bảo ép kiểu số
      totalAmount: Number(formData.totalAmount),
      minRequiredAmount: Number(formData.minRequiredAmount),
      items: formData.items.map((item) => ({
        name: item.name,
        amount: Number(item.amount),
      })),
    };

    if (isUpdateMode && tuitionConfigId) {
      updateConfig(
        {
          params: { path: { id: tuitionConfigId } },
          // @ts-ignore
          body: payload,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật cấu hình học phí thành công!");
            onSuccess?.();
            onClose();
          },
          onError: () => toast.error("Cập nhật thất bại, vui lòng thử lại!"),
        },
      );
    } else {
      createConfig(
        {
          body: payload,
        },
        {
          onSuccess: () => {
            toast.success("Tạo cấu hình học phí thành công!");
            onSuccess?.();
            onClose();
          },
          onError: () => toast.error("Tạo cấu hình học phí thất bại!"),
        },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isUpdateMode
                ? "Cập nhật cấu hình học phí"
                : "Thiết lập cấu hình mới"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng cho học phần, ngành học hệ Trung cấp / Cao đẳng nghề
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY LOADING */}
        {(isUpdateMode && isLoadingDetail) ||
        (!isUpdateMode && isLoadingMajors) ? (
          <div className="flex flex-col items-center justify-center py-20 flex-1">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500 mt-2">
              Đang tải dữ liệu hệ thống...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {/* LỰA CHỌN NGÀNH HỌC */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Ngành học áp dụng <span className="text-rose-500">*</span>
              </label>

              {isUpdateMode ? (
                // Chế độ UPDATE: Hiển thị tên ngành tĩnh dưới dạng Input disabled để không cho đổi sang ngành khác
                <div className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium">
                  {tuitionConfigOne?.major?.majorName} (
                  {tuitionConfigOne?.major?.majorCode})
                </div>
              ) : (
                // Chế độ CREATE: Cho phép chọn các ngành chưa cấu hình
                <>
                  <select
                    className={`w-full px-3.5 py-2 bg-white border ${
                      errors.majorId
                        ? "border-rose-400 focus:ring-rose-100"
                        : "border-slate-200 focus:ring-blue-100"
                    } rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                    {...register("majorId", {
                      required: "Vui lòng chọn ngành học áp dụng cấu hình",
                    })}
                  >
                    <option value="">
                      -- Chọn ngành học cần cấu hình học phí --
                    </option>
                    {unconfiguredMajors?.map((major: any) => (
                      <option key={major.id} value={major.id}>
                        [{major.majorCode}] - {major.majorName}
                      </option>
                    ))}
                  </select>
                  {errors.majorId && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.majorId.message}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* THÔNG TIN SỐ TIỀN CƠ BẢN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Tổng số tiền học phí ($)
                </label>
                <input
                  type="number"
                  disabled
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 focus:outline-none"
                  {...register("totalAmount")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Mức đóng tối thiểu để nhập học{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập số tiền tối thiểu"
                  className={`w-full px-3.5 py-2 bg-white border ${
                    errors.minRequiredAmount
                      ? "border-rose-400 focus:ring-rose-100"
                      : "border-slate-200 focus:ring-blue-100"
                  } rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                  {...register("minRequiredAmount", {
                    required: "Vui lòng nhập mức đóng tối thiểu",
                    min: 0,
                  })}
                />
                {errors.minRequiredAmount && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.minRequiredAmount.message}
                  </p>
                )}
              </div>
            </div>

            {/* DANH MỤC CHI TIẾT CÁC KHOẢN THU (ITEMS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Chi tiết danh mục khoản thu cơ cấu
                </span>
                <button
                  type="button"
                  onClick={() => append({ name: "", amount: 0 })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm khoản thu
                </button>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Ví dụ: Tiền học phí chính khóa, Tiền phôi bằng..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        {...register(`items.${index}.name` as const, {
                          required: "Không để trống tên khoản thu",
                        })}
                      />
                    </div>

                    <div className="w-40">
                      <input
                        type="number"
                        placeholder="Số tiền"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        {...register(`items.${index}.amount` as const, {
                          required: true,
                          min: 0,
                        })}
                      />
                    </div>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md mt-0.5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON FOOTER */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isPendingCreate || isPendingUpdate}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-70 transition-colors min-w-[100px]"
              >
                {isPendingCreate || isPendingUpdate ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isUpdateMode ? (
                  "Cập nhật"
                ) : (
                  "Lưu cấu hình"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalConfigTuition;
