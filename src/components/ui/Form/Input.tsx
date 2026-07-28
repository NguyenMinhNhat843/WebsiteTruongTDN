import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { ICON_SIZES, SIZE_CLASSES } from '../../constant/inputSize.constant'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  icon?: LucideIcon
  error?: string
  containerClassName?: string
  labelClassName?: string
  require?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      require,
      size = 'md',
      containerClassName = '',
      className = '',
      labelClassName = '',
      ...props
    },
    ref,
  ) => {
    // Lấy config size từ file constant
    const currentSize = SIZE_CLASSES[size]
    const iconSize = ICON_SIZES[size]

    // Style padding theo size để cân đối với icon
    const paddingClasses = {
      sm: Icon ? 'pl-8 pr-3' : 'px-3',
      md: Icon ? 'pl-10 pr-4' : 'px-4',
      lg: Icon ? 'pl-11 pr-5' : 'px-5',
    }

    return (
      <div className={clsx('space-y-1.5', containerClassName || 'w-full')}>
        {/* Label */}
        {label && (
          <label
            className={clsx(
              'ml-1 font-semibold text-gray-700',
              size === 'sm' ? 'text-xs' : 'text-sm',
              labelClassName,
            )}
          >
            {label}
            {require && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="group relative">
          {/* Icon */}
          {Icon && (
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
              <Icon size={iconSize} />
            </div>
          )}

          {/* Input chính */}
          <input
            ref={ref}
            {...props}
            required={require}
            className={clsx(
              `w-full border shadow-sm transition-all duration-200 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50`,
              currentSize.base,
              paddingClasses[size],
              error
                ? 'border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50',
              className,
            )}
          />
        </div>

        {/* Thông báo lỗi */}
        {error && <p className="mt-1 ml-1 text-xs font-medium text-red-500 italic">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
