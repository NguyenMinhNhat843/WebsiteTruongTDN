import React, { forwardRef, type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ICON_SIZES, SIZE_CLASSES } from '../constant/inputSize.constant'

// 1. Tách hằng số Icon Sizes

export interface ButtonActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'export'
  loading?: boolean
  label?: string
  withText?: boolean
}

const ButtonAction = forwardRef<HTMLButtonElement, ButtonActionProps>(
  (
    {
      children,
      icon,
      size = 'md',
      variant = 'primary',
      loading = false,
      disabled,
      className,
      label,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold \
      transition-all duration-200 \
      cursor-pointer \
      focus:outline-none focus:ring-4 \
      active:scale-95 active:opacity-90 \
      hover:shadow-sm hover:-translate-y-[1px] \
      disabled:opacity-70 disabled:cursor-not-allowed'

    const variantClasses = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-transparent focus:border-blue-500 focus:ring-blue-100',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-transparent focus:border-slate-400 focus:ring-slate-200',
      outline:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:border-blue-500 focus:ring-blue-50',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent focus:border-red-500 focus:ring-red-100',
      export:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-transparent focus:border-emerald-500 focus:ring-emerald-100',
    }

    const hasText = Boolean(children || label)
    const content = children || label
    const isLoading = loading && !disabled
    const ariaLabel = props['aria-label'] || (icon && !children ? 'Action' : undefined)

    const iconSize = ICON_SIZES[size]
    const currentSize = SIZE_CLASSES[size]
    const computedSizeClass = clsx(currentSize.base, hasText ? currentSize.withText : currentSize.iconOnly)

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            baseClasses,
            variantClasses[variant],
            computedSizeClass,
            !hasText && 'aspect-square p-0',
            { 'cursor-wait opacity-75': isLoading },
            className,
          ),
        )}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="mr-2 -ml-1 animate-spin text-current"
              style={{ width: iconSize, height: iconSize }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {hasText && <span>Đang xử lý...</span>}
          </span>
        ) : (
          <div className="flex items-center justify-center">
            {icon && <span className={clsx(hasText && 'mr-2')}>{icon}</span>}
            {hasText && <span>{content}</span>}
          </div>
        )}
      </button>
    )
  },
)

ButtonAction.displayName = 'ButtonAction'
export default ButtonAction
