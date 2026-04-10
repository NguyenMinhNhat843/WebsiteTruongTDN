import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import type { FunctionComponent } from "react";

interface ButtonBackProps {
  onClick: () => void;
  className?: string;
}

const ButtonBack: FunctionComponent<ButtonBackProps> = ({
  onClick,
  className,
}) => {
  return (
    <button
      className={clsx(
        "group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-cyan-600 hover:border-cyan-200 hover:shadow-md active:scale-95",
        className, // Class truyền từ ngoài vào sẽ ghi đè class mặc định nếu trùng lặp
      )}
      onClick={onClick}
    >
      <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span>Quay lại</span>
    </button>
  );
};

export default ButtonBack;
