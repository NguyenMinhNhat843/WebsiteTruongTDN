import clsx from "clsx";
import React, { type FunctionComponent, type ReactNode } from "react";

interface PageShellProps {
  children: React.ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  /** * Nhận vào định nghĩa Component icon (ví dụ: BookOpen)
   * chứ không phải là instance đã render <BookOpen />
   */
  icon?: React.ElementType;
  className?: string;
  renderRight?: ReactNode;
  classNameIcon?: string;
}

const PageShell: FunctionComponent<PageShellProps> = ({
  children,
  title,
  sub,
  icon: Icon, // Rename thành Icon (viết hoa) để render như một Component
  className,
  renderRight,
  classNameIcon,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {/* PHẦN 1: HEADER - Sticky & Backdrop blur */}
      <div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6
        p-6 py-4 border-b border-slate-200"
      >
        {/* Nhóm bên trái: Icon + Text */}
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={clsx(
                "shrink-0 p-3 bg-blue-600 rounded-2xl shadow-lg text-white flex items-center justify-center",
                classNameIcon,
              )}
            >
              {/* Tự động áp size 26 cho mọi icon truyền vào */}
              <Icon size={26} strokeWidth={2.5} aria-hidden="true" />
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
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

      {/* --- PHẦN 2: CONTENT --- */}
      <main className="w-full min-h-screen bg-slate-50">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default PageShell;
