import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  label?: string;
  className?: string;
  withText?: boolean; // Nếu true, luôn hiển thị text (dù có icon hay không)
}

const ButtonAction = forwardRef<HTMLButtonElement, ButtonActionProps>(
  (
    {
      children,
      icon,
      size = "md",
      loading = false,
      disabled,
      className,
      label,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "border border-slate-400 inline-flex items-center justify-center font-semibold \
        transition-all duration-150 ease-in-out \
        cursor-pointer \
        focus:outline-none \
        active:scale-95 active:opacity-90 \
        hover:shadow-sm hover:-translate-y-[1px] \
        disabled:opacity-70 disabled:cursor-not-allowed";

    // Kiểm tra xem có text hiển thị hay không
    const hasText = Boolean(children || label);

    const sizeClasses = {
      sm: clsx("h-8 rounded-lg text-xs", hasText ? "px-3" : "w-8"),
      md: clsx("h-10 rounded-xl text-sm", hasText ? "px-4" : "w-10"),
      lg: clsx("h-12 rounded-xl text-md", hasText ? "px-6" : "w-12"),
    };

    const content = children || label;

    const isLoading = loading && !disabled;

    // Auto aria-label nếu chỉ có icon
    const ariaLabel =
      props["aria-label"] || (icon && !children ? "Action" : undefined);

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            baseClasses,
            sizeClasses[size],
            !hasText && "aspect-square p-0", // Nếu không có text, đảm bảo button là hình vuông
            { "opacity-75 cursor-wait": isLoading },
            className, // className truyền vào sau sẽ ghi đè các class trước đó
          ),
        )}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {hasText && <span>{content}</span>}
          </span>
        ) : (
          <div className="flex items-center justify-center">
            {icon && <span className={clsx(hasText && "mr-2")}>{icon}</span>}
            {hasText && <span>{content}</span>}
          </div>
        )}
      </button>
    );
  },
);

ButtonAction.displayName = "ButtonAction";

export default ButtonAction;
