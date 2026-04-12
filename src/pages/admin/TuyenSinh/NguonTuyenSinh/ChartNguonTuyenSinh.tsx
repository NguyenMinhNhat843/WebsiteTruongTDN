import { BookOpen } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dữ liệu nguồn tuyển sinh
const enrollmentSourceData = [
  { source: "THPT", tcn: 180, scn: 120, dhlk: 100, he9: 0 },
  { source: "THCS", tcn: 150, scn: 200, dhlk: 0, he9: 250 },
  { source: "Đã tốt nghiệp THPT", tcn: 80, scn: 0, dhlk: 80, he9: 0 },
  { source: "Học viên làm việc", tcn: 40, scn: 0, dhlk: 0, he9: 0 },
];

const ChartNguonTuyenSinh = () => {
  return (
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
  );
};

export default ChartNguonTuyenSinh;
