import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "../../../../features/posts/hooks/usePosts";
import PostCard from "../../../../features/posts/components/PostCard";

const NewsSection = () => {
  const { loading, posts } = usePosts(1, 10);

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
