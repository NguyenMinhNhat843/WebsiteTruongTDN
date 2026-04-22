import type { ReactNode } from "react";

interface StatCardProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  value: string;
  sub?: ReactNode; // Cho phép truyền bất cứ Component/Node nào vào đây
  color: string;
}

const StatCard = ({ icon: Icon, title, value, sub, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800 leading-none">
          {value}
        </h3>

        {/* Render nội dung tùy biến ở đây */}
        <div className="mt-2 text-xs">{sub}</div>
      </div>

      <div className={`p-3 rounded-xl shrink-0 ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

export default StatCard;
