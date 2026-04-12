import { Award } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const pieChartData = [
  { name: "Trung cấp nghề", value: 450, color: "#3b82f6" },
  { name: "Sơ cấp nghề", value: 320, color: "#10b981" },
  { name: "Đại học liên kết", value: 180, color: "#8b5cf6" },
  { name: "Hệ 9+", value: 250, color: "#f59e0b" },
];

const ChartTheoHeDaoTao = () => {
  return (
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
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
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
  );
};

export default ChartTheoHeDaoTao;
