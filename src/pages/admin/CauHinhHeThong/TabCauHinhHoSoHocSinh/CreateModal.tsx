import { useForm, useFieldArray } from "react-hook-form";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { DateInputv2 } from "../../../../components/ui/Form/DateInputv2";
import { useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2, Info, FilePlus2, CheckSquare } from "lucide-react";

export type CreateDocumentConfigDto =
  components["schemas"]["CreateDocumentConfigDto"];

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateModal = ({ isOpen, onClose, onSuccess }: CreateModalProps) => {
  const { mutate: mutateCreateDocumentConfig, isPending } = $api.useMutation(
    "post",
    "/document-configs",
  );
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDocumentConfigDto>({
    defaultValues: {
      name: "",
      startDate: "",
      items: [{ name: "", required: true, sortOrder: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateDocumentConfigDto) => {
    const [day, month, year] = data.startDate.split("/");
    const formattedDateString = `${year}-${month}-${day}`;

    const payload: CreateDocumentConfigDto = {
      name: data.name,
      startDate: new Date(formattedDateString).toISOString(),
      items: data.items.map((item, index) => ({
        name: item.name,
        required: item.required,
        sortOrder: item.sortOrder ? Number(item.sortOrder) : index + 1,
      })),
    };

    mutateCreateDocumentConfig(
      { body: payload },
      {
        onSuccess: () => {
          reset();
          onClose();
          if (onSuccess) onSuccess();
          queryClient.invalidateQueries({
            queryKey: ["get", "/document-configs"],
          });
        },
        onError: (error) => {
          console.error("Lỗi khi tạo cấu hình:", error);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FilePlus2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Thêm cấu hình hồ sơ tuyển sinh
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập danh mục tài liệu đầu vào
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden "
        >
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* THÔNG TIN CHUNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tên cấu hình */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  Tên cấu hình <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hồ sơ tuyển sinh Khối 10 năm 2026"
                  {...register("name", {
                    required: "Vui lòng nhập tên cấu hình",
                  })}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white text-slate-800 border rounded-xl outline-none transition-all placeholder-slate-400 ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      : "border-slate-250 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />
                {errors.name && (
                  <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Ngày áp dụng - Nhúng style tinh chỉnh */}
              <div className="[&_label]:text-sm [&_label]:font-semibold [&_label]:text-slate-700 [&_input]:rounded-xl [&_input]:py-2.5 [&_input]:text-sm [&_input]:border-slate-250 [&_input]:focus:border-indigo-500 [&_input]:focus:ring-4 [&_input]:focus:ring-indigo-500/10">
                <DateInputv2
                  label="Ngày bắt đầu áp dụng"
                  required={true}
                  error={errors.startDate?.message}
                  {...register("startDate", {
                    required: "Vui lòng nhập ngày áp dụng",
                    validate: (val) => {
                      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                      if (!regex.test(val))
                        return "Định dạng phải là DD/MM/YYYY";
                      return true;
                    },
                  })}
                />
              </div>
            </div>

            {/* DANH MỤC TÀI LIỆU CHI TIẾT */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-5">
                <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  Danh mục hồ sơ tài liệu chi tiết
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: "",
                      required: true,
                      sortOrder: fields.length + 1,
                    })
                  }
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-2 rounded-xl transition-colors w-fit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm dòng tài liệu
                </button>
              </div>

              {/* BẢNG NHẬP LIỆU ĐỘNG */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 sticky top-0 text-slate-600 font-semibold text-xs uppercase tracking-wider z-10">
                        <th className="py-3 px-3 w-12 text-center bg-slate-50/70">
                          STT
                        </th>
                        <th className="py-3 px-3 bg-slate-50/70">
                          Tên loại hồ sơ tài liệu{" "}
                          <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-3 px-3 w-28 text-center bg-slate-50/70">
                          Bắt buộc
                        </th>
                        <th className="py-3 px-3 w-24 text-center bg-slate-50/70">
                          Thứ tự
                        </th>
                        <th className="py-3 px-3 w-12 text-center bg-slate-50/70"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {fields.map((field, index) => (
                        <tr
                          key={field.id}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          {/* STT */}
                          <td className="p-3 text-center text-slate-400 font-medium text-xs">
                            {index + 1}
                          </td>

                          {/* Tên tài liệu */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Ví dụ: Học bạ THCS (Bản sao công chứng)"
                              {...register(`items.${index}.name` as const, {
                                required: "Không được bỏ trống tên tài liệu",
                              })}
                              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white outline-none transition-all placeholder-slate-400 ${
                                errors.items?.[index]?.name
                                  ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                              }`}
                            />
                          </td>

                          {/* Checkbox bắt buộc */}
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                id={`items.${index}.required`}
                                {...register(
                                  `items.${index}.required` as const,
                                )}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-offset-0 accent-indigo-600 cursor-pointer"
                              />
                            </div>
                          </td>

                          {/* Số thứ tự hiển thị */}
                          <td className="p-2">
                            <input
                              type="number"
                              {...register(`items.${index}.sortOrder` as const)}
                              className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg text-center bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                          </td>

                          {/* Nút xóa dòng */}
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded-lg transition-all"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTION BUTTONS */}
          <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-[0.98]"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow-indigo-100 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
