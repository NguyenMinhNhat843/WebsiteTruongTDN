import { forwardRef } from "react";
import ButtonAction, { type ButtonActionProps } from "./ButtonAction";
import clsx from "clsx";
import { FileUp } from "lucide-react";

export interface ButtonImportProps extends ButtonActionProps {
  label?: string;
  tooltip?: string;
}

const ButtonImportExcel = forwardRef<HTMLButtonElement, ButtonImportProps>(
  ({ className, children, label, tooltip, icon, ...props }, ref) => {
    const content = children || label;

    // Nếu không có content thì chỉ hiện icon
    const finalIcon = icon || <FileUp size={24} />;

    return (
      <ButtonAction
        ref={ref}
        icon={!content ? finalIcon : finalIcon}
        title={tooltip || label || "Import"}
        aria-label={tooltip || label || "Import"}
        className={clsx(
          "bg-green-100 text-green-700 border-green-100 font-bold",
          "hover:bg-green-200",
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

ButtonImportExcel.displayName = "ButtonImport";

export default ButtonImportExcel;
