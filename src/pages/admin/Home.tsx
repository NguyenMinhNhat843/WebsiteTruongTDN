import { Link } from "react-router";
import {
  BarChart3,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Wallet,
  Gift,
} from "lucide-react";

function Home() {
  const features = [
    {
      title: "Thống kê tuyển sinh",
      description:
        "Xem tổng quan số liệu tuyển sinh theo các hệ đào tạo với biểu đồ trực quan",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      path: "/admin/tuyen-sinh/thong-ke",
      stats: "1,200 học viên",
    },
    {
      title: "Thu học phí",
      description:
        "Quản lý thu học phí, theo dõi trạng thái thanh toán và in biên lai",
      icon: Wallet,
      color: "from-green-500 to-emerald-600",
      path: "/admin/tai-chinh/thu-hoc-phi",
      stats: "57 triệu đã thu",
    },
    {
      title: "Miễn giảm học phí",
      description:
        "Đăng ký và phê duyệt miễn giảm học phí cho các đối tượng chính sách",
      icon: Gift,
      color: "from-purple-500 to-pink-600",
      path: "/admin/tai-chinh/mien-giam",
      stats: "33 triệu miễn giảm",
    },
  ];

  const quickStats = [
    {
      label: "Trung cấp nghề",
      value: "450",
      icon: Award,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Sơ cấp nghề",
      value: "320",
      icon: BookOpen,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Đại học liên kết",
      value: "180",
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Hệ 9+",
      value: "250",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white font-bold text-3xl">TC</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hệ Thống Quản Lý Trường Trung cấp Kinh tế - Kỹ thuật Trần Đại Nghĩa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Giải pháp quản lý toàn diện cho đào tạo nghề với nhiều hệ: Trung cấp
            nghề, Sơ cấp nghề, Đại học liên kết và Hệ 9+
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.path}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`h-32 bg-linear-to-br ${feature.color} flex items-center justify-center`}
                >
                  <Icon className="w-16 h-16 text-white opacity-90" />
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">
                      {feature.stats}
                    </span>
                    <span className="text-blue-600 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
                      Xem chi tiết
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Giới thiệu về hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Các hệ đào tạo
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>
                    <strong>Trung cấp nghề:</strong> Đào tạo kỹ thuật viên có
                    tay nghề cao
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    <strong>Sơ cấp nghề:</strong> Đào tạo công nhân kỹ thuật
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>
                    <strong>Đại học liên kết:</strong> Liên kết với các trường
                    đại học
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>
                    <strong>Hệ 9+:</strong> Đào tạo sau THCS, tích hợp THPT và
                    nghề
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tính năng hệ thống
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Thống kê tuyển sinh theo nguồn và hệ đào tạo</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Quản lý thời khóa biểu toàn trường</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Thu học phí và quản lý miễn giảm</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Biểu đồ trực quan, dễ theo dõi</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Giao diện thân thiện, phù hợp giáo dục</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2026 Trường Trung Cấp Nghề - Hệ thống quản lý</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
