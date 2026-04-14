import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      containerClassName = "",
      className = "",
      labelClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx(`w-full space-y-1.5`, containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={clsx(
              "text-sm font-semibold text-gray-700 ml-1",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icon */}
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Icon size={18} />
            </div>
          )}

          {/* Input chính */}
          <input
            ref={ref}
            {...props}
            className={clsx(
              `
              w-full transition-all duration-200
              rounded-xl border shadow-sm
              py-2.5 ${Icon ? "pl-10" : "pl-4"} pr-4
              text-sm outline-none
              placeholder:text-gray-400
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

// Gán tên hiển thị để dễ debug trong React DevTools
Input.displayName = "Input";

export default Input;
