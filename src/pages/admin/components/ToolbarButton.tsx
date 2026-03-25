import type { ToolbarButtonProps } from "../types/Post.types";

function ToolbarButton({ icon, title, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors text-sm font-bold"
    >
      {icon}
    </button>
  );
}

export default ToolbarButton;
