import { Link } from "react-router-dom";
import { usePostListContext } from "../../hooks/usePostList";

const PostListHeader = () => {
  const { stats } = usePostListContext();
  return (
    <div className="border-b border-slate-200 bg-white px-8 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Quản trị</span>
              <span>›</span>
              <span className="text-blue-600 font-medium">Bài viết</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Danh sách bài viết
            </h1>
          </div>
          <Link to={"/admin/truyen-thong-bao-chi/tao-bai-viet"}>
            <button className="cursor-pointer flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-95">
              <span className="text-base">+</span>
              Tạo bài viết
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-5 flex gap-6">
          {[
            {
              label: "Tổng bài viết",
              value: stats.total,
              color: "text-slate-700",
              dot: "bg-slate-400",
            },
            {
              label: "Đã duyệt",
              value: stats.approved,
              color: "text-emerald-700",
              dot: "bg-emerald-500",
            },
            {
              label: "Chờ duyệt",
              value: stats.pending,
              color: "text-amber-700",
              dot: "bg-amber-500",
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              <span className="text-sm text-slate-500">{s.label}:</span>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostListHeader;
