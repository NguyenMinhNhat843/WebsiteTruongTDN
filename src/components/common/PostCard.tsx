import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react"; // Import icon lịch
import type { Post } from "../../types/api.type";
import { formatDate } from "../../util/formatDate";

const PostCard = ({ post }: { post: Post }) => {
  const { slug, image, title, published_at } = post;

  const isNewPost = (dateString?: string) => {
    if (!dateString) return false;
    const postDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInDays = (now - postDate) / (1000 * 60 * 60 * 24);
    return diffInDays >= 0 && diffInDays <= 7;
  };
  const isNew = isNewPost(published_at);

  return (
    <Link to={`/tin-tuc/${slug}`} className="block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group">
        {/* Container Hình ảnh */}
        <div className="relative overflow-hidden aspect-video">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge ngày tháng đè lên ảnh (Tùy chọn nếu muốn nổi bật) */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Badge Ngày tháng */}
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-school-blue-900 flex items-center gap-1 shadow-sm border border-white/50">
              <CalendarDays size={12} />
              {formatDate(published_at)}
            </div>

            {/* Badge New với animation mượt mà */}
            {isNew && (
              <div
                className="bg-red-100 px-2 py-1 rounded text-[10px] font-black text-red-400 flex items-center gap-1 shadow-md origin-center"
                style={{
                  animation: "emphasisPulse 2s ease-in-out infinite",
                }}
              >
                New
                <style>{`
                  @keyframes emphasisPulse {
                    0%, 100% { transform: scale(1); }
                    50%       { transform: scale(1.1); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>

        {/* Nội dung văn bản */}
        <div className="p-5 flex flex-col grow text-center items-center">
          <div className="w-10 h-1 bg-gray-200 mb-4 rounded-full group-hover:bg-school-blue-500 transition-colors"></div>

          <h3 className="text-school-blue-900 font-bold leading-snug uppercase mb-4 line-clamp-3 group-hover:text-school-blue-700 transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
