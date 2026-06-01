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
  isLoading?: boolean;
}

const PageShell: FunctionComponent<PageShellProps> = ({
  children,
  title,
  sub,
  icon: Icon, // Rename thành Icon (viết hoa) để render như một Component
  className,
  renderRight,
  classNameIcon,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx(
          "w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6",
          className,
        )}
      >
        <div className="relative flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="relative w-12 h-12">
            <div className="w-full h-full border-4 border-slate-200 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin [animation-duration:0.8s]" />
          </div>

          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-slate-700 tracking-wide">
              Đang tải dữ liệu...
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        </div>
      </div>
    );
  }
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
