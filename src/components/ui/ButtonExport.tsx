import React, { type ButtonHTMLAttributes } from "react";
import { cn } from "../../util/cn";

interface ButtonExportProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isPending?: boolean;
}

const ButtonExport: React.FC<ButtonExportProps> = ({
  isPending = false,
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white",
        "font-medium px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
        "shadow-[0_2px_8px_-3px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]",
        "flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:pointer-events-none select-none",
        className,
      )}
      {...props}
    >
      {isPending ? (
        <>
          {/* Spinner xoay tròn */}
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-95"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="tracking-wide">Đang tạo file...</span>
        </>
      ) : (
        <>
          {/* Nội dung mặc định nếu không truyền children, có icon Sheets tối giản */}
          {children || (
            <>
              <svg
                className="w-4 h-4 text-emerald-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <span className="tracking-wide">Xuất dữ liệu Excel</span>
            </>
          )}
        </>
      )}
    </button>
  );
};

export default ButtonExport;
