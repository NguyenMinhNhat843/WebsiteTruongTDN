import React, { forwardRef, useRef } from "react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean; // Thêm option required kiểu boolean
}

// Ghép chuỗi số thuần thành định dạng DD-MM-YYYY,
// tự động thêm dấu "-" ngay khi gõ xong đủ 2 số (ngày / tháng)
const formatDigits = (digits: string) => {
  if (digits.length < 2) return digits;
  if (digits.length < 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  if (digits.length === 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

export const DateInputv2 = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, required, onChange, onKeyDown, ...props }, ref) => {
    // Ref để theo dõi phím vừa ấn (Xóa hay Gõ) nhằm tránh lỗi kẹt dấu "-" khi backspace
    const isDeleteAction = useRef(false);
    // Lưu lại số lượng digit của lần render trước để phát hiện backspace bị "kẹt" ở dấu "-"
    const prevDigitsLen = useRef(0);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      isDeleteAction.current = e.key === "Backspace" || e.key === "Delete";
      if (onKeyDown) onKeyDown(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      let digits = input.value.replace(/\D/g, "").slice(0, 8); // Chỉ lấy tối đa 8 số

      // Nếu đang xóa (Backspace/Delete) nhưng số lượng digit không đổi,
      // nghĩa là con trỏ vừa xóa trúng dấu "-" -> xóa thêm 1 số nữa để không bị kẹt
      if (
        isDeleteAction.current &&
        digits.length === prevDigitsLen.current &&
        digits.length > 0
      ) {
        digits = digits.slice(0, -1);
      }

      prevDigitsLen.current = digits.length;
      const value = formatDigits(digits);

      // QUAN TRỌNG: cập nhật trực tiếp giá trị hiển thị trên DOM input
      // (nếu không, input là uncontrolled sẽ vẫn hiện chuỗi số thô chưa format)
      input.value = value;

      // Đặt lại vị trí con trỏ về cuối chuỗi (tránh nhảy về đầu sau khi set value)
      requestAnimationFrame(() => {
        input.setSelectionRange(value.length, value.length);
      });

      // Tạo synthetic event giả lập cho React Hook Form
      const simulatedEvent = {
        ...e,
        target: {
          ...input,
          value,
          name: props.name || "",
        },
      };

      if (onChange) {
        onChange(simulatedEvent as React.ChangeEvent<HTMLInputElement>);
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
            placeholder="DD-MM-YYYY"
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
