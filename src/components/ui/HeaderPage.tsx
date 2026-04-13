import clsx from "clsx";
import type { ReactNode } from "react";

export interface HeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  className?: string;
  renderLeft?: ReactNode;
  classNameIcon?: string; // Thêm className cho icon nếu cần tùy chỉnh thêm từ bên ngoài
}

const HeaderPage: React.FC<HeaderProps> = ({
  title,
  sub,
  icon,
  className = "", // Tăng margin-bottom một chút cho thoáng
  renderLeft,
  classNameIcon,
}) => {
  return (
    <div className={clsx("flex items-center gap-4 mb-6", className)}>
      {renderLeft}

      {/* Icon với hiệu ứng mềm mại: Nền nhẹ hoặc đổ bóng nhẹ */}
      {icon && (
        <div
          className={clsx(
            "shrink-0 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-sm",
            classNameIcon,
          )}
        >
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-slate-900">
          {title}
        </h1>

        {sub && (
          <div className="text-slate-500 text-sm font-medium leading-relaxed">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPage;
