import type { TagProps } from "../types/Post.types";

function Tag({ label, onRemove }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-500 transition-colors ml-1 text-base leading-none"
      >
        ×
      </button>
    </span>
  );
}

export default Tag;
