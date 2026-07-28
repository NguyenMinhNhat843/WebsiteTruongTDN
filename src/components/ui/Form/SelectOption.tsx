import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../../util/cn' // Hoặc import { twMerge } từ 'tailwind-merge' / clsx
import { ICON_SIZES, SIZE_CLASSES } from '../../constant/inputSize.constant'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Option {
  value: any
  label: ReactNode
  disabled?: boolean
}

export interface SelectOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  label?: string
  icon?: ReactNode // Icon hiển thị bên trái của Input
  options: Option[]
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  containerClassName?: string
  labelClassName?: string
  error?: string
  require?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxHeight?: string | number // Ví dụ: "200px", "15rem", hoặc 250
}

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  (
    {
      label,
      icon,
      options = [],
      value,
      onChange,
      placeholder = 'Chọn một tùy chọn...',
      containerClassName = '',
      className = '',
      labelClassName = '',
      error,
      require,
      disabled = false,
      size = 'md',
      maxHeight = '240px',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Forward ref ra ngoài nếu parent cần truy cập DOM node
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    // Xử lý đóng Dropdown khi click ra ngoài
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (option: Option) => {
      if (option.disabled) return
      onChange?.(option.value)
      setIsOpen(false)
    }

    const currentSize = SIZE_CLASSES[size]
    const iconSize = ICON_SIZES[size]

    // Padding trái tự động theo icon
    const paddingClasses = {
      sm: icon ? 'pl-8 pr-8' : 'pl-3 pr-8',
      md: icon ? 'pl-10 pr-10' : 'pl-4 pr-10',
      lg: icon ? 'pl-11 pr-11' : 'pl-5 pr-11',
    }

    // Chuẩn hóa maxHeight thành CSS string
    const formattedMaxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

    return (
      <div
        ref={containerRef}
        className={cn('relative flex w-full flex-col gap-1.5', containerClassName)}
        {...props}
      >
        {/* Label */}
        {label && (
          <label
            className={cn(
              'ml-1 flex items-center gap-1 font-semibold text-gray-700',
              size === 'sm' ? 'text-xs' : 'text-sm',
              labelClassName,
            )}
          >
            {label}
            {require && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Custom Trigger Input */}
        <div className="group relative">
          {/* Left Icon */}
          {icon && (
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
              {icon}
            </div>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              'flex w-full items-center justify-between border text-left shadow-sm transition-all duration-200 outline-none',
              currentSize.base,
              paddingClasses[size],
              error
                ? 'border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50',
              isOpen && !error && 'border-blue-500 ring-4 ring-blue-50',
              disabled && 'cursor-not-allowed bg-gray-50 text-gray-400',
              className,
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
            </span>

            {/* Arrow Icon */}
            <ChevronDown
              size={iconSize}
              className={cn(
                'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180 text-blue-500',
              )}
            />
          </button>
        </div>

        {/* Dropdown Menu xổ xuống */}
        {isOpen && !disabled && (
          <div
            style={{ maxHeight: formattedMaxHeight }}
            className="animate-in fade-in zoom-in-95 custom-scrollbar absolute top-full right-0 left-0 z-50 mt-1.5 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 transition-all duration-150"
          >
            {options.length > 0 ? (
              options.map((opt, idx) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors select-none',
                      isSelected
                        ? 'bg-blue-50 font-semibold text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      opt.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">{opt.label}</div>

                    {isSelected && <Check size={16} className="ml-2 shrink-0 text-blue-600" />}
                  </div>
                )
              })
            ) : (
              <div className="px-3 py-2 text-center text-xs text-gray-400">Không có dữ liệu</div>
            )}
          </div>
        )}

        {/* Thông báo lỗi */}
        {error && <p className="mt-1 ml-1 text-xs font-medium text-red-500 italic">{error}</p>}
      </div>
    )
  },
)

SelectOption.displayName = 'SelectOption'
