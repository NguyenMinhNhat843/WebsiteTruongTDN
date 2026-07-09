import { useState } from "react";
import { useLocation } from "react-router-dom"; // Thêm hook này để kiểm tra URL
import { Calendar, Eye, User, ChevronLeft, ChevronRight } from "lucide-react";
import { $api } from "../../api/client"; // OpenAPI Client của bạn

const NewsList = () => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Lấy thông tin đường dẫn hiện tại (ví dụ: "/tuyen-dung" hoặc "/tin-tuc")
  const location = useLocation();
  const isRecruitmentPage = location.pathname.includes("tuyen-dung");

  /**
   * Gọi API bằng OpenAPI React Query
   */
  const { data, isPending, isFetching } = $api.useQuery("get", "/posts", {
    params: {
      query: {
        page: page,
        limit: ITEMS_PER_PAGE,
        status: "PUBLISHED",
        type: isRecruitmentPage ? "RECRUITMENT" : undefined,
      },
    },
  });

  const posts = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Hàm chuyển trang an toàn
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Tạo mảng số trang để map
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            page === i
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-slate-600 hover:bg-slate-200 bg-white border border-slate-200"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Tiêu đề tự động thay đổi linh hoạt dựa theo URL trang */}
        <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center uppercase tracking-wider">
          {isRecruitmentPage ? "Thông Tin Tuyển Dụng" : "Tin tức & Sự kiện"}
        </h1>

        {/* Khối bọc danh sách có hiệu ứng mờ nhẹ khi đang load dữ liệu giữa các trang */}
        <div
          className={`relative transition-opacity duration-200 ${isFetching && page > 1 ? "opacity-60" : "opacity-100"}`}
        >
          {/* Grid Layout: Sửa thành tối đa 4 cột trên màn hình lớn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isPending
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
                          }
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
                          className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors mb-2 min-h-[2.5rem]"
                          title={post.title}
                        >
                          {/* Sửa đường dẫn linh hoạt dựa theo loại bài viết */}
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
        </div>

        {/* Thanh Phân Trang Số (Pagination) */}
        {!isPending && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Trạng thái trống */}
        {!isPending && posts.length === 0 && (
          <div className="text-center py-20 text-slate-400 text-sm bg-white rounded-xl border border-slate-200 shadow-sm">
            Không tìm thấy bài tuyển dụng nào.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
