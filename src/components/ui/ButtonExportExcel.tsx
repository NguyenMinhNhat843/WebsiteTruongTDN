import { forwardRef } from "react";
import ButtonAction, { type ButtonActionProps } from "./ButtonAction";
import clsx from "clsx";
import { FileDown } from "lucide-react";

export interface ButtonExportExcelProps extends ButtonActionProps {
  label?: string;
  tooltip?: string;
}

const ButtonExportExcel = forwardRef<HTMLButtonElement, ButtonExportExcelProps>(
  ({ className, children, label, tooltip, icon, ...props }, ref) => {
    const content = children || label;
    const finalIcon = icon || <FileDown />;

    return (
      <ButtonAction
        ref={ref}
        icon={finalIcon}
        title={tooltip || label || "Export Excel"}
        aria-label={tooltip || label || "Export Excel"}
        className={clsx(
          // xanh dương nhẹ (khác Import)
          "bg-blue-50 text-blue-700 border-blue-200",
          "hover:bg-blue-100",
          "focus:ring-blue-300",
          "active:scale-[0.97]",
          className,
        )}
        {...props}
      >
        {content}
      </ButtonAction>
    );
  },
);

ButtonExportExcel.displayName = "ButtonExportExcel";

export default ButtonExportExcel;
