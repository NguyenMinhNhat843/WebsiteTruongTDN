import { Outlet, useNavigate } from "react-router-dom";
import type { Post } from "../../types/api.type";
import { useEffect, useState } from "react";
import PostHorizon from "../common/PostCardHorizon";

const PostLayout = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch(
          `https://69b11335adac80b427c3e8a9.mockapi.io/news?page=1&limit=5`,
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setLatestPosts(data);
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- CỘT TRÁI (SIDEBAR) --- */}
        <aside className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
          {/* Widget: Tin mới cập nhật */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span>
              Tin mới cập nhật
            </h3>

            <div className="flex flex-col gap-5">
              {loading
                ? // Skeleton loading đơn giản
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
                      <div className="grow space-y-2 mt-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))
                : latestPosts.map((post) => (
                    <PostHorizon key={post.id} post={post} />
                  ))}
            </div>

            <button
              onClick={() => navigate("/tin-tuc")}
              className="w-full mt-8 py-2.5 text-sm text-blue-600 font-semibold border border-blue-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
            >
              Xem tất cả bài viết
            </button>
          </div>
        </aside>

        {/* --- CỘT PHẢI (MAIN CONTENT) --- */}
        <main className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden order-1 lg:order-2">
          {/* Outlet sẽ render nội dung của PostDetail hoặc PostList */}
          <div className="min-h-125">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostLayout;
