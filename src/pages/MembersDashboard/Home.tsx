import React from "react";
import { User, BookOpen, Calendar, Clock } from "lucide-react"; // Sử dụng icon cho sinh động

const MemberDashboard = () => {
  // Dữ liệu mẫu (sau này bạn sẽ gọi API để lấy dữ liệu này)
  const teacherInfo = {
    name: "Nguyễn Văn A",
    major: "Kỹ thuật phần mềm",
    department: "Công nghệ thông tin",
    totalClasses: 5,
    lessonsThisWeek: 12,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Bảng điều khiển giáo viên
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Khối 1: Thông tin giáo viên */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Giáo viên
            </p>
            <h2 className="text-xl font-bold text-gray-800">
              {teacherInfo.name}
            </h2>
            <p className="text-sm text-gray-600">
              {teacherInfo.department} - {teacherInfo.major}
            </p>
          </div>
        </div>

        {/* Khối 2: Danh sách lớp học */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <BookOpen className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Lớp học đang dạy
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              {teacherInfo.totalClasses}{" "}
              <span className="text-sm font-normal text-gray-500">lớp</span>
            </h2>
            <button className="text-blue-500 text-sm hover:underline mt-1">
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* Khối 3: Thời khóa biểu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Calendar className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Tiết dạy tuần này
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              {teacherInfo.lessonsThisWeek}{" "}
              <span className="text-sm font-normal text-gray-500">tiết</span>
            </h2>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Clock size={14} className="mr-1" />
              <span>Cập nhật: Thứ Hai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bạn có thể thêm một bảng danh sách lớp cụ thể ở dưới này */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4">Lịch dạy gần nhất</h3>
        <div className="text-gray-400 text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
          (Danh sách các tiết học cụ thể sẽ hiển thị ở đây)
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
