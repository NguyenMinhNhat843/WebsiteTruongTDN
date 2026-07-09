import { PostListProvider, usePostListContext } from "./PostListProvider";
import PageShell from "../../../../components/ui/PageShell";
import ButtonAction from "../../../../components/ui/ButtonAction";
import {
  BookOpen,
  Eye,
  Calendar,
  User,
  ImageIcon,
  Pen,
  Trash2,
} from "lucide-react"; // 1. Thêm Trash2 icon ở đây
import { useNavigate } from "react-router-dom";
import { getCategoryBadge, getStatusBadge } from "./helpers";
import { $api } from "../../../../api/client";
import { toast } from "sonner";

const PostList = () => {
  return (
    <PostListProvider>
      <Inner />
    </PostListProvider>
  );
};

const Inner = () => {
  // Giả định context của bạn có hàm refetch hoặc tương đương (ví dụ: fetchPosts, mutate...) để tải lại danh sách.
  // Bạn hãy kiểm tra lại file PostListProvider xem tên hàm chính xác là gì nhé (thường là refetchPosts hoặc refresh).
  const { posts, total, isLoadingPosts, refetchPosts } = usePostListContext();
  const navigate = useNavigate();

  // Khai báo hook mutation xóa từ openapi-react-query của bạn
  const { mutate: deletePost } = $api.useMutation("delete", "/posts/{id}", {
    onSuccess: () => {
      toast.success("Xóa bài viết thành công!");
      // Gọi hàm refetch từ context để cập nhật lại danh sách hiển thị phía client
      if (refetchPosts) refetchPosts();
    },
    onError: () => {
      toast.error("Xóa bài viết thất bại! Vui lòng thử lại sau.");
    },
  });

  // Hàm xử lý khi click nút xóa
  const handleDelete = (id: number, title: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa bài viết "${title}" không? Hành động này không thể hoàn tác.`,
      )
    ) {
      deletePost({
        params: {
          path: { id }, // Truyền id vào url route /posts/{id} theo chuẩn openapi-ts
        },
      });
    }
  };

  return (
    <PageShell
      title="Quản lý bài viết"
      sub={`Tổng ${total} bài viết`}
      icon={BookOpen}
    >
      <div className="relative min-h-75">
        {/* Hiệu ứng Loading bao phủ khi đang tải dữ liệu */}
        {isLoadingPosts && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10 gap-2 backdrop-blur-sm rounded-lg">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500 text-sm font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        )}

        {/* Danh sách dạng Grid Card */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden justify-between"
              >
                {/* Khối nội dung phía trên bao gồm cả Ảnh bìa */}
                <div>
                  {/* Khu vực ảnh bìa với tỉ lệ cố định 16:9 */}
                  <div className="relative w-full aspect-video bg-gray-100 overflow-hidden border-b border-gray-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // Hiển thị ảnh thay thế (Placeholder) khi không có coverImage
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        <span className="text-[10px]">Không có ảnh bìa</span>
                      </div>
                    )}
                  </div>

                  {/* Phần chứa Tag, Trạng thái & Tiêu đề */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {getStatusBadge(post.status)}
                      {getCategoryBadge(post.type)}
                    </div>

                    {/* Tiêu đề bài viết */}
                    <h3
                      className="font-semibold text-gray-900 line-clamp-2 mb-1 text-base hover:text-blue-600 transition-colors duration-150 min-h-[3rem]"
                      title={post.title}
                    >
                      {post.title}
                    </h3>
                  </div>
                </div>

                {/* Phần dưới: Metadata & Thao tác */}
                <div className="p-4 pt-0">
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {/* Tác giả & Ngày tạo */}
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        <span className="truncate">
                          Tác giả:{" "}
                          <strong className="text-gray-700 font-medium">
                            {post.author?.staff?.fullName || "Ẩn danh"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          Ngày tạo:{" "}
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    {/* Lượt xem & Nút hành động */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {post.viewCount.toLocaleString()} lượt xem
                      </span>
                      <div className="flex gap-1.5">
                        <ButtonAction
                          title="Xem chi tiết"
                          icon={<Eye size={15} />}
                          variant="outline"
                        />
                        <ButtonAction
                          title="Chỉnh sửa"
                          icon={<Pen size={15} />}
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/truyen-thong-bao-chi/${post.id}/edit`,
                            )
                          }
                        />
                        {/* Nút Xóa mới được thêm vào */}
                        <ButtonAction
                          title="Xóa bài viết"
                          icon={<Trash2 size={15} />}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          variant="outline"
                          onClick={() => handleDelete(post.id!, post.title)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Trạng thái trống */
          !isLoadingPosts && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl text-gray-500">
              Không tìm thấy bài viết nào.
            </div>
          )
        )}
      </div>
    </PageShell>
  );
};

export default PostList;
