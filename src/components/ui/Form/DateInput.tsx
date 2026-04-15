import clsx from "clsx";
import { Calendar } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  require?: boolean;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      error,
      containerClassName = "",
      className = "",
      labelClassName = "",
      require,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx("w-full space-y-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={clsx(
              "text-sm font-semibold text-gray-700 ml-1",
              labelClassName,
            )}
          >
            {label}
            {require && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Calendar Icon (Trang trí bên trái) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
            <Calendar size={18} />
          </div>

          {/* Input Date chính */}
          <input
            ref={ref}
            type="date"
            {...props}
            className={clsx(
              `
                w-full transition-all duration-200
                rounded-xl border shadow-sm
                py-2.5 pl-10 pr-4
                text-sm outline-none
                cursor-pointer
                
                /* Ma thuật ở đây: Phủ kín vùng click */
                relative
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:inset-0
                [&::-webkit-calendar-picker-indicator]:w-full
                [&::-webkit-calendar-picker-indicator]:h-full
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:opacity-0
                
                ${
                  error
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed`,
              className,
            )}
          />
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <p className="text-xs text-red-500 mt-1 ml-1 font-medium italic">
            {error}
          </p>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;
