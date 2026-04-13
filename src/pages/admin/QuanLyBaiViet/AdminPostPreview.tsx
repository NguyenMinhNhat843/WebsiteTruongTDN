import { useState } from "react";
import PostDetailView from "./components/PostDetail";
import type { Post } from "../../../features/posts/types/Post.types";

const AdminPostPreview = () => {
  const [previewData] = useState<Post | null>(() => {
    // Logic này chỉ chạy DUY NHẤT một lần khi component mount
    const saved = localStorage.getItem("preview_post_data");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Preview Bar */}
      <div className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          {/* Bên trái: Trạng thái */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-sm font-medium tracking-wide uppercase">
              Chế độ xem trước
            </span>
          </div>

          {/* Bên phải: Các hành động */}
          <div className="flex items-center gap-4">
            <p className="hidden md:block text-xs text-slate-400 italic">
              Nội dung hiển thị theo giao diện người dùng thực tế
            </p>
            <button
              onClick={() => window.close()}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded transition font-bold"
            >
              ĐÓNG PREVIEW
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <main className="max-w-4xl mx-auto py-10 px-4">
        <PostDetailView post={previewData} />
      </main>
    </div>
  );
};

export default AdminPostPreview;
