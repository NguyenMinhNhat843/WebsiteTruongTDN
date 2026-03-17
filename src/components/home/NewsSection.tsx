import { useEffect, useState } from "react";
import PostCard from "../common/PostCard";
import type { Post } from "../../types/api.type";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Lấy 3 bài viết mới nhất (limit=3) để hiển thị ở trang chủ
        const response = await fetch(
          "https://69b11335adac80b427c3e8a9.mockapi.io/news?page=1&limit=10",
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-school-blue-600 pl-3">
            Tin tức & Sự kiện
          </h2>
          <Link to={"/tin-tuc"}>
            <button className="text-school-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1 transition-colors">
              Xem tất cả <ExternalLink size={14} />
            </button>
          </Link>
        </div>

        {!loading && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <PostCard post={posts[0]} />
              {posts.slice(1).map((post) => {
                return (
                  <div
                    className="text-xs uppercase font-bold bg-white p-2 cursor-pointer text-school-blue-800 rounded-xl shadow-sm mt-4 
                transition-all duration-200 hover:text-school-blue-700 line-clamp-1"
                  >
                    <Link to={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {posts.slice(1, 7).map((post) => (
                <PostCard post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
