import { CATEGORY_META } from "../constants/postList.constant";
import type { CategoryValue } from "../types/Post.types";

function CategoryBadge({ category }: { category?: CategoryValue }) {
  const m = category
    ? CATEGORY_META[category]
    : {
        label: "Không xác định",
        color: "text-gray-500",
        bg: "bg-gray-100",
        icon: "❓",
      };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${m.bg} ${m.color}`}
    >
      <span>{m.icon}</span>
      {m.label}
    </span>
  );
}

export default CategoryBadge;
