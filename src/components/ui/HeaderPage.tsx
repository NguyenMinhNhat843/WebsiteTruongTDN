import type { ReactNode } from "react";

export interface HeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  className?: string;
  renderLeft?: ReactNode;
}

const HeaderPage: React.FC<HeaderProps> = ({
  title,
  sub,
  icon,
  className = "", // Tăng margin-bottom một chút cho thoáng
  renderLeft,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        {renderLeft}

        {/* Icon với hiệu ứng mềm mại: Nền nhẹ hoặc đổ bóng nhẹ */}
        {icon && (
          <div className="shrink-0 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-sm">
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
    </div>
  );
};

export default HeaderPage;
