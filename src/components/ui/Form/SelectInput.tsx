import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "../../../util/cn";

export interface SelectOptionType {
  value: string | number;
  label: string;
}

interface SelectSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  options: SelectOptionType[];
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onChange?: (e: any) => void;
}

const SelectSearchInput = React.forwardRef<
  HTMLInputElement,
  SelectSearchInputProps
>(
  (
    {
      label,
      options = [],
      error,
      placeholder = "Chọn một tùy chọn...",
      value,
      onChange,
      name,
      isLoading,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Thêm state để theo dõi index của option đang được "focus" bằng bàn phím
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const [localValue, setLocalValue] = useState<string | number | undefined>(
      Array.isArray(value) ? value[0] : (value as string | number | undefined),
    );

    const selectedValue =
      value !== undefined
        ? Array.isArray(value)
          ? value[0]
          : (value as string | number | undefined)
        : localValue;

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Ref để cuộn danh sách tự động theo phím mũi tên
    const optionsContainerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    // Đóng dropdown khi click ra ngoài vùng component
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lọc options dựa trên từ khóa search
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Reset focusedIndex mỗi khi đóng/mở hoặc thay đổi từ khóa tìm kiếm

    // Tự động cuộn phần tử được hover/focus bằng bàn phím vào vùng nhìn thấy (Scroll Into View)
    useEffect(() => {
      if (focusedIndex >= 0 && optionsContainerRef.current) {
        const container = optionsContainerRef.current;
        const focusedElement = container.children[focusedIndex] as HTMLElement;

        if (focusedElement) {
          const containerTop = container.scrollTop;
          const containerBottom = containerTop + container.clientHeight;
          const elemTop = focusedElement.offsetTop;
          const elemBottom = elemTop + focusedElement.clientHeight;

          if (elemTop < containerTop) {
            container.scrollTop = elemTop;
          } else if (elemBottom > containerBottom) {
            container.scrollTop = elemBottom - container.clientHeight;
          }
        }
      }
    }, [focusedIndex]);

    // Lấy label của option đang được chọn
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelectOption = (option: SelectOptionType) => {
      setLocalValue(option.value);
      setIsOpen(false);
      setSearchTerm("");

      if (onChange) {
        onChange({
          target: {
            name: name,
            value: option.value,
          },
        });
      }
    };

    const handleClearSelection = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalValue("");
      if (onChange) {
        onChange({
          target: {
            name: name,
            value: "",
          },
        });
      }
    };

    // Xử lý sự kiện bàn phím khi đang tương tác tại ô nhập dữ liệu
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prevIndex) =>
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0,
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1,
          );
          break;

        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelectOption(filteredOptions[focusedIndex]);
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          break;

        default:
          break;
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full flex flex-col gap-1.5 text-left",
          className,
        )}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        {/* Khung chứa Input hiển thị chính */}
        <div className="relative">
          {/* Input ẩn phục vụ cho React Hook Form lấy data */}
          <input
            type="hidden"
            name={name}
            value={selectedValue || ""}
            ref={inputRef}
            {...props}
          />

          {/* Hộp Select tích hợp ô Search trực tiếp */}
          <div
            onClick={() => {
              if (!isOpen) setIsOpen(true);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-lg transition-all duration-200 select-none border-slate-200 hover:border-slate-300",
              isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "",
              error
                ? "border-red-500 ring-2 ring-red-500/10 hover:border-red-500"
                : "",
            )}
          >
            {isOpen ? (
              /* TRẠNG THÁI MỞ: Biến thành ô Input để Search trực tiếp tại đây */
              <div className="flex items-center gap-2 flex-1 mr-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={
                    selectedOption ? selectedOption.label : placeholder
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown} // Gắn bộ lắng nghe sự kiện phím tại đây
                  className="w-full bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                  autoFocus
                />
              </div>
            ) : (
              /* TRẠNG THÁI ĐÓNG: Hiển thị Label hoặc Placeholder bình thường */
              <span
                className={cn(
                  "truncate text-slate-900",
                  !selectedOption && "text-slate-400",
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}

            {/* Các nút chức năng (Xóa lựa chọn và Mũi tên Dropdown) */}
            <div className="flex items-center gap-1 text-slate-400 shrink-0">
              {selectedValue && !isOpen && (
                <X
                  className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelection(e);
                  }}
                />
              )}
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200 cursor-pointer",
                    isOpen && "rotate-180 text-blue-500",
                  )}
                  onClick={(e) => {
                    if (isOpen) {
                      e.stopPropagation();
                      setIsOpen(false);
                      setSearchTerm("");
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu (Chỉ còn chứa danh sách Options kết quả) */}
        {isOpen && (
          <div
            className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 flex flex-col overflow-hidden"
            style={{ top: "100%" }}
          >
            <div
              ref={optionsContainerRef} // Gắn ref để tính toán điểm cuộn (scroll)
              className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === selectedValue;
                  const isFocused = index === focusedIndex; // Kiểm tra xem index này có đang được chọn bằng bàn phím không

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelectOption(option)}
                      onMouseEnter={() => setFocusedIndex(index)} // Rê chuột vào đâu thì đồng bộ tiêu điểm bàn phím vào đó
                      className={cn(
                        "px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between text-slate-700",
                        isFocused
                          ? "bg-slate-100 text-slate-900"
                          : "hover:bg-slate-50",
                        isSelected && "bg-blue-50 text-blue-600 font-medium",
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400 text-center italic">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hiển thị thông báo lỗi */}
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

SelectSearchInput.displayName = "SelectSearchInput";

export default SelectSearchInput;
