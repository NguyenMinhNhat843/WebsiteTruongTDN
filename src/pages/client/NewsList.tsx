import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Post } from "../../types/api.type";
import PostCard from "../../components/common/PostCard";

const NewsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 5; // 5 cột x 1 hàng

  const fetchPosts = async (
    currentPage: number,
    isLoadMore: boolean = false,
  ) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await fetch(
        `https://69b11335adac80b427c3e8a9.mockapi.io/news?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
      );
      const data = await response.json();

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setPosts((prev) => (isLoadMore ? [...prev, ...data] : data));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tin tức:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center uppercase tracking-wider">
          Tin tức & Sự kiện
        </h1>

        {/* Grid Layout: 5 cột trên màn hình lớn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading
            ? [...Array(ITEMS_PER_PAGE)].map((_, n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl h-72 animate-pulse border border-gray-100 shadow-sm"
                >
                  <div className="bg-gray-200 h-40 rounded-t-xl"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            : posts.map((post) => (
                <div
                  key={post.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <PostCard post={post} />
                </div>
              ))}
        </div>

        {/* Nút Xem Thêm */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 flex items-center gap-2 cursor-pointer"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Đang tải...
                </>
              ) : (
                "Xem thêm tin tức"
              )}
            </button>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Không tìm thấy bài viết nào.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
