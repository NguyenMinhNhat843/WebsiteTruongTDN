import React, { useState } from "react";
import { User, Lock, Shield, X } from "lucide-react";
import Input from "../../components/ui/Form/Input";
import { SelectOption } from "../../components/ui/Form/SelectOption";
import ButtonAction from "../../components/ui/ButtonAction";
import { UserRoles, type UserRole } from "../../api/enum/UserEnum";
import { $api } from "../../api/client";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId?: number;
  studentId?: number;
}

export default function RegisterModal({
  isOpen,
  onClose,
  staffId,
  studentId,
}: RegisterModalProps) {
  /**
   * api register
   */
  const { mutate: register, isPending: isRegisting } = $api.useMutation(
    "post",
    "/auth/register",
  );
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    role: UserRole;
  }>({
    username: "",
    password: "",
    role: "admin",
  });

  if (!isOpen) return null;

  const roleOptions = [
    {
      label: "Chọn vai trò",
      value: "",
    },
    ...UserRoles.map((role) => ({
      label: role.charAt(0).toUpperCase() + role.slice(1),
      value: role,
    })),
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    register(
      {
        body: {
          ...formData,
          staffId: staffId || undefined,
          studentId: studentId || undefined,
        },
      },
      {
        onSuccess: () => {
          alert(`Đăng ký thành công tài khoản: ${formData.username}`);
          setFormData({ username: "", password: "", role: "admin" });
          onClose();
          window.location.reload();
        },
        onError: (error) => {
          console.error("Đăng ký thất bại:", error);
          alert("Đăng ký thất bại: " + JSON.stringify(error));
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100 transition-all transform scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          type="button"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Tiêu đề Modal */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Tạo Tài Khoản</h2>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng điền đầy đủ các thông tin bên dưới
          </p>
        </div>

        {/* Form Đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên đăng nhập sử dụng component Input */}
          <Input
            label="Username (Tên đăng nhập)"
            name="username"
            type="text"
            placeholder="Nhập tên đăng nhập..."
            value={formData.username}
            onChange={handleChange}
            icon={User}
            require
          />

          {/* Mật khẩu sử dụng component Input */}
          <Input
            label="Password (Mật khẩu)"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu của bạn..."
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            require
          />

          {/* Vai trò sử dụng component SelectOption */}
          <SelectOption
            label="Role (Vai trò)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            icon={<Shield size={16} />}
            require
          />

          {/* Nút Submit sử dụng component ButtonAction */}
          <div className="pt-2">
            <ButtonAction
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isRegisting}
              label="Đăng Ký Tài Khoản"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
