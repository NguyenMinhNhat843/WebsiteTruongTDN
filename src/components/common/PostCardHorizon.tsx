import { Link } from "react-router-dom";
import type { Post } from "../../types/api.type";

interface PostHorizonProps {
  post: Post;
}

const PostHorizon: React.FC<PostHorizonProps> = ({ post }) => {
  return (
    <Link
      to={`/tin-tuc/${post.slug}`} // Đường dẫn tùy chỉnh theo route của bạn
      className="group flex gap-3 cursor-pointer"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-school-blue-600 transition-colors leading-snug">
          {post.title}
        </h4>
        <span className="text-[11px] text-gray-400 mt-1">
          {post.published_at}
        </span>
      </div>
    </Link>
  );
};

export default PostHorizon;
