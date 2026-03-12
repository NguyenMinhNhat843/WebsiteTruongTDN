import { Outlet } from "react-router-dom";

const PostLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- CỘT TRÁI (SIDEBAR) --- */}
        <aside className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-1.5 h-6 bg-school-blue-500 rounded-full mr-2"></span>
              Tin mới cập nhật
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="group cursor-pointer flex gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                    <img
                      src={`https://picsum.photos/200?random=${item}`}
                      alt="news"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      Thông báo lịch nghỉ lễ và các hoạt động ngoại khóa năm
                      2024
                    </h4>
                    <span className="text-[11px] text-gray-400 mt-1">
                      12/03/2026
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
              Xem tất cả
            </button>
          </div>
        </aside>

        {/* --- CỘT PHẢI (MAIN CONTENT) --- */}
        <main className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PostLayout;
