import type { Status } from "../types/Post.types";

function StatusBadge({ status }: { status?: Status }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
        Không xác định
      </span>
    );
  }
  if (status === "da-duyet") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Đã duyệt
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
      Chờ duyệt
    </span>
  );
}

export default StatusBadge;
