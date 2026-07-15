import { useForm } from "react-hook-form";
import {
  X,
  PlusCircle,
  BookOpen,
  Hash,
  Building2,
  FileText,
} from "lucide-react";
import { useNganhContext, type createNganhDto } from "./NganhProvider";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../components/ui/ButtonAction";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createNganhDto, reset: () => void) => void;
  isPending?: boolean;
}

const CreateNganhModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createNganhDto>();

  const { departments, isLoadingDepartment } = useNganhContext();

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const departmentOptions =
    departments?.map((dept) => ({
      value: dept.id,
      label: dept.deptName,
    })) || [];

  if (!isOpen) return null;

  const handleFormSubmit = (data: createNganhDto) => {
    onSubmit(data, reset);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Phối màu xanh ngọc nhã nhặn, tươi tắn */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-100 bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
              <PlusCircle size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-800">
                Thêm Ngành Học Mới
              </h2>
              <p className="text-xs text-emerald-700/80 mt-0.5 font-medium">
                Điền thông tin chi tiết để thiết lập ngành đào tạo mới.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          {/* Nhóm 1: Mã & Tên ngành (Điểm xuyết viền trái màu sắc tạo điểm nhấn phân khu) */}
          <div className="pl-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                label="Mã ngành"
                icon={Hash}
                placeholder="VD: CNTT"
                error={
                  errors.majorCode?.message
                    ? String(errors.majorCode.message)
                    : undefined
                }
                {...register("majorCode", {
                  required: "Vui lòng nhập mã ngành",
                })}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Tên ngành"
                icon={BookOpen}
                placeholder="VD: Công nghệ thông tin"
                error={
                  errors.majorName?.message
                    ? String(errors.majorName.message)
                    : undefined
                }
                {...register("majorName", {
                  required: "Vui lòng nhập tên ngành",
                })}
              />
            </div>
          </div>

          {/* Nhóm 2: Chọn Khoa */}
          <div className="pl-3  w-full">
            <SelectOption
              label={
                isLoadingDepartment
                  ? "Đang tải danh sách khoa..."
                  : "Thuộc Khoa / Phòng ban"
              }
              icon={<Building2 size={14} className="text-amber-500" />}
              options={departmentOptions}
              disabled={isLoadingDepartment}
              error={
                errors.deptId?.message
                  ? String(errors.deptId.message)
                  : undefined
              }
              {...register("deptId", {
                required: "Vui lòng chọn khoa",
                valueAsNumber: true,
              })}
            />
          </div>

          {/* Nhóm 3: Mô tả */}
          <div className="pl-3  space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" /> Mô tả ngành học
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Nhập mô tả tóm tắt về mục tiêu hoặc định hướng của ngành học này..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none transition-all duration-200 shadow-sm placeholder:text-slate-400 hover:border-slate-300"
            />
          </div>

          {/* Footer Buttons - Phẳng hoàn toàn, không đổ bóng màu phát sáng */}
          <div className="flex gap-3 pt-5 border-t border-slate-100 mt-8">
            <ButtonAction
              type="button"
              variant="outline"
              className="flex-1 py-2.5 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors font-medium rounded-xl"
              onClick={onClose}
            >
              Hủy bỏ
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl shadow-sm transition-colors border-none"
              loading={isPending}
            >
              Tạo ngành học
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNganhModal;
