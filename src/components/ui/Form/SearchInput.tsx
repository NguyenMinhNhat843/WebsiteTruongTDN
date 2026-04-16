import { Search, X } from "lucide-react";
import { useRef, type FunctionComponent } from "react";
import Input from "./Input";
import clsx from "clsx";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
}

const SearchInput: FunctionComponent<SearchInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "Tìm kiếm...",
  className = "",
  containerClassName = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    // Focus lại vào input sau khi xóa để trải nghiệm mượt hơn
    inputRef.current?.focus();
  };

  return (
    <div className={`relative group ${containerClassName}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={Search}
        label={label}
        className={clsx(
          // Thêm padding bên phải nếu có text để không bị đè lên dấu X
          // value ? "pr-10" : "pr-4",
          className,
        )}
      />

      {/* Nút Xóa (Clear Button) */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all animate-in fade-in zoom-in duration-200"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
