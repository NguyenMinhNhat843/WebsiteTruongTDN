import { useForm } from "react-hook-form";
import {
  X,
  Hash,
  Book,
  Calendar,
  Layers,
  FileText,
  Activity,
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
    formState: { errors },
  } = useForm<createKhoaDaoTaoDTO>({
    defaultValues: {
      status: "ACTIVE",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
    },
  });

  // Chuyển đổi danh sách ngành học sang định dạng Option
  const majorOptions =
    majors?.map((major) => ({
      value: major.id,
      label: major.majorName,
    })) || [];

  // Chuyển đổi danh sách chương trình khung sang định dạng Option
  const curriculumOptions = [
    { value: "", label: "-- Tùy chọn (Chọn chương trình khung) --" },
    ...(curriculums?.map((curriculum) => ({
      value: curriculum.id,
      label: curriculum.curriculumName,
    })) || []),
  ];

  // Khai báo danh sách trạng thái
  const statusOptions = [
    { value: "ACTIVE", label: "Đang hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
    { value: "UPCOMING", label: "Sắp mở" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="text-blue-600" size={24} /> Thêm Khóa Đào Tạo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mã khóa */}
            <Input
              label="Mã khóa"
              icon={Hash}
              placeholder="VD: K24-CNTT"
              error={errors.batchCode?.message}
              {...register("batchCode", { required: "Không được để trống" })}
            />

            {/* Tên khóa */}
            <Input
              label="Tên khóa"
              icon={Book} // Thay thế icon Info để giao diện đồng bộ, chuyên nghiệp hơn
              placeholder="VD: Khóa 2024 Công nghệ thông tin"
              error={errors.batchName?.message}
              {...register("batchName", { required: "Không được để trống" })}
            />

            {/* Năm bắt đầu */}
            <Input
              type="number"
              label="Năm bắt đầu"
              icon={Calendar}
              error={errors.startYear?.message}
              {...register("startYear", {
                required: "Bắt buộc",
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
                required: "Bắt buộc",
                valueAsNumber: true,
              })}
            />

            {/* Ngành học */}
            <SelectOption
              label="Ngành học"
              icon={<Layers size={14} className="text-blue-500" />}
              options={[
                { value: "", label: "-- Chọn ngành học --" },
                ...majorOptions,
              ]}
              error={errors.majorId?.message}
              {...register("majorId", {
                required: "Vui lòng chọn ngành học",
                valueAsNumber: true,
              })}
            />

            {/* Chương trình khung */}
            <SelectOption
              label="Chương trình khung"
              icon={<FileText size={14} />}
              options={curriculumOptions}
              error={errors.curriculumId?.message}
              {...register("curriculumId", {
                valueAsNumber: true,
              })}
            />

            {/* Trạng thái */}
            <SelectOption
              containerClassName="md:col-span-2"
              label="Trạng thái"
              icon={<Activity size={14} />}
              options={statusOptions}
              error={errors.status?.message}
              {...register("status")}
            />

            {/* Mô tả */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Mô tả
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Nhập mô tả cho khóa học học..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all duration-200 shadow-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <ButtonAction
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy bỏ
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              className="flex-1"
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
