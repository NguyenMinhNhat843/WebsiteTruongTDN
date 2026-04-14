import clsx from "clsx";
import type { ReactNode, SelectHTMLAttributes } from "react";

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
}

export const SelectOption = ({
  label,
  icon,
  options,
  className = "",
  containerClassName = "",
  error,
  id,
  labelClassName = "",
  ...props
}: SelectOptionProps) => {
  return (
    <div className={clsx(`flex flex-col gap-1.5`, containerClassName)}>
      {/* Label & Icon */}
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "flex items-center gap-2 text-sm font-semibold text-gray-700 ml-1",
            labelClassName,
          )}
        >
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </label>
      )}

      <div className="relative group">
        <select
          id={id}
          className={clsx(
            `
            w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl 
            focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 
            block p-3 transition-all duration-200 outline-none
            cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500/20" : "hover:border-gray-300"}`,
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
              d="Stack 19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 ml-1 italic">{error}</p>
      )}
    </div>
  );
};
