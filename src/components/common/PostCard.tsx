import { Link } from "react-router-dom";

interface PostCardProps {
  id?: string;
  slug?: string;
  image?: string;
  title?: string;
}

const PostCard = ({ slug, image, title }: PostCardProps) => {
  return (
    <Link to={`/${slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group">
        {/* Container Hình ảnh */}
        <div className="relative overflow-hidden aspect-4/3">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge "2026" hoặc Tuyển sinh nếu muốn giống ảnh */}
          {/* <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          Tuyển sinh 2026
        </div> */}
        </div>

        {/* Nội dung văn bản */}
        <div className="p-5 flex flex-col grow text-center items-center">
          <div className="w-10 h-1 bg-gray-200 mb-4 rounded-full group-hover:bg-blue-500 transition-colors"></div>
          <h3 className="text-blue-900 font-bold text-lg leading-snug uppercase mb-4 line-clamp-3">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
