import { useForm } from "react-hook-form";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import {
  FolderKanban,
  GraduationCap,
  Calendar,
  Users,
  ShieldAlert,
  UserCheck,
  X,
} from "lucide-react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { useLopHocContext, type CreateLopHocDto } from "../LopHocProvider";

interface CreateLopHocProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLopHoc = ({ isOpen, onClose }: CreateLopHocProps) => {
  const {
    createLopHoc,
    isCreatingLopHoc,
    refetchLopHocList,
    nganhHocs,
    khoaHocs,
  } = useLopHocContext();

  // Chuẩn hóa danh sách Options cho các Select Component
  const nganhHocsOptions = [
    { value: "", label: "-- Chọn chuyên ngành --" },
    ...(nganhHocs?.map((major) => ({
      value: major.id,
      label: `${major.majorName} (${major.majorCode})`,
    })) || []),
  ];

  const khoaHocsOptions = [
    { value: "", label: "-- Chọn khóa học --" },
    ...(khoaHocs?.map((batch) => ({
      value: batch.id!,
      label: `${batch.batchName} (${batch.batchCode})`,
    })) || []),
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Đang hoạt động (Active)" },
    { value: "PENDING", label: "Chờ mở lớp (Pending)" },
    { value: "CLOSED", label: "Đã đóng (Closed)" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLopHocDto>({
    defaultValues: {
      status: "ACTIVE",
      maxStudents: 40,
    },
  });

  const onSubmit = async (data: CreateLopHocDto) => {
    try {
      const payload = {
        ...data,
        majorId: Number(data.majorId),
        maxStudents: Number(data.maxStudents),
        batchId: Number(data.batchId),
        formTeacherId: data.formTeacherId
          ? Number(data.formTeacherId)
          : undefined,
      };

      await createLopHoc(
        { body: payload },
        {
          onSuccess: () => {
            alert("Tạo lớp học thành công!");
            reset();
            onClose();
            if (refetchLopHocList) refetchLopHocList();
          },
          onError: (error) => {
            console.error("Lỗi khi tạo lớp học:", error);
            alert("Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.");
          },
        },
      );
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
        p-4 bg-black/50 backdrop-blur-sm"
        >
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-xl 
          overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-semibold text-gray-800">
                Tạo Lớp Học Mới
              </h3>

              <ButtonAction
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                icon={<X size={18} />}
                className="border-none bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close modal"
              />
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Hàng 1: Mã lớp & Tên lớp */}
                <Input
                  label="Mã lớp"
                  placeholder="Ví dụ: KTPM-K15"
                  require
                  icon={FolderKanban}
                  error={errors.classCode?.message}
                  {...register("classCode", {
                    required: "Mã lớp không được để trống",
                  })}
                />

                <Input
                  label="Tên lớp học"
                  placeholder="Ví dụ: Kỹ thuật phần mềm 1"
                  require
                  icon={GraduationCap}
                  error={errors.className?.message}
                  {...register("className", {
                    required: "Tên lớp không được để trống",
                  })}
                />

                {/* Hàng 2: Chuyên ngành & Khóa học */}
                <SelectOption
                  label="Chuyên ngành"
                  require
                  icon={<GraduationCap size={16} />}
                  options={nganhHocsOptions}
                  error={errors.majorId?.message}
                  {...register("majorId", {
                    required: "Vui lòng chọn chuyên ngành",
                  })}
                />

                <SelectOption
                  label="Niên khóa / Khóa học"
                  require
                  icon={<Calendar size={16} />}
                  options={khoaHocsOptions}
                  error={errors.batchId?.message}
                  {...register("batchId", {
                    required: "Vui lòng chọn niên khóa / khóa học",
                  })}
                />

                {/* Hàng 3: Giáo viên & Sĩ số */}
                <Input
                  label="Giáo viên chủ nhiệm (ID)"
                  type="number"
                  placeholder="Không bắt buộc"
                  icon={UserCheck}
                  error={errors.formTeacherId?.message}
                  {...register("formTeacherId")}
                />

                <Input
                  label="Sĩ số tối đa"
                  type="number"
                  require
                  icon={Users}
                  error={errors.maxStudents?.message}
                  {...register("maxStudents", {
                    required: "Vui lòng nhập sĩ số",
                    min: { value: 1, message: "Sĩ số phải lớn hơn 0" },
                  })}
                />

                {/* Hàng 4: Trạng thái (Chiếm full 2 cột nhìn cho đẹp cân đối) */}
                <div className="col-span-2">
                  <SelectOption
                    label="Trạng thái"
                    require
                    icon={<ShieldAlert size={16} />}
                    options={statusOptions}
                    error={errors.status?.message}
                    {...register("status", {
                      required: "Vui lòng chọn trạng thái",
                    })}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <ButtonAction
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isCreatingLopHoc}
                  label="Hủy"
                />

                <ButtonAction
                  type="submit"
                  variant="primary"
                  loading={isCreatingLopHoc}
                  label="Lưu dữ liệu"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLopHoc;
