import { useEffect, useState } from "react";
import PostCard from "../common/PostCard";
import type { IPost } from "../../types/api.type";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Lấy 3 bài viết mới nhất (limit=3) để hiển thị ở trang chủ
        const response = await fetch(
          "https://69b11335adac80b427c3e8a9.mockapi.io/news?page=1&limit=3",
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Tiêu đề Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
            Tin tức & Sự kiện
          </h2>
          <Link to={"/tin-tuc"}>
            <button className="text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1 transition-colors">
              Xem tất cả <ExternalLink size={14} />
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl h-80 animate-pulse shadow-sm"
              >
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có tin tức mới nhất.
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
