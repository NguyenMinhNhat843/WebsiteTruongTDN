import { useEffect, useState } from "react";
import { Loader2, Calendar, Eye, User } from "lucide-react";
import { $api } from "../../api/client"; // OpenAPI Client của bạn

const NewsList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 5;

  /**
   * Gọi API thật bằng OpenAPI React Query
   */
  const { data, isPending, isFetching } = $api.useQuery("get", "/posts", {
    params: {
      query: {
        page: page,
        limit: ITEMS_PER_PAGE,
        status: "PUBLISHED", // Chỉ lấy bài viết đã xuất bản
      },
    },
  });

  // Hợp nhất dữ liệu khi phân trang (Xem thêm)
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setPosts(data.data);
      } else {
        setPosts((prev) => [...prev, ...data.data]);
      }

      if (
        data.data.length < ITEMS_PER_PAGE ||
        posts.length + data.data.length >= (data.meta?.total || 0)
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Hàm helper format ngày tháng thân thiện
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm chuyển đổi nhãn Danh mục (Type) sang Tiếng Việt
  const getCategoryLabel = (type: string) => {
    const categories: Record<string, string> = {
      NEWS: "Tin tức",
      ADMISSION: "Tuyển sinh",
      EVENT: "Sự kiện",
      INTERNAL: "Tin nội bộ",
      ACHIEVEMENT: "Thành tích",
      MENU: "Thực đơn",
      RECRUITMENT: "Tuyển dụng",
    };
    return categories[type] || "Tin tức";
  };

  const isInitialLoading = isPending && page === 1;
  const isLoadingMore = isFetching && page > 1;

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center uppercase tracking-wider">
          Tin tức & Sự kiện
        </h1>

        {/* Grid Layout: 5 cột hiển thị bài viết */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isInitialLoading
            ? [...Array(ITEMS_PER_PAGE)].map((_, n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl h-80 animate-pulse border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="bg-slate-200 h-40"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-5 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            : posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                >
                  {/* Khối Trên: Hình ảnh & Nội dung tóm tắt */}
                  <div>
                    {/* Phần Ảnh bìa */}
                    <div className="relative h-40 bg-slate-100 overflow-hidden group">
                      <img
                        src={
                          post.coverImage ||
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop"
                        } // Ảnh fallback khi bài viết không có coverImage
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {getCategoryLabel(post.type)}
                      </span>
                    </div>

                    {/* Phần Thông tin chữ */}
                    <div className="p-4">
                      {/* Meta: Ngày đăng & Lượt xem */}
                      <div className="flex items-center gap-3 text-slate-400 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={13} />
                          {post.viewCount}
                        </span>
                      </div>

                      {/* Tiêu đề bài viết */}
                      <h3
                        className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors mb-2"
                        title={post.title}
                      >
                        <a href={`/tin-tuc/${post.slug || post.id}`}>
                          {post.title}
                        </a>
                      </h3>

                      {/* Đoạn mô tả tóm tắt ngắn (summary) */}
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {post.summary ||
                          "Bấm để xem chi tiết nội dung bài viết..."}
                      </p>
                    </div>
                  </div>

                  {/* Khối Dưới: Tác giả (Ghim chặt ở đáy card) */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                      <User size={12} />
                    </div>
                    <span className="text-slate-600 text-xs font-medium truncate">
                      {post.author?.staff?.fullName || "Ban Quản Trị"}
                    </span>
                  </div>
                </article>
              ))}
        </div>

        {/* Nút Tải Thêm Dữ Liệu */}
        {hasMore && posts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all disabled:bg-slate-300 flex items-center gap-2 cursor-pointer"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Đang tải...
                </>
              ) : (
                "Xem thêm tin tức"
              )}
            </button>
          </div>
        )}

        {/* Trạng thái trống */}
        {!isInitialLoading && posts.length === 0 && (
          <div className="text-center py-20 text-slate-400 text-sm">
            Không tìm thấy bài viết nào.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
