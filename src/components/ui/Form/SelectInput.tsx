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
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Cờ hiệu để chặn việc tự động mở lại khi vừa click chọn xong
    const isSelectingRef = useRef(false);

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
    const searchInputRef = useRef<HTMLInputElement>(null);
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

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelectOption = (option: SelectOptionType) => {
      isSelectingRef.current = true; // Bật cờ chặn tự động mở
      setLocalValue(option.value);
      setIsOpen(false);
      setSearchTerm("");

      // Tập trung lại vào ô input để người dùng có thể Tab tiếp tục sang ô khác
      searchInputRef.current?.focus();

      if (onChange) {
        onChange({
          target: {
            name: name,
            value: option.value,
          },
        });
      }

      // Tắt cờ sau khi luồng focus đã ổn định
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "Enter" ||
          e.key === " "
        ) {
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
          } else if (filteredOptions.length > 0 && focusedIndex === -1) {
            handleSelectOption(filteredOptions[0]);
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          break;

        case "Tab":
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
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        <div className="relative">
          <input
            type="hidden"
            name={name}
            value={selectedValue || ""}
            ref={inputRef}
            {...props}
          />

          <div
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                searchInputRef.current?.focus();
              }
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-lg transition-all duration-200 select-none border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
              isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "",
              error
                ? "border-red-500 ring-2 ring-red-500/10 hover:border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10"
                : "",
            )}
          >
            <div className="flex items-center gap-2 flex-1 mr-2 relative min-w-0 min-h-[20px]">
              {isOpen && <Search className="w-4 h-4 text-slate-400 shrink-0" />}

              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  isOpen
                    ? selectedOption
                      ? selectedOption.label
                      : placeholder
                    : ""
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  // Chỉ tự động mở nếu không phải hành động vừa click chọn xong
                  if (!isSelectingRef.current) {
                    setIsOpen(true);
                  }
                }}
                className={cn(
                  "w-full bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm",
                  !isOpen ? "absolute inset-0 opacity-0 cursor-pointer" : "",
                )}
              />

              {!isOpen && (
                <span
                  className={cn(
                    "truncate text-slate-900 pointer-events-none pr-4",
                    !selectedOption && "text-slate-400",
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              )}
            </div>

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

        {isOpen && (
          <div
            className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 flex flex-col overflow-hidden"
            style={{ top: "100%" }}
          >
            <div
              ref={optionsContainerRef}
              className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === selectedValue;
                  const isFocused = index === focusedIndex;

                  return (
                    <div
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn nổi bọt sự kiện lên thẻ cha onClick
                        handleSelectOption(option);
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
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

        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

SelectSearchInput.displayName = "SelectSearchInput";

export default SelectSearchInput;
