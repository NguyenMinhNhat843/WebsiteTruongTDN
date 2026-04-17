import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

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
      withText = true,
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
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-xl",
      md: "px-4 py-2 text-sm rounded-xl",
      lg: "px-6 py-3 text-md rounded-xl",
    };

    const content = children || label;

    const isLoading = loading && !disabled;

    // Auto aria-label nếu chỉ có icon
    const ariaLabel =
      props["aria-label"] || (icon && !children ? "Action" : undefined);

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          {
            "opacity-75 cursor-wait": isLoading,
          },
          className,
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
            <span>{content}</span>
          </span>
        ) : (
          <>
            {icon && (
              <span className={clsx(withText && "mr-2", content && "shrink-0")}>
                {icon}
              </span>
            )}
            {content}
          </>
        )}
      </button>
    );
  },
);

ButtonAction.displayName = "ButtonAction";

export default ButtonAction;
