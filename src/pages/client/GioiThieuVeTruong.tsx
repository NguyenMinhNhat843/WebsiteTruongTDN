import { BookOpen, Award, CheckCircle, GraduationCap } from "lucide-react";

const GioiThieuVeTruong = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section: Ảnh lớn và Tiêu đề */}
      <section className="relative h-75 md:h-100 flex items-center justify-center text-white bg-[url('/banner_header.png')] bg-cover bg-center">
        {/* Lớp Overlay tối: Giúp chữ nổi bật tuyệt đối trên mọi nền ảnh */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 shadow-inner"></div>

        {/* Nội dung */}
        <div className="relative z-10 text-center px-4">
          {/* Tên trường với Drop Shadow để tăng độ nét */}
          <h1 className="text-2xl md:text-5xl font-extrabold mb-4 uppercase tracking-wider drop-shadow-lg">
            Trường Trung cấp Kinh tế – Kỹ thuật
          </h1>
          <h1 className="text-2xl md:text-5xl font-extrabold mb-4 uppercase tracking-wider drop-shadow-lg">
            Trần Đại Nghĩa
          </h1>

          {/* Đường kẻ phân cách nhỏ cho tinh tế */}
          <div className="w-20 h-1 bg-school-blue-700 mx-auto mb-4 rounded-full"></div>

          {/* Địa chỉ trường */}
          <p className="text-sm md:text-xl font-light tracking-wide opacity-90 drop-shadow-md">
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              1028 đường 2/4, phường Vĩnh Phước, TP. Nha Trang, tỉnh Khánh Hòa
            </span>
          </p>
        </div>
      </section>

      {/* 2. Tổng quan & Pháp lý */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 border-l-4 border-red-500 pl-4 uppercase">
              Lịch sử hình thành
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Được thành lập theo Quyết định số <strong>2154/QĐ-UBND</strong>{" "}
                ngày 28/08/2008 của UBND tỉnh Khánh Hòa, Trường Trung cấp Kinh
                tế Kỹ thuật Trần Đại Nghĩa (TDN) tọa lạc tại trái tim thành phố
                Nha Trang số 1028 đường 2/4.
              </p>
              <p>
                Từ ngày 01/3/2017, nhà trường chính thức trực thuộc{" "}
                <strong>Sở Lao động – Thương binh và Xã hội</strong> tỉnh Khánh
                Hòa. Hiện nay, chúng tôi hoạt động nghiêm túc theo Điều lệ
                trường trung cấp của Bộ Lao động - Thương binh và Xã hội, đảm
                bảo mọi quy chuẩn khắt khe nhất về giáo dục nghề nghiệp.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/banner_header.png"
                alt="Trụ sở trường"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-red-600 text-white p-6 rounded-lg hidden md:block shadow-lg">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm">Năm kinh nghiệm đào tạo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Khối các ngành đào tạo (Stats & Cards) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 uppercase">
              Ngành nghề đào tạo trọng điểm
            </h2>
            <p className="text-gray-600 mt-2">
              Đáp ứng đa dạng nhu cầu của thị trường lao động hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nhóm ngành Kỹ thuật */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-blue-600">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-800">
                Kinh tế - Kỹ thuật
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Điện công nghiệp & Dân dụng</li>
                <li>• Kế toán doanh nghiệp</li>
                <li>• Tài chính – Ngân hàng</li>
                <li>• Tin học ứng dụng</li>
                <li>• Công nghệ kỹ thuật điện, điện tử</li>
              </ul>
            </div>

            {/* Nhóm ngành Du lịch */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-red-500">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <GraduationCap className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-800">
                Du lịch - Dịch vụ
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Hướng dẫn du lịch (Ngành chủ lực)</li>
                <li>• Nghiệp vụ khách sạn</li>
                <li>• Nghiệp vụ Bếp & Pha chế</li>
                <li>• Quản lý Nhà hàng Khách sạn</li>
              </ul>
            </div>

            {/* Nhóm liên thông */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-yellow-500">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Award className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-800">
                Liên thông & Ngắn hạn
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Liên thông Đại học Mở Hà Nội</li>
                <li>• Liên thông Đại học Mỏ Địa Chất</li>
                <li>• Các lớp chứng chỉ dưới 3 tháng</li>
                <li>• Đào tạo theo yêu cầu doanh nghiệp</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cam kết chất lượng */}
      <section className="py-20 container mx-auto px-4">
        <div className="overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 md:p-12 ">
            <h2 className="text-3xl font-bold mb-6 italic">
              "Học thực chất - Làm thực tế"
            </h2>
            <p className="mb-8 opacity-90 leading-relaxed">
              Với đội ngũ giáo viên tận tâm, trình độ chuyên môn cao cùng hệ
              thống trang thiết bị hiện đại, TDN không chỉ dạy nghề mà còn là
              cầu nối vững chắc đưa học sinh đến với doanh nghiệp. Chúng tôi cam
              kết chất lượng đầu ra, đảm bảo học sinh tốt nghiệp có tay nghề
              vững vàng, được xã hội và các đơn vị tuyển dụng đón nhận.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-yellow-400" />
                <span className="text-sm font-medium">
                  100% Đạt chuẩn đầu ra
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-yellow-400" />
                <span className="text-sm font-medium">
                  Cam kết hỗ trợ việc làm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-yellow-400" />
                <span className="text-sm font-medium">
                  Hợp tác doanh nghiệp
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-yellow-400" />
                <span className="text-sm font-medium">Liên thông bền vững</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 h-75 md:h-auto">
            <img
              src="/banner_header.png"
              alt="Học sinh thực hành"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GioiThieuVeTruong;
