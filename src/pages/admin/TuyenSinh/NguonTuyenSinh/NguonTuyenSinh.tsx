import {
  GraduationCap,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  School,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu mẫu cho các hệ đào tạo
const trainingSystemData = [
  { name: "Trung cấp nghề", students: 450, color: "#3b82f6", growth: "+12%" },
  { name: "Sơ cấp nghề", students: 320, color: "#10b981", growth: "+8%" },
  { name: "Đại học liên kết", students: 180, color: "#8b5cf6", growth: "+15%" },
  { name: "Hệ 9+", students: 250, color: "#f59e0b", growth: "+10%" },
];

// Dữ liệu nguồn tuyển sinh
const enrollmentSourceData = [
  { source: "THPT", tcn: 180, scn: 120, dhlk: 100, he9: 0 },
  { source: "THCS", tcn: 150, scn: 200, dhlk: 0, he9: 250 },
  { source: "Đã tốt nghiệp THPT", tcn: 80, scn: 0, dhlk: 80, he9: 0 },
  { source: "Học viên làm việc", tcn: 40, scn: 0, dhlk: 0, he9: 0 },
];

// Dữ liệu theo tháng
const monthlyData = [
  { month: "T1", total: 85 },
  { month: "T2", total: 92 },
  { month: "T3", total: 110 },
  { month: "T4", total: 125 },
  { month: "T5", total: 145 },
  { month: "T6", total: 180 },
  { month: "T7", total: 220 },
  { month: "T8", total: 280 },
  { month: "T9", total: 150 },
];

// Dữ liệu phân bổ theo hệ đào tạo (cho biểu đồ tròn)
const pieChartData = [
  { name: "Trung cấp nghề", value: 450, color: "#3b82f6" },
  { name: "Sơ cấp nghề", value: 320, color: "#10b981" },
  { name: "Đại học liên kết", value: 180, color: "#8b5cf6" },
  { name: "Hệ 9+", value: 250, color: "#f59e0b" },
];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  growth?: string;
}

function StatCard({ title, value, icon, color, growth }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          {growth && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {growth}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                so với năm trước
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function EnrollmentStats() {
  const totalStudents = trainingSystemData.reduce(
    (sum, item) => sum + item.students,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <School className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Thống Kê Tuyển Sinh
            </h1>
          </div>
          <p className="text-gray-600">
            Trường Trung Cấp Nghề - Năm học 2025-2026
          </p>
        </div>

        {/* Tổng quan thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng số học viên"
            value={totalStudents}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-blue-500"
            growth="+11%"
          />
          {trainingSystemData.map((system) => (
            <StatCard
              key={system.name}
              title={system.name}
              value={system.students}
              icon={<GraduationCap className="w-6 h-6 text-white" />}
              color={`bg-[${system.color}]`}
              growth={system.growth}
            />
          ))}
        </div>

        {/* Biểu đồ và thống kê chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ phân bổ theo hệ đào tạo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Phân Bổ Theo Hệ Đào Tạo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Biểu đồ xu hướng tuyển sinh theo tháng */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Xu Hướng Tuyển Sinh Theo Tháng
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ nguồn tuyển sinh */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Nguồn Tuyển Sinh Theo Hệ Đào Tạo
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={enrollmentSourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tcn" name="Trung cấp nghề" fill="#3b82f6" />
              <Bar dataKey="scn" name="Sơ cấp nghề" fill="#10b981" />
              <Bar dataKey="dhlk" name="Đại học liên kết" fill="#8b5cf6" />
              <Bar dataKey="he9" name="Hệ 9+" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bảng chi tiết nguồn tuyển sinh */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Chi Tiết Nguồn Tuyển Sinh
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nguồn tuyển sinh
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trung cấp nghề
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sơ cấp nghề
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đại học liên kết
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hệ 9+
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng cộng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollmentSourceData.map((row, idx) => {
                  const total = row.tcn + row.scn + row.dhlk + row.he9;
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {row.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                        {row.tcn > 0 ? row.tcn : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                        {row.scn > 0 ? row.scn : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                        {row.dhlk > 0 ? row.dhlk : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                        {row.he9 > 0 ? row.he9 : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-600">
                        {total}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    Tổng cộng
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-blue-600">
                    {enrollmentSourceData.reduce(
                      (sum, row) => sum + row.tcn,
                      0,
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-green-600">
                    {enrollmentSourceData.reduce(
                      (sum, row) => sum + row.scn,
                      0,
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-purple-600">
                    {enrollmentSourceData.reduce(
                      (sum, row) => sum + row.dhlk,
                      0,
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-orange-600">
                    {enrollmentSourceData.reduce(
                      (sum, row) => sum + row.he9,
                      0,
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 text-lg">
                    {totalStudents}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer thông tin */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dữ liệu cập nhật: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentStats;
