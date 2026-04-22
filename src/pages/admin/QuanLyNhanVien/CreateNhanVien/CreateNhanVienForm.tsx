import { User, Lock, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";
import {
  CreateNhanVienProvider,
  useCreateNhanVienContext,
} from "./CreateNhanVienProvider";
import ButtonAction from "../../../../components/ui/ButtonAction";
import type { RoleType } from "../../../../api/type";

const CreateNhanVien = () => {
  return (
    <CreateNhanVienProvider>
      <Inner />
    </CreateNhanVienProvider>
  );
};

const Inner = () => {
  const { formData, setFormData, handleSubmit, isPending } =
    useCreateNhanVienContext();

  const roleOptions = [
    {
      value: "ADMIN",
      label: "Quản trị viên (ADMIN)",
      icon: <ShieldCheck size={16} />,
    },
    { value: "STAFF", label: "Nhân viên (STAFF)", icon: <User size={16} /> },
    {
      value: "TEACHER",
      label: "Giảng viên (TEACHER)",
      icon: <User size={16} />,
    },
  ];

  return (
    <div className="">
      <div className="space-y-4">
        {/* Username */}
        <Input
          label="Tên đăng nhập"
          placeholder="Nhập username..."
          icon={User}
          require={true}
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            require={true}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />{" "}
          {/* Confirm Password */}
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            require={true}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />{" "}
        </div>
        {/* Role Selection */}
        <SelectOption
          label="Vai trò hệ thống"
          require={true}
          options={roleOptions}
          icon={<ShieldCheck size={18} />}
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as RoleType })
          }
        />{" "}
        <hr className="my-6 border-slate-100" />
        <p className="text-sm font-medium text-slate-500 mb-2">
          Thông tin bổ sung (Tùy chọn)
        </p>
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="example@school.edu.vn"
          icon={Mail}
          value={formData.email || undefined}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <Input
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            icon={Phone}
            value={formData.phone || undefined}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Address */}
          <Input
            label="Địa chỉ"
            placeholder="Số nhà, tên đường..."
            icon={MapPin}
            value={formData.address || undefined}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <ButtonAction
            label="Tạo nhân viên"
            onClick={handleSubmit}
            loading={isPending}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default CreateNhanVien;
