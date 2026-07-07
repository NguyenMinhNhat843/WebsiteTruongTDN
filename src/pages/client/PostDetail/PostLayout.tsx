import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { $api } from "../../../api/client"; // OpenAPI Client của bạn

const PostLayout = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Lấy ID bài viết hiện tại từ URL (nếu có)
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  // 1. Lấy chi tiết bài viết hiện tại để xác định danh mục (type)
  const { data: currentPostData } = $api.useQuery(
    "get",
    "/posts/{id}",
    {
      params: { path: { id: Number(id) } },
    },
    { enabled: !!id }, // Chỉ chạy khi có ID trên URL
  );

  const currentPostType = currentPostData?.type;

  // 2. Gọi API lấy bài viết liên quan dựa theo danh mục (type)
  const { data: relatedData, isPending } = $api.useQuery(
    "get",
    "/posts/related-posts",
    {
      params: {
        query: {
          type: currentPostType,
          limit: 5,
          page: 1,
          status: "PUBLISHED",
        },
      },
    },
  );

  // Cập nhật danh sách bài viết liên quan và loại bỏ bài viết hiện tại
  useEffect(() => {
    if (relatedData?.data) {
      const filtered = relatedData.data.filter((p: any) => p.id !== Number(id));
      setLatestPosts(filtered.slice(0, 5));
    }
  }, [relatedData, id]);

  // Hàm định dạng ngày chuẩn quốc tế hiển thị tại VN
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Điều hướng và cuộn mượt lên đầu trang
  const handlePostClick = (slug: string, postId: number) => {
    navigate(`/tin-tuc/${slug || postId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-8 md:py-12 antialiased selection:bg-blue-500 selection:text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:gap-10">
        {/* --- CỘT TRÁI (SIDEBAR - BÀI VIẾT LIÊN QUAN) --- */}
        <aside className="order-2 w-full shrink-0 lg:order-1 lg:w-[360px]">
          <div className="sticky top-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100/50">
            {/* Tiêu đề Sidebar - Tăng từ text-base lên text-lg */}
            <h3 className="mb-6 flex items-center text-lg font-bold text-slate-900">
              <span className="mr-2.5 h-5 w-1.5 rounded-full bg-blue-600"></span>
              Tin cùng chuyên mục
            </h3>

            <div className="flex flex-col gap-5">
              {isPending ? (
                // Skeleton loading đồng bộ kích thước mới
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-20 w-24 shrink-0 rounded-xl bg-slate-200"></div>
                    <div className="mt-1 grow space-y-2.5">
                      <div className="h-4 w-full rounded bg-slate-200"></div>
                      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))
              ) : latestPosts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-slate-400">
                  <FileText size={24} className="text-slate-300" />
                  <p>Chưa có bài viết liên quan nào khác.</p>
                </div>
              ) : (
                latestPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.slug, post.id)}
                    className="group flex gap-4 cursor-pointer transition-all duration-200"
                  >
                    {/* Ảnh bài viết nhỏ - Tăng kích thước từ w-20 h-16 thành w-24 h-20 để cân bằng font chữ mới */}
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm border border-slate-100">
                      <img
                        src={
                          post.coverImage ||
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=200&auto=format&fit=crop"
                        }
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Tiêu đề & Ngày đăng */}
                    <div className="flex flex-col justify-center min-w-0">
                      {/* Tăng từ text-xs lên text-sm (14px), line-height thoáng hơn (leading-snug) */}
                      <h4
                        className="text-sm font-semibold tracking-tight text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
                        title={post.title}
                      >
                        {post.title}
                      </h4>
                      {/* Tăng từ text-[10px] lên text-xs (12px) giúp người đọc không phải nheo mắt */}
                      <span className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar size={13} className="text-slate-400/80" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Nút Xem tất cả - Nâng cấp lên text-sm, padding thoải mái hơn */}
            <button
              onClick={() => navigate("/tin-tuc")}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50/30 py-3 text-sm font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600"
            >
              Xem tất cả bài viết <ArrowRight size={16} />
            </button>
          </div>
        </aside>

        {/* --- CỘT PHẢI (MAIN CONTENT) --- */}
        {/* Tăng độ bo góc rounded-2xl, tạo viền mịn màng shadow-md */}
        <main className="order-1 w-full grow rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-md shadow-slate-100/40 lg:order-2">
          <div className="min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostLayout;
