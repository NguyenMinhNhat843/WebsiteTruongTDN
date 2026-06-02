import { PostListProvider, usePostListContext } from "./PostListProvider";
import PageShell from "../../../../components/ui/PageShell";
import ButtonAction from "../../../../components/ui/ButtonAction";
import {
  BookOpen,
  Eye,
  PlusIcon,
  Calendar,
  User,
  ImageIcon,
  Pen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryBadge, getStatusBadge } from "./helpers";

const PostList = () => {
  return (
    <PostListProvider>
      <Inner />
    </PostListProvider>
  );
};

const Inner = () => {
  const { posts, total, isLoadingPosts } = usePostListContext();
  const navigate = useNavigate();

  return (
    <PageShell
      title="Quản lý bài viết"
      sub={`Tổng ${total} bài viết`}
      icon={BookOpen}
      renderRight={
        <ButtonAction
          label="Tạo bài viết mới"
          icon={<PlusIcon className="w-4 h-4" />}
        />
      }
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
                            {post.author?.fullName || "Ẩn danh"}
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
                      <div className="flex gap-2">
                        <ButtonAction
                          title="Xem chi tiết"
                          icon={<Eye size={16} />}
                          variant="outline"
                        />
                        <ButtonAction
                          title="Chỉnh sửa"
                          icon={<Pen size={16} />}
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/truyen-thong-bao-chi/${post.id}/edit`,
                            )
                          }
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
