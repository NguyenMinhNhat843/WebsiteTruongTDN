import { ExternalLink } from "lucide-react";
import { useState } from "react";

type MediaItem = {
  id: string;
  title: string;
  type: "video" | "image";
  link: string;
};

const mediaItems: MediaItem[] = [
  {
    id: "M001",
    title: "Lễ Khai Giảng Năm Học Mới 2025 - 2026",
    type: "video",
    link: "https://www.youtube.com/watch?v=0Ev0ViMYlkU",
  },
  {
    id: "M002",
    title: "Lễ Khai Giảng Năm Học Mới 2025 - 2026",
    type: "video",
    link: "https://www.youtube.com/watch?v=0Ev0ViMYlkU",
  },
  {
    id: "M003",
    title: "Lễ Khai Giảng Năm Học Mới 2025 - 2026",
    type: "video",
    link: "https://www.youtube.com/watch?v=0Ev0ViMYlkU",
  },
  {
    id: "M004",
    title: "Lễ Khai Giảng Năm Học Mới 2025 - 2026",
    type: "video",
    link: "https://www.youtube.com/watch?v=0Ev0ViMYlkU",
  },
  {
    id: "M005",
    title: "Hình ảnh hoạt động ngoại khóa tại Vũng Tàu",
    type: "image",
    link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjSDv8kR5UWOwlBUUxhvg3jYfdY9ugiHfYSg&s",
  },
  {
    id: "M006",
    title: "Hình ảnh hoạt động ngoại khóa tại Vũng Tàu",
    type: "image",
    link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjSDv8kR5UWOwlBUUxhvg3jYfdY9ugiHfYSg&s",
  },
  {
    id: "M007",
    title: "Hình ảnh hoạt động ngoại khóa tại Vũng Tàu",
    type: "image",
    link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjSDv8kR5UWOwlBUUxhvg3jYfdY9ugiHfYSg&s",
  },
  {
    id: "M008",
    title: "Hình ảnh hoạt động ngoại khóa tại Vũng Tàu",
    type: "image",
    link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjSDv8kR5UWOwlBUUxhvg3jYfdY9ugiHfYSg&s",
  },
];

const MediaSection = () => {
  // Tab state: "image" hoặc "video"
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

  // Lọc danh sách theo tab đang chọn
  const visibleItems =
    activeTab === "image"
      ? mediaItems.filter((m) => m.type === "image").slice(0, 6)
      : mediaItems.filter((m) => m.type === "video").slice(0, 6);

  const renderVideo = (item: MediaItem) => {
    // Logic tách ID từ link: https://www.youtube.com/watch?v=0Ev0ViMYlkU -> 0Ev0ViMYlkU
    const videoId = item.link.split("v=")[1]?.split("&")[0];
    const embedLink = `https://www.youtube.com/embed/${videoId}`;

    return (
      <iframe
        className="w-full h-full"
        src={embedLink}
        title={item.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    );
  };

  const renderImage = (item: MediaItem) => (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Hình ảnh - Zoom nhẹ khi hover */}
      <img
        src={item.link}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay Gradient: Chỉ xuất hiện khi hover để làm nổi bật chữ */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Phần nội dung trồi lên */}
      <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <p className="text-white text-sm font-bold leading-snug line-clamp-2">
          {item.title}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-school-blue-600 pl-3">
            Thư viện Media
          </h2>
          <button className="text-school-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1 transition-colors">
            Xem tất cả <ExternalLink size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-md border border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab("image")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeTab === "image"
                  ? "bg-white text-school-blue-700"
                  : "bg-transparent text-gray-600"
              }`}
            >
              Hình ảnh
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeTab === "video"
                  ? "bg-white text-school-blue-700"
                  : "bg-transparent text-gray-600"
              }`}
            >
              Video
            </button>
          </div>
        </div>

        {/* Grid Media theo tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === "image"
            ? visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-video"
                >
                  {renderImage(item)}
                </div>
              ))
            : visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-video"
                >
                  {renderVideo(item)}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
