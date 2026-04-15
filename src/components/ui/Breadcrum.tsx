import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav
      className={clsx(
        "flex items-center gap-2 text-[12px] text-slate-400",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.link && !isLast ? (
              <Link
                to={item.link}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-slate-700 font-semibold" : ""}>
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight size={12} />}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
