import { useForm } from "react-hook-form";
import {
  useQuanLyNguoiDungContext,
  type CreateStaffDto,
} from "../QuanLyNguoiDungContext";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { X, User, Briefcase } from "lucide-react";
import { useAppContext } from "../../../../AppProvider";
import { toast } from "sonner";

interface CreateNhanVienProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNhanVien = ({ isOpen, onClose }: CreateNhanVienProps) => {
  const { createStaff, isCreatingStaff } = useQuanLyNguoiDungContext();
  const { departments } = useAppContext();

  const departmentOptions = departments?.map((d) => ({
    value: String(d.id),
    label: d.deptName,
  })) || [];

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
      // 1. Loại bỏ các field rỗng, null hoặc undefined từ raw data
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value === "" || value === null || value === undefined) {
          return acc;
        }
        return { ...acc, [key]: value };
      }, {} as any);

      // 2. Định dạng & chuẩn hóa kiểu dữ liệu cho các field có giá trị hợp lệ
      const payload: any = { ...cleanedData };

      if (payload.departmentId !== undefined) {
        payload.departmentId = Number(payload.departmentId);
      }

      if (payload.gender !== undefined) {
        payload.gender = String(payload.gender) === "true";
      }

      if (payload.dob) {
        payload.dob = new Date(payload.dob).toISOString();
      }

      // 3. Tiến hành gửi API
      await createStaff(
        {
          body: payload,
        },
        {
          onSuccess: () => {
            toast.success("Tạo tài khoản nhân sự thành công!");
            reset();
            onClose();
          },
          onError: (error: unknown) => {
            toast.error(
              "Lỗi khi tạo nhân viên: " + ((error as Error).message || JSON.stringify(error))
            );
          },
        },
      );
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu:", error);
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: "STAFF", label: "Nhân viên phòng ban" },
    { value: "TEACHER", label: "Giảng viên / Giáo viên" },
  ];

  const genderOptions = [
    { value: "true", label: "Nam" },
    { value: "false", label: "Nữ" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all max-h-[90vh] flex flex-col border border-slate-100">

        {/* Header với tông xanh giáo dục */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200">
              <User size={18} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Thêm Mới Nhân Sự
              </h3>
              <p className="text-xs text-slate-500">
                Tạo hồ sơ giáo viên hoặc cán bộ nhân viên mới
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 shadow-sm border border-transparent hover:border-slate-100 transition-all"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 overflow-y-auto px-6 py-5 flex-1 scrollbar-thin"
        >
          {/* Section 1: Thông tin cá nhân */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Thông tin cá nhân
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Họ và tên */}
              <Input
                label="Họ và tên"
                require
                placeholder="Ví dụ: Nguyễn Văn A"
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
                })}
              />

              {/* Giới tính */}
              <SelectOption
                label="Giới tính"
                options={genderOptions}
                {...register("gender")}
              />

              {/* Số CCCD / CMND */}
              <Input
                label="Số CCCD / Định danh"
                placeholder="Nhập 12 số CCCD..."
                error={errors.identityNumber?.message}
                {...register("identityNumber", {
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "CCCD chỉ được chứa chữ số",
                  }
                })}
              />
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Section 2: Thông tin công tác & Liên hệ */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Công tác & Liên hệ
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Phân quyền */}
              <SelectOption
                label="Vai trò nhân sự"
                require
                options={roleOptions}
                error={errors.EmployeeRole?.message}
                {...register("EmployeeRole")}
              />

              {/* Khoa/Phòng ban */}
              <SelectOption
                options={departmentOptions}
                label="Khoa / Phòng ban"
                error={errors.departmentId?.message}
                {...register("departmentId")}
              />

              {/* Email */}
              <Input
                label="Địa chỉ Email"
                type="email"
                placeholder="example@school.edu.vn"
                error={errors.email?.message}
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không đúng định dạng",
                  },
                })}
              />

              {/* Số điện thoại */}
              <Input
                label="Số điện thoại"
                placeholder="Nhập số điện thoại..."
                error={errors.phone?.message}
                {...register("phone", {
                  pattern: {
                    value: /^(0|84)[3|5|7|8|9][0-9]{8}$/,
                    message: "Số điện thoại không hợp lệ",
                  }
                })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 bg-white">
            <ButtonAction
              type="button"
              variant="outline"
              onClick={onClose}
              loading={isCreatingStaff}
              disabled={isCreatingStaff}
              className="px-5 border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Hủy bỏ
            </ButtonAction>

            <ButtonAction
              type="submit"
              variant="primary"
              loading={isCreatingStaff}
              className="px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-100 transition-all duration-150"
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