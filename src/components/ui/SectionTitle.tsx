import React from "react";
import clsx from "clsx";

interface SectionTitleProps {
  children?: React.ReactNode;
  /** * Có thể truyền Tailwind class (border-amber-500)
   * hoặc mã Hex (#f59e0b)
   */
  color?: string;
  className?: string;
  label?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  color = "border-amber-500",
  className,
  label,
}) => {
  // Kiểm tra xem color truyền vào là mã Hex hay Tailwind class
  const isHex = color.startsWith("#");
  const content = label || children;

  return (
    <h3
      style={isHex ? { borderLeftColor: color } : {}}
      className={clsx(
        "text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 pl-3",
        !isHex && color, // Nếu không phải Hex thì áp dụng như Tailwind class
        className,
      )}
    >
      {content}
    </h3>
  );
};

export default SectionTitle;
