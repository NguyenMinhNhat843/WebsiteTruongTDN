interface ActionButtonProps {
  label: string;
  primary?: boolean;
  color: string; // Mong đợi mã hex: ví dụ "#3b82f6"
}

export default function ActionButton({
  label,
  primary,
  color,
}: ActionButtonProps) {
  const borderColor = `${color}44`;
  const bgDefault = primary ? `${color}18` : "transparent";
  const bgHover = `${color}28`;
  const textColorDefault = primary ? color : "#64748b";

  return (
    <button
      style={{
        borderColor: borderColor,
        backgroundColor: bgDefault,
        color: textColorDefault,
      }}
      className={`
        ${primary ? "flex-1" : "flex-none"}
        px-4 py-2
        
        text-[13px] font-semibold
        
        rounded-[10px] border border-solid
        cursor-pointer transition-all duration-150
      `}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = bgHover;
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgDefault;
        e.currentTarget.style.color = textColorDefault;
      }}
    >
      {label}
    </button>
  );
}
