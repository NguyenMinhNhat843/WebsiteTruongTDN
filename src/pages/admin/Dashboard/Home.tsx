import {
  Users,
  FileText,
  DollarSign,
  GaugeCircle,
  UserPlus,
  FileCheck,
  CreditCard,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "./components/StatCard";
import ShortcutCard from "./components/ShortCutCard";
import { useNavigate } from "react-router-dom";

// Dữ liệu giả lập cho biểu đồ
const data = [
  { name: "Tháng 1", students: 400 },
  { name: "Tháng 2", students: 700 },
  { name: "Tháng 3", students: 600 },
  { name: "Tháng 4", students: 900 },
];

const Home = () => {
  const naviagate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Content Area */}
      <div className="flex-1 flex flex-col p-8">
        {/* Dashboard Grid */}
        <main className="">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Chào buổi sáng, Admin 👋
            </h2>
            <p className="text-gray-500">
              Dưới đây là cập nhật mới nhất về hệ thống của bạn.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Học sinh"
              value="2,840"
              color="bg-blue-500"
              sub={
                <span className="text-green-500 font-medium">
                  +12% so với tháng trước
                </span>
              }
            />

            <StatCard
              icon={GaugeCircle}
              title="Giảng viên"
              value="156"
              color="bg-purple-500"
              sub={
                <span className="text-green-500 font-medium">
                  +2% so với tháng trước
                </span>
              }
            />

            <StatCard
              icon={FileText}
              title="Hồ sơ mới"
              value="42"
              color="bg-orange-500"
              sub={
                <span className="text-red-500 font-medium">
                  -4% so với tháng trước
                </span>
              }
            />

            <StatCard
              icon={DollarSign}
              title="Học phí (VNĐ)"
              value="1.2 tỷ"
              color="bg-emerald-500"
              sub={
                <span className="text-green-500 font-medium">
                  +8% so với tháng trước
                </span>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
              <h3 className="font-bold text-gray-700 mb-6">
                Thống kê tăng trưởng học viên
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Tasks */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
              <h3 className="font-bold text-gray-700 mb-6">
                Hoạt động gần đây
              </h3>
              <div className="space-y-6 relative">
                {/* Đường kẻ dọc trang trí bên trái */}
                <div className="absolute left-3.75 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {[
                  {
                    action: "Cập nhật điểm",
                    target: "Lớp K24-CNTT",
                    user: "GV. Nguyễn Văn A",
                    time: "2 phút trước",
                  },
                  {
                    action: "Nộp học phí",
                    target: "Học sinh Trần B",
                    user: "Hệ thống",
                    time: "15 phút trước",
                  },
                  {
                    action: "Đăng ký mới",
                    target: "Khóa học Web Dev",
                    user: "Lê C",
                    time: "1 giờ trước",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="font-bold">{item.user}</span>{" "}
                        {item.action.toLowerCase()} cho{" "}
                        <span className="text-blue-600 font-semibold">
                          {item.target}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <div className="grid py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ShortcutCard
            icon={UserPlus}
            label="Tiếp nhận học viên"
            bgColor="bg-blue-600"
            onClick={() => naviagate("/admin/hoc-sinh/ho-so")}
          />
          <ShortcutCard
            icon={FileCheck}
            label="Duyệt kết quả"
            bgColor="bg-emerald-600"
            onClick={() => naviagate("/admin/dao-tao/diem-thi")}
          />
          <ShortcutCard
            icon={CreditCard}
            label="Thu học phí"
            bgColor="bg-orange-500"
            onClick={() => naviagate("/admin/tai-chinh/thu-hoc-phi")}
          />
          <ShortcutCard
            icon={ClipboardList}
            label="Thời khóa biểu"
            bgColor="bg-purple-600"
            onClick={() => naviagate("/admin/dao-tao/thoi-khoa-bieu")}
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
            onClick={() => naviagate("/admin/cai-dat/phan-quyen")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
