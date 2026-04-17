import clsx from "clsx";
import { type FunctionComponent, type ReactNode } from "react";

interface PageShellProps {
  children: React.ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  className?: string;
  renderRight?: ReactNode; // Thay cho children cũ để làm nút bên phải
  classNameIcon?: string;
}

const PageShell: FunctionComponent<PageShellProps> = ({
  children,
  title,
  sub,
  icon,
  className,
  renderRight,
  classNameIcon,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {/* PHẦN 1: HEADER - Đã thêm sticky và nền */}
      <div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6
        px-4 md:px-8 py-4 border-b border-slate-200
      "
      >
        {/* Nhóm bên trái: Icon + Text */}
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className={clsx(
                "shrink-0 p-3 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl shadow-lg text-white",
                // "shrink-0 p-3 bg-blue-600 rounded-2xl shadow-lg text-white",
                classNameIcon,
              )}
            >
              {icon}
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {sub && (
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {sub}
              </p>
            )}
          </div>
        </div>

        {/* Nhóm bên phải: Nút bấm action */}
        {renderRight && (
          <div className="flex items-center gap-3 shrink-0">{renderRight}</div>
        )}
      </div>

      {/* --- PHẦN 2: CONTENT (Nằm riêng biệt hoàn toàn bên dưới) --- */}
      <div className="w-full min-h-screen bg-slate-50">
        <div className="px-4 md:px-8 pb-4 md:pb-8">{children}</div>
      </div>
    </div>
  );
};

export default PageShell;
