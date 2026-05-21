import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "../../../util/cn";

interface Option {
  value: string | number;
  label: string;
  icon?: ReactNode; // Thêm icon cho từng option
}

interface SelectOptionProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode; // Icon hiển thị bên cạnh Label chính
  options: Option[];
  containerClassName?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  require?: boolean;
}

export const SelectOption = forwardRef<HTMLSelectElement, SelectOptionProps>(
  (
    {
      label,
      icon,
      options,
      className = "",
      containerClassName = "",
      error,
      id,
      labelClassName = "",
      require,
      ...props
    },
    ref,
  ) => {
    // Thêm tham số ref ở đây
    return (
      <div className={cn(`flex flex-col gap-1.5`, containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-gray-700 ml-1",
              labelClassName,
            )}
          >
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
            {require && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative group">
          <select
            ref={ref} // Gắn ref vào đây để React Hook Form quản lý
            id={id}
            className={cn(
              `w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl block p-2.5 transition-all duration-200 outline-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${
                error ? "border-red-500 focus:ring-red-500/20" : ""
              }`,
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 ml-1 italic">{error}</p>
        )}
      </div>
    );
  },
);

SelectOption.displayName = "SelectOption";
