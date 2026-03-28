const TuyenSinhSection = () => {
  const admissionsData = [
    {
      id: 1,
      title: "Chương trình phổ thông cao đẳng",
      description:
        "Khởi nguồn sáng tạo và phát triển tư duy thực tế cho sinh viên.",
      image: "/Home/tuyensinhsection_banner1.jpg",
    },
    {
      id: 2,
      title: "Xuất khẩu lao động Nhật - Hàn",
      description: "Cơ hội việc làm quốc tế với thu nhập hấp dẫn và ổn định.",
      image: "/Home/tuyensinhsection_banner3.jpg",
    },
    {
      id: 3,
      title: "Học đại học trực tuyến linh hoạt",
      description: "Học mọi lúc mọi nơi, nhận bằng đại học chính quy.",
      image: "/Home/tuyensinhsection_banner4.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 uppercase">
            Thông Tin Tuyển Sinh
          </h2>
          <div className="w-24 h-0.5 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hệ thống ngành học trọng điểm, bám sát nhu cầu thực tế của thị
            trường. Chúng tôi cam kết trang bị kiến thức và kỹ năng chuyên sâu
            cho bạn.
          </p>
        </div>

        {/* Bố cục Grid: Trái to, Phải 2 nhỏ dọc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-130">
          {/* CỘT TRÁI: Hình to chiếm toàn bộ chiều cao */}
          <div className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer h-[400px] md:h-full">
            <img
              src={admissionsData[0].image}
              alt={admissionsData[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-8 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-3">
                {admissionsData[0].title}
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                {admissionsData[0].description}
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: 2 hình nhỏ xếp dọc */}
          <div className="grid grid-rows-2 gap-6 h-[600px] md:h-full">
            {admissionsData.slice(1, 3).map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TuyenSinhSection;
