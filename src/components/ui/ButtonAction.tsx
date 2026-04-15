import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export interface ButtonActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  label?: string;
}

const ButtonAction = forwardRef<HTMLButtonElement, ButtonActionProps>(
  (
    {
      children,
      icon,
      variant = "primary",
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
      "inline-flex items-center justify-center font-medium transition-all cursor-pointer duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-xl",
    };

    const variantClasses = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-white",
      secondary:
        "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-600 focus:ring-offset-white",
      outline:
        "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 focus:ring-offset-white",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-white",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-white",
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
          variantClasses[variant],
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
              <span className={clsx("mr-2", content && "shrink-0")}>
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
