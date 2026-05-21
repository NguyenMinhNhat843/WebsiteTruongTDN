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
import Input from "../../components/ui/Form/Input";
import { SelectOption } from "../../components/ui/Form/SelectOption";
import ButtonAction from "../../components/ui/ButtonAction";

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

  // Chuyển đổi dữ liệu khoa sang dạng options dùng cho SelectOption
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <PlusCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Thêm Ngành Học Mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mã ngành */}
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

            {/* Tên ngành */}
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

            {/* Chọn Khoa/Phòng ban */}
            <SelectOption
              label={
                isLoadingDepartment
                  ? "Đang tải danh sách khoa..."
                  : "Chọn Khoa / Phòng ban"
              }
              icon={<Building2 size={14} />}
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

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
              <FileText size={14} className="text-gray-400" /> Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Nhập mô tả về ngành học..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all duration-200 shadow-sm placeholder:text-gray-400"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <ButtonAction
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              className="flex-1"
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
