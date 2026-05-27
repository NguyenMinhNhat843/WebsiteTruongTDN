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
      className, // Lấy className ra từ props
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

    // Hợp nhất ref bên ngoài với inputRef nội bộ
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt làm mở dropdown
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
                      e.stopPropagation(); // Đóng lại nếu đang mở
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
            <div className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === selectedValue;
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelectOption(option)}
                      className={cn(
                        "px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between text-slate-700 hover:bg-slate-50",
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
