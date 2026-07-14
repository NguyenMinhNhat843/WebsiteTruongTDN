import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PerformanceData {
  className: string;
  "Xuất sắc"?: number;
  Giỏi?: number;
  Khá?: number;
  "Trung bình"?: number;
  "Chưa xếp loại"?: number;
}

interface AcademicPerformanceChartProps {
  data: PerformanceData[] | undefined;
  isLoading: boolean;
}

export const AcademicPerformanceChart: React.FC<
  AcademicPerformanceChartProps
> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
        Đang tải dữ liệu phân bổ học lực...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        Không có dữ liệu phân bổ học lực học kỳ này.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis dataKey="className" stroke="#94a3b8" fontSize={11} />
        <YAxis stroke="#94a3b8" fontSize={11} />
        <Tooltip cursor={{ fill: "#f1f5f9" }} />
        <Legend verticalAlign="top" height={36} iconType="rect" />

        {/* Render stacked bars matching the DTO properties */}
        <Bar
          dataKey="Xuất sắc"
          stackId="a"
          fill="#10b981"
          radius={[0, 0, 0, 0]}
        />
        <Bar dataKey="Giỏi" stackId="a" fill="#3b82f6" />
        <Bar dataKey="Khá" stackId="a" fill="#eab308" />
        <Bar dataKey="Trung bình" stackId="a" fill="#f97316" />
        <Bar
          dataKey="Chưa xếp loại"
          stackId="a"
          fill="#94a3b8"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AcademicPerformanceChart;
