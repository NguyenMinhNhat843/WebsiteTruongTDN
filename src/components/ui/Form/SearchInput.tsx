import { Search, X } from 'lucide-react'
import { useRef, type FunctionComponent } from 'react'
import Input from './Input'
import clsx from 'clsx'
import { ICON_SIZES } from '../../constant/inputSize.constant'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  containerClassName?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const SearchInput: FunctionComponent<SearchInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Tìm kiếm...',
  className = '',
  containerClassName = '',
  size = 'md',
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  // Kích thước icon X tương ứng theo size
  const clearIconSize = ICON_SIZES[size]

  // Căn chỉnh vị trí top cho nút X tùy theo việc có label hay không
  const clearButtonPositionClass = label ? 'bottom-2.5' : 'top-1/2 -translate-y-1/2'

  // Thêm padding-right bổ sung để chữ trong input không đè lên nút X
  const extraPaddingRight = {
    sm: 'pr-8',
    md: 'pr-9',
    lg: 'pr-10',
  }

  return (
    <div className={`group relative ${containerClassName}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={Search}
        label={label}
        size={size}
        className={clsx(value && extraPaddingRight[size], className)}
      />

      {/* Nút Xóa (Clear Button) */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={clsx(
            'animate-in fade-in zoom-in absolute right-2.5 rounded-full p-1 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600',
            clearButtonPositionClass,
          )}
        >
          <X size={clearIconSize - 2} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
