import React, { forwardRef, useRef } from "react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean; // Thêm option required kiểu boolean
}

export const DateInputv2 = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, required, onChange, onKeyDown, ...props }, ref) => {
    // Ref để theo dõi phím vừa ấn (Xóa hay Gõ) nhằm tránh lỗi kẹt dấu "/" khi backspace
    const isDeleteAction = useRef(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      isDeleteAction.current = e.key === "Backspace" || e.key === "Delete";
      if (onKeyDown) onKeyDown(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, ""); // Chỉ lấy số

      // Logic tự động chèn dấu "/" NGAY KHI gõ đủ số (ví dụ gõ "20" -> thành "20/")
      if (!isDeleteAction.current) {
        if (value.length >= 2 && value.length < 4) {
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else if (value.length >= 4) {
          value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        }
      } else {
        // Nếu ĐANG XÓA, giữ nguyên logic format cũ để không bị kẹt
        if (value.length > 2 && value.length <= 4) {
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else if (value.length > 4) {
          value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        }
      }

      // Tạo synthetic event giả lập cho React Hook Form
      const simulatedEvent = {
        ...e,
        target: {
          ...e.target,
          value,
          name: props.name || "",
        },
      };

      if (onChange) {
        onChange(simulatedEvent);
      }
    };

    return (
      <div className="flex flex-col gap-1.5 mb-4 w-full select-none">
        {/* Hiện label nếu được truyền vào, đồng thời check required để thêm dấu * đỏ */}
        {label && (
          <label className="text-[13px] font-semibold text-gray-700 alignment-light">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            onKeyDown={handleKeyDown}
            onChange={handleTextChange}
            required={required} // Truyền thuộc tính required chuẩn của HTML input
            {...props}
            type="text" // Khóa cứng type text
            className={`
              w-full px-3 py-2 text-[14px] bg-white text-gray-800
              border rounded-xl outline-none transition-all duration-150
              placeholder-gray-400
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 hover:border-gray-400 focus:border-[#2680EB] focus:ring-2 focus:ring-[#2680EB]/15"
              }
            `}
          />
        </div>

        {error && (
          <span className="text-[12px] text-red-500 font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  },
);

DateInputv2.displayName = "DateInputv2";
