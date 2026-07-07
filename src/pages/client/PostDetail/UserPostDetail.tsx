import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, User, FolderOpen } from "lucide-react";
import { $api } from "../../../api/client"; // OpenAPI Client của bạn

const UserPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Kiểm tra xem slug trên URL là ID (số) hay Slug (chuỗi chữ)
  const isId = slug && !isNaN(Number(slug));

  /**
   * Trường hợp 1: Nếu URL là ID bài viết (ví dụ: /posts/12)
   */
  const { data: postById, isPending: isPendingId } = $api.useQuery(
    "get",
    "/posts/{id}",
    {
      params: { path: { id: Number(slug) } },
    },
    { enabled: !!slug && Boolean(isId) },
  );

  /**
   * Trường hợp 2: Nếu URL là Slug bài viết (ví dụ: /posts/tin-tuc-su-kien)
   */
  const { data: postBySlugData, isPending: isPendingSlug } = $api.useQuery(
    "get",
    "/posts",
    {
      params: {
        query: {
          slug: slug,
          limit: 1,
        },
      },
    },
    { enabled: !!slug && !isId },
  );

  // Lấy ra bài viết tương ứng dựa trên kết quả của 1 trong 2 API trên
  const post = isId ? postById : postBySlugData?.data?.[0];
  const loading = isId ? isPendingId : isPendingSlug;

  // Hàm helper định dạng ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm chuyển đổi tên danh mục sang Tiếng Việt
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

  // 1. Trạng thái Đang tải dữ liệu (Skeleton)
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
        <div className="h-4 w-24 bg-slate-200 rounded mb-6"></div>
        <div className="h-8 w-3/4 bg-slate-200 rounded mb-4"></div>
        <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
        <div className="h-64 w-full bg-slate-200 rounded-2xl mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 2. Trạng thái Không tìm thấy bài viết
  if (!post) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy bài viết yêu cầu
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Bài viết có thể đã bị gỡ bỏ hoặc đường dẫn không chính xác.
        </p>
        <button
          onClick={() => navigate("/tin-tuc")}
          className="mt-6 text-sm text-blue-600 font-semibold hover:underline inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Quay về danh sách tin tức
        </button>
      </div>
    );
  }

  // 3. Giao diện chi tiết bài viết nội bộ công khai công phu
  return (
    <article className="">
      {/* Chuyên mục */}
      <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
        <FolderOpen size={14} />
        {getCategoryLabel(post.type)}
      </div>

      {/* Tiêu đề chính của bài viết */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Thanh công cụ thông tin: Tác giả, Ngày đăng, Lượt xem */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs pb-6 border-b border-slate-100 mb-6">
        <span className="flex items-center gap-1">
          <User size={14} className="text-slate-400" />
          Bài viết bởi:{" "}
          <strong className="text-slate-700 font-medium">
            {post.author?.staff?.fullName || "Ban Quản Trị"}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} className="text-slate-400" />
          {formatDate(post.publishedAt || post.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} className="text-slate-400" />
          {post.viewCount} lượt xem
        </span>
      </div>

      {/* Ảnh bìa bài viết nếu có */}
      {post.coverImage && (
        <div className="w-full max-h-[400px] rounded-2xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 shadow-sm">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Đoạn tóm tắt (Summary) - Hiển thị dạng chữ in nghiêng nổi bật */}
      {post.summary && (
        <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500 text-slate-600 text-sm italic leading-relaxed mb-6">
          {post.summary}
        </div>
      )}

      {/* Nội dung chi tiết bài viết (Hỗ trợ render HTML từ Editor/RichText) */}
      <div
        className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4 
          prose-headings:font-bold prose-headings:text-slate-800
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default UserPostDetail;
