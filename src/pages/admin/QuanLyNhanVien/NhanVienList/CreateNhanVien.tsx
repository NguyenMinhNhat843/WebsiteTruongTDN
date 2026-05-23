import { useForm } from "react-hook-form";
import {
  useQuanLyNguoiDungContext,
  type CreateStaffDto,
} from "../QuanLyNguoiDungContext";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { X } from "lucide-react";
import { useAppContext } from "../../../../AppProvider";

interface CreateNhanVienProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNhanVien = ({ isOpen, onClose }: CreateNhanVienProps) => {
  const { createStaff, isCreatingStaff } = useQuanLyNguoiDungContext();
  const { departments } = useAppContext();
  const departmentOptions = departments?.map((d) => ({
    value: d.id,
    label: d.deptName,
  }));

  // Khởi tạo react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffDto>({
    defaultValues: {
      EmployeeRole: "TEACHER",
      fullName: "",
      dob: "",
      email: "",
      phone: "",
      identityNumber: "",
      gender: true,
      departmentId: null,
    },
  });

  const onSubmit = async (data: CreateStaffDto) => {
    try {
      const payload = {
        ...data,
        gender:
          data.gender === undefined
            ? undefined
            : String(data.gender) === "true",
      };

      await createStaff(
        {
          body: payload,
        },
        {
          onSuccess: () => {
            alert("Tạo nhân viên thành công!");
            reset();
            onClose();
          },
          onError: (error: unknown) => {
            alert(
              "Lỗi khi tạo nhân viên: " + (error as Error).message ||
                JSON.stringify(error),
            );
          },
        },
      );
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: "STAFF", label: "Nhân viên" },
    { value: "TEACHER", label: "Giáo viên" },
  ];

  const genderOptions = [
    { value: "true", label: "Nam" },
    { value: "false", label: "Nữ" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      {/* Lớp nền đóng modal khi click ra ngoài */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Thân Modal */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900">
            Thêm Mới Nhân Viên
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto pr-1 flex-1"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Họ và tên */}
            <Input
              label="Họ và tên"
              require
              placeholder="Nhập họ và tên..."
              error={errors.fullName?.message}
              {...register("fullName", {
                required: "Họ và tên không được để trống",
              })}
            />

            {/* Ngày sinh */}
            <Input
              label="Ngày sinh"
              type="date"
              require
              error={errors.dob?.message}
              {...register("dob", {
                required: "Ngày sinh không được để trống",
                setValueAs: (v) => (v ? new Date(v).toISOString() : null),
              })}
            />

            {/* Phân quyền (Select Option) */}
            <SelectOption
              label="Phân quyền"
              require
              options={roleOptions}
              error={errors.EmployeeRole?.message}
              {...register("EmployeeRole")}
            />

            {/* Giới tính */}
            <SelectOption
              label="Giới tính"
              options={genderOptions}
              {...register("gender")}
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="example@gmail.com"
              error={errors.email?.message}
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Y2-4]{2,}$/i,
                  message: "Email không đúng định dạng",
                },
              })}
            />

            {/* Số điện thoại */}
            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại..."
              error={errors.phone?.message}
              {...register("phone")}
            />

            {/* CCCD / CMND */}
            <Input
              label="Số CCCD / Định danh"
              placeholder="Nhập số CCCD..."
              error={errors.identityNumber?.message}
              {...register("identityNumber")}
            />

            <SelectOption
              options={departmentOptions || []}
              label="Khoa/Phòng ban"
              error={errors.departmentId?.message}
              {...register("departmentId")}
            />
          </div>

          {/* Hàng Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
            <ButtonAction
              type="button"
              variant="outline"
              onClick={onClose}
              loading={isCreatingStaff}
              disabled={isCreatingStaff}
            >
              Hủy bỏ
            </ButtonAction>

            <ButtonAction
              type="submit"
              variant="primary"
              loading={isCreatingStaff}
            >
              Tạo nhân viên
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNhanVien;
