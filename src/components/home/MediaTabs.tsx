import { Play, Image as ImageIcon, ExternalLink } from "lucide-react";

const MediaSection = () => {
  // Dữ liệu mẫu cho Media (Bạn có thể fetch từ API tương tự News)
  const mediaItems = [
    {
      id: "M001",
      title: "Lễ Khai Giảng Năm Học Mới 2025 - 2026",
      thumbnail: "https://picsum.photos/seed/school1/800/450",
      type: "video",
      link: "https://www.youtube.com/watch?v=0Ev0ViMYlkU",
    },
    {
      id: "M002",
      title: "Hình ảnh hoạt động ngoại khóa tại Vũng Tàu",
      thumbnail: "https://picsum.photos/seed/school2/800/450",
      type: "image",
      link: "#",
    },
    {
      id: "M003",
      title: "Giới thiệu ngành Công nghệ Thông tin - Kỹ thuật",
      thumbnail: "https://picsum.photos/seed/school3/800/450",
      type: "video",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Tiêu đề Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
            Thư viện Media
          </h2>
          <button className="text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1 transition-colors">
            Xem tất cả <ExternalLink size={14} />
          </button>
        </div>

        {/* Grid Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-video"
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-50 transition-all duration-500"
              />

              {/* Lớp phủ Overlay khi chưa hover (Gradient nhẹ phía dưới) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Icon trung tâm (Play cho Video, Image cho Ảnh) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 group-hover:bg-red-600 group-hover:border-red-500 group-hover:scale-110 transition-all duration-300">
                  {item.type === "video" ? (
                    <Play
                      className="text-white ml-1"
                      fill="currentColor"
                      size={24}
                    />
                  ) : (
                    <ImageIcon className="text-white" size={24} />
                  )}
                </div>
              </div>

              {/* Tiêu đề nằm dưới cùng */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm md:text-base line-clamp-2 leading-snug">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Link ẩn để bọc toàn bộ card */}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20"
                aria-label={`Xem ${item.title}`}
              ></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
