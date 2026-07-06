import { useForm } from "react-hook-form";
import {
  X,
  Calendar,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { CreateHocKyDto, HocKyDto } from "./HocKyProvider";
import { useEffect } from "react";
import { DateInputv2 } from "../../../components/ui/Form/DateInputv2";
import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  createHocKy?: (data: CreateHocKyDto, onSuccess: () => void) => void;
  isCreateHocKyPending?: boolean;
  isCreateHocKyError?: boolean;
  semester?: HocKyDto; // Nếu có prop này => Chế độ Update
}

// Helper: Convert DD/MM/YYYY -> ISO String (Gửi lên Backend)
const parseDateStringToISO = (dateStr: string): string => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
};

// Helper: Convert ISO String/Date -> DD/MM/YYYY (Hiển thị lên Form khi Update)
const formatDateToValue = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const CreateHocKyModal = ({
  isOpen,
  onClose,
  createHocKy,
  isCreateHocKyPending,
  isCreateHocKyError,
  semester,
}: Props) => {
  const isUpdateMode = Boolean(semester);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateHocKyDto>({
    defaultValues: {
      isCurrent: false,
      year: new Date().getFullYear(),
    },
  });

  // API Update mutation
  const {
    mutate: updateSemester,
    isPending: isUpdateSemesterPending,
    isError: isUpdateSemesterError,
  } = $api.useMutation("patch", "/semesters/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/semesters"] });
      reset();
      onClose();
    },
  });

  // Đổ dữ liệu cũ vào form khi mở chế độ Update
  useEffect(() => {
    if (isOpen) {
      if (semester) {
        reset({
          term: semester.term,
          year: semester.year,
          name: semester.name,
          isCurrent: semester.isCurrent,
          startDate: formatDateToValue(semester.startDate),
          endDate: formatDateToValue(semester.endDate),
        });
      } else {
        // Nếu mở modal dạng tạo mới thì clear form về default ban đầu
        reset({
          isCurrent: false,
          year: new Date().getFullYear(),
          term: undefined,
          name: "",
          startDate: "",
          endDate: "",
        });
      }
    }
  }, [semester, isOpen, reset]);

  const watchTerm = watch("term");
  const watchYear = watch("year");

  // Tự động cập nhật tên học kỳ format: HK1 2026 - 2027
  useEffect(() => {
    if (watchTerm && watchYear) {
      const nextYear = Number(watchYear) + 1;
      setValue("name", `HK${watchTerm} ${watchYear} - ${nextYear}`);
    }
  }, [watchTerm, watchYear, setValue]);

  const onSubmit = (data: CreateHocKyDto) => {
    const formattedStartDate = parseDateStringToISO(data.startDate);
    const formattedEndDate = parseDateStringToISO(data.endDate);

    const payload = {
      ...data,
      year: Number(data.year),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    if (isUpdateMode && semester) {
      // Thực hiện gọi API cập nhật thông tin học kỳ
      updateSemester({
        params: { path: { id: semester.id } },
        body: payload,
      });
    } else if (createHocKy) {
      // Thực hiện gọi hàm tạo mới học kỳ từ props
      createHocKy(payload, () => {
        reset();
        onClose();
      });
    }
  };

  // Gom trạng thái loading và error để giao diện gọn gàng hơn
  const isPending = isCreateHocKyPending || isUpdateSemesterPending;
  const isError = isCreateHocKyError || isUpdateSemesterError;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {isUpdateMode ? "Cập nhật học kỳ" : "Mở học kỳ mới"}
            </h3>
            <p className="text-xs text-gray-500">
              {isUpdateMode
                ? "Chỉnh sửa thông tin thời gian và trạng thái"
                : "Thiết lập thời gian và trạng thái học kỳ mới"}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex gap-4 justify-between items-center">
            {/* Số kỳ */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <Calendar size={14} /> Số kỳ
              </label>
              <input
                type="number"
                {...register("term", {
                  required: "Vui lòng nhập số kỳ",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Năm học */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
                <Calendar size={14} /> Năm học
              </label>
              <input
                type="number"
                {...register("year", {
                  required: "Vui lòng nhập năm",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Tên học kỳ */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-2">
              <Tag size={14} /> Tên học kỳ
            </label>
            <input
              {...register("name", { required: "Vui lòng nhập tên học kỳ" })}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100"} rounded-xl focus:ring-4 focus:border-indigo-500 outline-none transition-all`}
              placeholder="VD: Học kỳ 1 - 2026 - 2027"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu & Kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <DateInputv2
              label="Bắt đầu"
              required
              error={errors.startDate?.message}
              {...register("startDate", {
                required: "Bắt buộc nhập ngày bắt đầu",
                pattern: {
                  value: /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                  message: "Sai định dạng DD/MM/YYYY",
                },
              })}
            />

            <DateInputv2
              label="Kết thúc"
              required
              error={errors.endDate?.message}
              {...register("endDate", {
                required: "Bắt buộc nhập ngày kết thúc",
                pattern: {
                  value: /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                  message: "Sai định dạng DD/MM/YYYY",
                },
              })}
            />
          </div>

          {/* Checkbox Học kỳ hiện tại */}
          <label className="flex items-center gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                {...register("isCurrent")}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-indigo-900">
                Đặt làm học kỳ hiện tại
              </span>
              <span className="text-[11px] text-indigo-600">
                Mọi dữ liệu tài chính và môn học sẽ mặc định vào kỳ này
              </span>
            </div>
          </label>

          {/* Thông báo lỗi từ Server */}
          {isError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>
                Có lỗi xảy ra khi {isUpdateMode ? "cập nhật" : "tạo"} học kỳ.
                Vui lòng thử lại.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isPending
                ? "Đang xử lý..."
                : isUpdateMode
                  ? "Cập nhật kỳ"
                  : "Xác nhận mở kỳ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
