import { useState } from "react";
import type { FormErrors, PostFormValues } from "../types/Post.types";

// ─── Return type ──────────────────────────────────────────────────────────────

interface UsePostValidationReturn {
  errors: FormErrors;
  validate: (
    values: Pick<PostFormValues, "title" | "category" | "content" | "audience">,
  ) => boolean;
  clearError: (field: keyof FormErrors) => void;
  clearAllErrors: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePostValidation(): UsePostValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Validate các field bắt buộc.
   * Trả về true nếu hợp lệ, false nếu có lỗi.
   */
  const validate = (
    values: Pick<PostFormValues, "title" | "category" | "content" | "audience">,
  ): boolean => {
    const newErrors: FormErrors = {};

    if (!values.title.trim())
      newErrors.title = "Vui lòng nhập tiêu đề bài viết.";

    if (!values.category) newErrors.category = "Vui lòng chọn danh mục.";

    if (!values.content.trim())
      newErrors.content = "Vui lòng nhập nội dung bài viết.";

    if (values.audience.length === 0)
      newErrors.audience = "Vui lòng chọn ít nhất một đối tượng.";

    setErrors(newErrors);

    // Hợp lệ khi không có lỗi nào
    return Object.keys(newErrors).length === 0;
  };

  /** Xóa lỗi của 1 field cụ thể (dùng khi user bắt đầu chỉnh sửa field đó) */
  const clearError = (field: keyof FormErrors): void => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /** Xóa toàn bộ lỗi (dùng khi reset form) */
  const clearAllErrors = (): void => {
    setErrors({});
  };

  return { errors, validate, clearError, clearAllErrors };
}
