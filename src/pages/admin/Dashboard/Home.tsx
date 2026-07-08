import {
  Users,
  FileText,
  GaugeCircle,
  UserPlus,
  FileCheck,
  CreditCard,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "./components/StatCard";
import ShortcutCard from "./components/ShortCutCard";
import { useNavigate } from "react-router-dom";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useAppContext();

  // API 1: Lấy thông tin tổng quan hệ thống
  const { data: statisOverview, isLoading: isLoadingOverview } = $api.useQuery(
    "get",
    "/analytics/overview",
  );

  // API 2: Lấy dữ liệu tăng trưởng để vẽ biểu đồ
  const { data: growthCharts, isLoading: isLoadingGrowthCharts } =
    $api.useQuery("get", "/analytics/growth-charts");

  // Biến đổi cấu trúc data từ API chart để truyền vào Recharts dễ dàng hơn
  // Đồng bộ hóa dữ liệu registerGrowth và studyingGrowth theo từng tháng
  const chartData =
    growthCharts?.registerGrowth.map((item, index) => {
      const studyingItem = growthCharts.studyingGrowth?.[index];
      return {
        name: item.month, // Tên tháng hiển thị trục X
        "Học viên mới": item.count,
        "Đang học": studyingItem ? studyingItem.count : 0,
      };
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Content Area */}
      <div className="flex-1 flex flex-col p-8">
        <main className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Chào buổi sáng, {profile?.fullName || "Admin"} 👋
            </h2>
            <p className="text-gray-500">
              Dưới đây là cập nhật mới nhất về hệ thống của bạn.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoadingOverview ? (
              // Trạng thái Loading Skeleton cho các thẻ thống kê
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"
                />
              ))
            ) : (
              <>
                <StatCard
                  icon={Users}
                  title="Tổng học sinh"
                  value={statisOverview?.totalStudents?.toLocaleString() || "0"}
                  color="bg-blue-500"
                  sub={<span className="text-gray-400">Tất cả trạng thái</span>}
                />

                <StatCard
                  icon={GaugeCircle}
                  title="Giảng viên"
                  value={statisOverview?.totalTeachers?.toLocaleString() || "0"}
                  color="bg-purple-500"
                  sub={<span className="text-gray-400">Đang công tác</span>}
                />

                <StatCard
                  icon={FileText}
                  title="Học viên mới đăng ký"
                  value={
                    statisOverview?.registerStudents?.toLocaleString() || "0"
                  }
                  color="bg-orange-500"
                  sub={
                    <span className="text-gray-400">Chờ duyệt / Nhập học</span>
                  }
                />

                <StatCard
                  icon={GraduationCap}
                  title="Học viên đang học"
                  value={
                    statisOverview?.studyingStudents?.toLocaleString() || "0"
                  }
                  color="bg-emerald-500"
                  sub={
                    <span className="text-gray-400">
                      Chờ duyệt:{" "}
                      <strong className="text-amber-500">
                        {statisOverview?.pendingStudents || 0}
                      </strong>
                    </span>
                  }
                />
              </>
            )}
          </div>

          {/* Chart Section - Cho full chiều rộng màn hình */}
          <div className="w-full mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-700 mb-6">
                Thống kê tăng trưởng học viên
              </h3>
              <div className="h-80 w-full">
                {isLoadingGrowthCharts ? (
                  <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
                    Đang tải dữ liệu biểu đồ...
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      {/* Đường line biểu thị học viên mới đăng ký */}
                      <Line
                        type="monotone"
                        dataKey="Học viên mới"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {/* Đường line biểu thị học viên đang học thực tế */}
                      <Line
                        type="monotone"
                        dataKey="Đang học"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Không có dữ liệu tăng trưởng.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Shortcuts - Giữ nguyên như yêu cầu */}
        <div className="grid py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ShortcutCard
            icon={UserPlus}
            label="Tiếp nhận học viên"
            bgColor="bg-blue-600"
            onClick={() => navigate("/admin/hoc-sinh/ho-so")}
          />
          <ShortcutCard
            icon={FileCheck}
            label="Duyệt kết quả"
            bgColor="bg-emerald-600"
            onClick={() => navigate("/admin/dao-tao/diem-thi")}
          />
          <ShortcutCard
            icon={CreditCard}
            label="Thu học phí"
            bgColor="bg-orange-500"
            onClick={() => navigate("/admin/tai-chinh/thu-hoc-phi")}
          />
          <ShortcutCard
            icon={ClipboardList}
            label="Thời khóa biểu"
            bgColor="bg-purple-600"
            onClick={() => navigate("/admin/dao-tao/thoi-khoa-bieu")}
          />
          <ShortcutCard
            icon={MessageSquare}
            label="Gửi thông báo"
            bgColor="bg-rose-500"
          />
          <ShortcutCard
            icon={ShieldCheck}
            label="Phân quyền"
            bgColor="bg-slate-700"
            onClick={() => navigate("/admin/cai-dat/phan-quyen")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
