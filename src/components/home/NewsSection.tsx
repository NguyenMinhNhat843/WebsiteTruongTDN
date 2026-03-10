import PostCard from "../common/PostCard";

const NewsSection = () => {
  const posts = [
    {
      id: "P001",
      slug: "hoc-dung-huong-lam-dung-nghe-tai-cao-dang-cong-nghe-va-du-lich",
      title: "Học đúng hướng - Làm đúng nghề tại Cao đẳng Công nghệ và Du lịch",
      image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-10.jpg",
    },
    {
      id: "P002",
      slug: "thong-bao-tuyen-sinh-he-chinh-quy-cac-nganh-y-duoc-va-ky-thuat-2026",
      title:
        "Thông báo tuyển sinh hệ chính quy các ngành Y dược và Kỹ thuật 2026",
      image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-10.jpg",
    },
    {
      id: "P003",
      slug: "co-hoi-viec-lam-rong-mo-cho-sinh-vien-nganh-huong-dan-du-lich",
      title: "Cơ hội việc làm rộng mở cho sinh viên ngành Hướng dẫn du lịch",
      image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-10.jpg",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Tiêu đề Section (Tùy chọn) */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
            Tin tức & Sự kiện
          </h2>
          <button className="text-blue-600 font-medium hover:underline cursor-pointer">
            Xem tất cả
          </button>
        </div>

        {/* Grid Danh sách bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              image={post.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
