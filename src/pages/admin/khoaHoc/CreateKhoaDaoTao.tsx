import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Hash,
  Book,
  Calendar,
  Layers,
  FileText,
  Activity,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  useKhoaDaoTaoContext,
  type createKhoaDaoTaoDTO,
} from "./KhoaHocProvider";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../components/ui/ButtonAction";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createKhoaDaoTaoDTO) => void;
  isPending: boolean;
}

const CreateBatchModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const { majors, curriculums } = useKhoaDaoTaoContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<createKhoaDaoTaoDTO>({
    defaultValues: {
      status: "ACTIVE",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
    },
  });

  // Theo dõi giá trị startYear để validate endYear thời gian thực
  const startYearValue = watch("startYear");

  // Reset form khi đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      reset({
        status: "ACTIVE",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
      });
    }
  }, [isOpen, reset]);

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Chuyển đổi danh sách sang định dạng Option
  const majorOptions =
    majors?.map((major) => ({
      value: major.id,
      label: major.majorName,
    })) || [];

  const curriculumOptions = [
    { value: "", label: "-- Tùy chọn (Chọn chương trình khung) --" },
    ...(curriculums?.map((curriculum) => ({
      value: curriculum.id,
      label: curriculum.curriculumName,
    })) || []),
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Đang hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
    { value: "UPCOMING", label: "Sắp diễn ra" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Book size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Thêm khóa đào tạo mới
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Thiết lập thông tin niên khóa và chương trình học liên kết
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>01. Thông tin định danh</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/40 p-4.5 rounded-2xl border border-slate-100/50">
              {/* Mã khóa */}
              <Input
                label="Mã khóa học"
                icon={Hash}
                placeholder="Ví dụ: K24-CNTT"
                error={errors.batchCode?.message}
                {...register("batchCode", {
                  required: "Vui lòng nhập mã khóa",
                })}
              />

              {/* Tên khóa */}
              <Input
                label="Tên khóa đào tạo"
                icon={Book}
                placeholder="Ví dụ: Khóa 24 Công nghệ Thông tin"
                error={errors.batchName?.message}
                {...register("batchName", {
                  required: "Vui lòng nhập tên khóa",
                })}
              />
            </div>
          </div>

          {/* Section 2: Thời gian & Ngành học */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              02. Thời gian & Chương trình đào tạo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/10 p-4.5 rounded-2xl border border-indigo-50/30">
              {/* Năm bắt đầu */}
              <Input
                type="number"
                label="Năm bắt đầu"
                icon={Calendar}
                error={errors.startYear?.message}
                {...register("startYear", {
                  required: "Bắt buộc nhập",
                  valueAsNumber: true,
                })}
              />

              {/* Năm kết thúc */}
              <Input
                type="number"
                label="Năm kết thúc"
                icon={Calendar}
                error={errors.endYear?.message}
                {...register("endYear", {
                  required: "Bắt buộc nhập",
                  valueAsNumber: true,
                  validate: (val) =>
                    val > startYearValue ||
                    "Năm kết thúc phải lớn hơn năm bắt đầu",
                })}
              />

              {/* Ngành học */}
              <SelectOption
                label="Ngành học đào tạo"
                icon={<Layers size={14} className="text-indigo-500" />}
                options={[
                  { value: "", label: "-- Chọn ngành học tương ứng --" },
                  ...majorOptions,
                ]}
                error={errors.majorId?.message}
                {...register("majorId", {
                  required: "Vui lòng xác định ngành học",
                  valueAsNumber: true,
                })}
              />

              {/* Chương trình khung */}
              <SelectOption
                label="Chương trình khung (Tùy chọn)"
                icon={<FileText size={14} className="text-slate-400" />}
                options={curriculumOptions}
                error={errors.curriculumId?.message}
                {...register("curriculumId", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          {/* Section 3: Trạng thái & Mô tả bổ sung */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              03. Cấu hình & Trạng thái hoạt động
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/40 p-4.5 rounded-2xl border border-slate-100/50">
              {/* Trạng thái */}
              <div className="md:col-span-2">
                <SelectOption
                  label="Trạng thái phân phối"
                  icon={<Activity size={14} className="text-indigo-500" />}
                  options={statusOptions}
                  error={errors.status?.message}
                  {...register("status")}
                />
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-bold text-slate-700 ml-1">
                  Mô tả chi tiết khóa đào tạo
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Nhập ghi chú, điều kiện tuyển sinh hoặc tóm tắt chương trình đào tạo của khóa học này..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all duration-200 shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <ButtonAction
              type="button"
              variant="outline"
              className="flex-1 rounded-2xl font-bold py-2.5 text-slate-600 border-slate-200 hover:bg-slate-50"
              onClick={onClose}
            >
              Hủy bỏ
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              className="flex-1 rounded-2xl font-bold py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10"
              loading={isPending}
            >
              Lưu khóa đào tạo
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchModal;
