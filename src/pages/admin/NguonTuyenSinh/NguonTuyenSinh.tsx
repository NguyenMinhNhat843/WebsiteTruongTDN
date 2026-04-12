import { GraduationCap, Users, TrendingUp, School } from "lucide-react";
import ChartTheoHeDaoTao from "./ChartTheoHeDaoTao";
import ChartTuyenSinhTheoThang from "./ChartTuyenSinhTheoThang";
import ChartNguonTuyenSinh from "./ChartNguonTuyenSinh";
import {
  NguonTuyenSInhProvider,
  useNguonTuyenSinhContext,
} from "./NguonTuyenSinhProvider";
import HeaderPage from "../../../components/ui/HeaderPage";
import { StatCard } from "../../../components/ui/StatCard";
import TableDanhSachChiTiet from "./TableDanhSachChiTiet";

const EnrollmentStats = () => {
  return (
    <NguonTuyenSInhProvider>
      <Inner />
    </NguonTuyenSInhProvider>
  );
};

function Inner() {
  const { trainingSystemData, totalStudents } = useNguonTuyenSinhContext();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <HeaderPage
          title="Thống Kê Nguồn Tuyển Sinh"
          icon={<School className="w-10 h-10 text-blue-600" />}
        />

        {/* Tổng quan thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Tổng số học viên"
            value={totalStudents}
            icon={<Users className="w-6 h-6 text-indigo-600" />}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-4"
            description={
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-600 font-semibold">
                  +10%
                </span>
                <span className="text-sm text-slate-500 ml-1">
                  so với năm trước
                </span>
              </div>
            }
          />
          {trainingSystemData.map((system) => (
            <StatCard
              key={system.name}
              label={
                <span className="text-white/90 font-medium">{system.name}</span>
              }
              value={
                <span className="text-white text-2xl font-bold">
                  {system.students}
                </span>
              }
              icon={
                <div
                  className={`p-2 rounded-lg ${system.iconBox} backdrop-blur-sm`}
                >
                  <GraduationCap className={`w-6 h-6 ${system.iconColor}`} />
                </div>
              }
              className={`border shadow-lg transition-transform hover:scale-[1.02] ${system.cardClass}`}
              description={
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-white mr-1" />
                  <span className="text-sm text-white font-bold">
                    {system.growth}
                  </span>
                  <span className="text-sm text-white/70 ml-1">
                    so với năm trước
                  </span>
                </div>
              }
            />
          ))}
        </div>

        {/* Biểu đồ và thống kê chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ phân bổ theo hệ đào tạo */}
          <ChartTheoHeDaoTao />

          {/* Biểu đồ xu hướng tuyển sinh theo tháng */}
          <ChartTuyenSinhTheoThang />
        </div>

        {/* Biểu đồ nguồn tuyển sinh */}
        <ChartNguonTuyenSinh />

        {/* Bảng chi tiết nguồn tuyển sinh */}
        <TableDanhSachChiTiet />
      </div>
    </div>
  );
}

export default EnrollmentStats;
