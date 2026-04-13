import CategoryBadge from "../../../features/posts/components/CategoryBadge";
import StatusBadge from "../../../features/posts/components/StatusBadge";
import AudiencePill from "../../../features/posts/components/AudiencePill";
import {
  PostListProvider,
  usePostListContext,
} from "../../../features/posts/hooks/usePostList";
import PostListHeader from "../../../features/posts/components/PostListSections/PostListHeader";
import PostListFilterPanel from "../../../features/posts/components/PostListSections/PostListFilterPanel";
import Pagination from "../../../components/ui/Pagination";
import type { Post } from "../../../features/posts/types/Post.types";

export default function PostList() {
  return (
    <PostListProvider>
      <Inner />
    </PostListProvider>
  );
}

function Inner() {
  const {
    resetFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    paginated,
    total,
  } = usePostListContext();

  const handlePreview = (post: Post) => {
    // 1. Lưu dữ liệu bài viết vào localStorage
    // Chúng ta chuyển object thành string để lưu được vào storage
    localStorage.setItem("preview_post_data", JSON.stringify(post));

    // 2. Mở một tab mới tới route preview
    // Giả sử bạn đã tạo một route tên là /preview-post
    window.open("/tin-tuc/xem-truoc", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PostListHeader />

      <div className="mx-auto max-w-7xl px-8 py-6 space-y-5">
        <PostListFilterPanel />

        {/* ── Table ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-semibold text-slate-800">
                {paginated.length}
              </span>{" "}
              / {paginated.length} bài viết
            </p>
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 p-1">
              <span className="px-2 text-xs font-medium text-slate-600">
                Sắp xếp:
              </span>
              <select className="border-0 bg-transparent text-xs text-slate-600 outline-none pr-1">
                <option>Mới nhất</option>
                <option>Cũ nhất</option>
                <option>Nhiều lượt xem</option>
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-5xl mb-3">📭</span>
              <p className="text-base font-medium">
                Không tìm thấy bài viết nào
              </p>
              <p className="text-sm mt-1">
                Thử thay đổi bộ lọc để xem thêm kết quả
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-8">
                      #
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      Danh mục
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      Đối tượng
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((post, idx) => (
                    <tr
                      key={post.id}
                      className="group transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4 text-slate-300 text-xs font-mono">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors cursor-pointer">
                          {post.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {post.author}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CategoryBadge category={post.category} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AudiencePill audience={post.audience} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs font-medium tabular-nums">
                        {post?.views?.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Xem"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            onClick={() => handlePreview(post)}
                          >
                            👁
                          </button>
                          <button
                            title="Chỉnh sửa"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-100 hover:text-blue-700 transition"
                          >
                            ✏️
                          </button>
                          {post.status === "cho-duyet" && (
                            <button
                              title="Duyệt"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700 transition"
                            >
                              ✅
                            </button>
                          )}
                          <button
                            title="Xoá"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 transition"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
