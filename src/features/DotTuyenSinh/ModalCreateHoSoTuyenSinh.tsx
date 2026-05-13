import React from "react";
import { useForm } from "react-hook-form";
import {
  useHoSoTuyenSinhContext,
  type CreateHoSoTuyenSinhDto,
} from "./HoSoTuyenSInhProvider";
import { useDotTuyenSinhContext } from "./DotTuyenSinhProvider";

interface CreateHoSoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateHoSoModal: React.FC<CreateHoSoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createHoSo, isActionLoading } = useHoSoTuyenSinhContext();
  const { dotTuyenSinhItems } = useDotTuyenSinhContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateHoSoTuyenSinhDto>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      admissionItemId: 0,
      rawdata: {},
    },
  });

  const onSubmit = async (data: CreateHoSoTuyenSinhDto) => {
    try {
      await createHoSo(data);
      alert("Tạo hồ sơ thành công!");
      reset();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo hồ sơ:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Thêm Mới Hồ Sơ Tuyển Sinh
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Họ tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition-all focus:ring-2 
                  ${errors.fullName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"}`}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && (
                <span className="text-xs text-red-500">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition-all focus:ring-2 
                  ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"}`}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại",
                })}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition-all focus:ring-2 
                  ${errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"}`}
                placeholder="0912345678"
              />
              {errors.phone && (
                <span className="text-xs text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* ID mục tuyển sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Ngành tuyển sinh
              </label>
              <select
                {...register("admissionItemId", {
                  valueAsNumber: true,
                  required: "Vui lòng chọn ngành tuyển sinh",
                })}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition-all focus:ring-2 
                    border-gray-300 focus:ring-blue-200 focus:border-blue-500`}
              >
                <option value="">-- Chọn ngành học --</option>
                {dotTuyenSinhItems
                  ?.filter(
                    (item): item is NonNullable<typeof item> =>
                      item !== undefined,
                  )
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.major.majorName}{" "}
                      {item.batchName ? `(${item.batchName})` : ""}
                    </option>
                  ))}
              </select>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isActionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 flex items-center"
              >
                {isActionLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo hồ sơ"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHoSoModal;
