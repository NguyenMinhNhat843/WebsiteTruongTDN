import { useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import type { components } from "../../../../api/v1";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../../api/client";
import type { RoleType } from "../../../../api/type";

// Lấy type từ schema đã gen
type RegisterRequestBody = components["schemas"]["RegisterRequest"];

export const [CreateNhanVienProvider, useCreateNhanVienContext] =
  createContextProvider(() => {
    const queryClient = useQueryClient();

    // Khởi tạo giá trị mặc định
    const initialFormState: RegisterRequestBody = {
      username: "minhnhat3256",
      password: "minhnhat3256",
      confirmPassword: "minhnhat3256",
      role: "ADMIN" as RoleType,
      gender: "OTHER",
    };

    const [formData, setFormData] =
      useState<RegisterRequestBody>(initialFormState);

    // Định nghĩa mutation
    const { mutate, isPending, error } = useMutation({
      mutationFn: async (data: RegisterRequestBody) => {
        const { data: resData, error } = await client.POST("/auth/register", {
          body: data,
        });

        if (error) {
          // openapi-fetch trả error trong object, ta cần throw để TanStack Query bắt được
          throw error;
        }
        return resData;
      },
      onSuccess: () => {
        alert("Tạo nhân viên thành công!");
        setFormData(initialFormState); // Reset form
        // Refetch danh sách nhân viên nếu cần (ví dụ key là 'nhan-vien')
        queryClient.invalidateQueries({ queryKey: ["nhan-vien"] });
      },
    });

    const handleSubmit = async () => {
      // Validate cơ bản trước khi gửi
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      // Kích hoạt gọi API
      mutate(formData);
    };

    return {
      formData,
      setFormData,
      handleSubmit,
      isPending,
      mutate,
      error,
    };
  });
