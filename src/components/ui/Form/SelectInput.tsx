import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { ChevronDown, Loader2, Search, X } from 'lucide-react'
import { cn } from '../../../util/cn'
import { ICON_SIZES, SIZE_CLASSES } from '../../constant/inputSize.constant'

export interface SelectOptionType {
  value: string | number
  label: React.ReactNode // Sửa thành ReactNode để nhận mọi element
  searchText?: string // Bắt buộc thêm nếu label KHÔNG phải là string (dùng để search và làm placeholder)
}

// Dùng Omit để bỏ qua thuộc tính size mặc định của thẻ input HTML, thay bằng size của chúng ta
interface SelectSearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  options: SelectOptionType[]
  isLoading?: boolean
  error?: string
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' // Thêm prop size
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onChange?: (e: any) => void
}

const SelectSearchInput = React.forwardRef<HTMLInputElement, SelectSearchInputProps>(
  (
    {
      label,
      options = [],
      error,
      placeholder = 'Chọn một tùy chọn...',
      value,
      onChange,
      name,
      isLoading,
      className,
      size = 'md', // Default size là md
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const isSelectingRef = useRef(false)

    const [localValue, setLocalValue] = useState<string | number | undefined>(
      Array.isArray(value) ? value[0] : (value as string | number | undefined),
    )

    const selectedValue =
      value !== undefined
        ? Array.isArray(value)
          ? value[0]
          : (value as string | number | undefined)
        : localValue

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionsContainerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => inputRef.current!)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchTerm('')
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Hàm lấy chuỗi text để filter
    const getSearchText = (option: SelectOptionType) => {
      if (option.searchText) return option.searchText.toLowerCase()
      if (typeof option.label === 'string') return option.label.toLowerCase()
      return ''
    }

    const filteredOptions = options.filter((option) =>
      getSearchText(option).includes(searchTerm.toLowerCase()),
    )

    useEffect(() => {
      if (focusedIndex >= 0 && optionsContainerRef.current) {
        const container = optionsContainerRef.current
        const focusedElement = container.children[focusedIndex] as HTMLElement

        if (focusedElement) {
          const containerTop = container.scrollTop
          const containerBottom = containerTop + container.clientHeight
          const elemTop = focusedElement.offsetTop
          const elemBottom = elemTop + focusedElement.clientHeight

          if (elemTop < containerTop) {
            container.scrollTop = elemTop
          } else if (elemBottom > containerBottom) {
            container.scrollTop = elemBottom - container.clientHeight
          }
        }
      }
    }, [focusedIndex])

    const selectedOption = options.find((opt) => opt.value === selectedValue)

    const handleSelectOption = (option: SelectOptionType) => {
      isSelectingRef.current = true
      setLocalValue(option.value)
      setIsOpen(false)
      setSearchTerm('')

      searchInputRef.current?.focus()

      if (onChange) {
        onChange({
          target: { name: name, value: option.value },
        })
      }

      setTimeout(() => {
        isSelectingRef.current = false
      }, 100)
    }

    const handleClearSelection = (e: React.MouseEvent) => {
      e.stopPropagation()
      setLocalValue('')
      if (onChange) {
        onChange({
          target: { name: name, value: '' },
        })
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prevIndex) => (prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelectOption(filteredOptions[focusedIndex])
          } else if (filteredOptions.length > 0 && focusedIndex === -1) {
            handleSelectOption(filteredOptions[0])
          }
          break
        case 'Escape':
        case 'Tab':
          if (e.key === 'Escape') e.preventDefault()
          setIsOpen(false)
          setSearchTerm('')
          break
      }
    }

    // Hàm lấy text hiển thị cho placeholder của input khi đang mở
    const getPlaceholderText = () => {
      if (!isOpen) return ''
      if (selectedOption) {
        return (
          selectedOption.searchText ||
          (typeof selectedOption.label === 'string' ? selectedOption.label : placeholder)
        )
      }
      return placeholder
    }

    return (
      <div ref={containerRef} className={cn('relative flex w-full flex-col gap-1.5 text-left', className)}>
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}

        <div className="relative">
          <input type="hidden" name={name} value={selectedValue || ''} ref={inputRef} {...props} />

          <div
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true)
                searchInputRef.current?.focus()
              }
            }}
            className={cn(
              'flex w-full items-center justify-between border border-slate-200 bg-white transition-all duration-200 select-none focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-300',
              SIZE_CLASSES[size].base, // Apply height & border-radius
              SIZE_CLASSES[size].withText, // Apply padding
              isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : '',
              error
                ? 'border-red-500 ring-2 ring-red-500/10 focus-within:border-red-500 focus-within:ring-red-500/10 hover:border-red-500'
                : '',
            )}
          >
            <div className="relative mr-2 flex h-full min-w-0 flex-1 items-center gap-2">
              {isOpen && <Search size={ICON_SIZES[size]} className="shrink-0 text-slate-400" />}

              <input
                ref={searchInputRef}
                type="text"
                placeholder={getPlaceholderText() as string}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setFocusedIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (!isSelectingRef.current) {
                    setIsOpen(true)
                  }
                }}
                className={cn(
                  'h-full w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none',
                  !isOpen ? 'absolute inset-0 cursor-pointer opacity-0' : '',
                )}
              />

              {!isOpen && (
                <div
                  className={cn(
                    'pointer-events-none flex h-full w-full items-center truncate pr-4',
                    !selectedOption && 'text-slate-400',
                    selectedOption && 'text-slate-900',
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1 text-slate-400">
              {selectedValue && !isOpen && (
                <X
                  size={ICON_SIZES[size]}
                  className="cursor-pointer transition-colors hover:text-slate-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearSelection(e)
                  }}
                />
              )}
              {isLoading ? (
                <Loader2 size={ICON_SIZES[size]} className="animate-spin text-blue-500" />
              ) : (
                <ChevronDown
                  size={ICON_SIZES[size]}
                  className={cn(
                    'cursor-pointer transition-transform duration-200',
                    isOpen && 'rotate-180 text-blue-500',
                  )}
                  onClick={(e) => {
                    if (isOpen) {
                      e.stopPropagation()
                      setIsOpen(false)
                      setSearchTerm('')
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute right-0 left-0 z-50 mt-1 flex max-h-48 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            style={{ top: '100%' }}
          >
            <div ref={optionsContainerRef} className="flex-1 divide-y divide-slate-50 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === selectedValue
                  const isFocused = index === focusedIndex

                  return (
                    <div
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectOption(option)
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between px-4 py-2 text-slate-700 transition-colors',
                        // Kế thừa size của component cha để định dạng option list cho cân đối
                        size === 'sm' ? 'text-xs' : 'text-sm',
                        isFocused ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50',
                        isSelected && 'bg-blue-50 font-medium text-blue-600',
                      )}
                    >
                      {/* Bỏ thẻ span truncate mặc định nếu bạn muốn render full ReactNode, 
                          hoặc bọc lại tuỳ vào thiết kế. 
                      */}
                      <div className="w-full truncate">{option.label}</div>
                    </div>
                  )
                })
              ) : (
                <div className="px-4 py-3 text-center text-sm text-slate-400 italic">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </div>
        )}

        {error && <span className="text-xs font-medium text-red-500">{error}</span>}
      </div>
    )
  },
)

SelectSearchInput.displayName = 'SelectSearchInput'

export default SelectSearchInput
