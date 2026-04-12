import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const ChartTuyenSinhTheoThang = () => {
  return (
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
  );
};

export default ChartTuyenSinhTheoThang;
