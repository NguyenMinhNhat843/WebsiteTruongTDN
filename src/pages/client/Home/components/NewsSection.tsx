import React from "react";
import { ExternalLink, Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { $api } from "../../../../api/client";

const NewsSection: React.FC = () => {
  // Lấy dữ liệu bài viết thật từ API của hệ thống
  const { data: news, isLoading: newsLoading } = $api.useQuery(
    "get",
    "/posts",
    {
      params: {
        query: {
          page: 1,
          limit: 10,
        },
      },
    },
  );

  // Trích xuất mảng dữ liệu bài viết an toàn từ cấu trúc API
  const posts = news?.data || [];

  // Trạng thái Skeleton Loading khi đang tải dữ liệu để tránh Layout Shift (CLS)
  if (newsLoading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-8 bg-slate-200 rounded-md w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-[500px] bg-slate-200 rounded-2xl animate-pulse" />
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[240px] bg-slate-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Nếu không có bài viết nào, ẩn section an toàn
  if (posts.length === 0) return null;

  // Tách bài viết theo bố cục
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, 5); // 4 bài viết lưới bên phải
  const listPosts = posts.slice(5, 10); // Các bài viết danh sách

  // Hàm helper định dạng ngày tháng hiển thị thân thiện
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 bg-slate-50" id="tin-tuc-su-kien">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Khối Tiêu đề Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-blue-700 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Tin tức & Sự kiện
            </h2>
          </div>
          <Link to="/tin-tuc">
            <button className="text-blue-700 hover:text-blue-800 font-bold text-sm flex items-center gap-1.5 transition-colors group cursor-pointer bg-white px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/60">
              Xem tất cả
              <ExternalLink
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </Link>
        </div>

        {/* Lưới chính: Thêm `items-stretch` để ép cột trái và cột phải bằng chiều cao nhau */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* CỘT TRÁI (Chiếm 5/12 cột): Ép h-full và flex-col để tự giãn */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            {featuredPost && (
              <Link
                to={`/tin-tuc/${featuredPost.slug}`}
                className="group block bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(30,41,59,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col flex-grow"
              >
                {/* Ảnh cover bài tiêu điểm */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative shrink-0">
                  <img
                    src={
                      featuredPost.coverImage ||
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"
                    }
                    alt={featuredPost.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-blue-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {featuredPost.type}
                  </span>
                </div>

                {/* Nội dung bài tiêu điểm - Dùng flex-grow để đẩy chiều cao chiếm trọn phần trống */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta thông tin */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        <span>
                          {formatDate(
                            featuredPost.publishedAt || featuredPost.createdAt,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={13} />
                        <span>{featuredPost.viewCount} lượt xem</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-3">
                      {featuredPost.title}
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {featuredPost.summary ||
                        featuredPost.seoDescription ||
                        "Nhấn để xem chi tiết thông tin đầy đủ về bài viết..."}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Danh sách bài viết phụ chạy dọc phía dưới */}
            {listPosts.length > 0 && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)] shrink-0">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Tin tức liên quan khác
                </h4>
                <div className="divide-y divide-slate-100">
                  {listPosts.map((post) => (
                    <div key={post.id} className="py-2.5 first:pt-0 last:pb-0">
                      <Link
                        to={`/tin-tuc/${post.slug}`}
                        className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors line-clamp-1 block leading-relaxed"
                      >
                        • {post.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI (Chiếm 7/12 cột): Lưới ô cờ 4 bài viết vừa */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                to={`/tin-tuc/${post.slug}`}
                className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(30,41,59,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Ảnh nhỏ của thẻ */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative shrink-0">
                  <img
                    src={
                      post.coverImage ||
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=60"
                    }
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {post.type}
                  </span>
                </div>

                {/* Nội dung chi tiết thẻ phụ */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-2">
                      <Calendar size={12} />
                      <span>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 pt-2 border-t border-slate-50">
                    {post.summary || "Nhấn xem chi tiết..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
