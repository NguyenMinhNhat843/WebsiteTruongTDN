import { GraduationCap, Users, TrendingUp, School } from "lucide-react";
import ChartTheoHeDaoTao from "./ChartTheoHeDaoTao";
import ChartTuyenSinhTheoThang from "./ChartTuyenSinhTheoThang";
import ChartNguonTuyenSinh from "./ChartNguonTuyenSinh";
import {
  NguonTuyenSInhProvider,
  useNguonTuyenSinhContext,
} from "./NguonTuyenSinhProvider";
import HeaderPage from "../../../../components/ui/HeaderPage";
import { StatCard } from "../../../../components/ui/StatCard";

const EnrollmentStats = () => {
  return (
    <NguonTuyenSInhProvider>
      <Inner />
    </NguonTuyenSInhProvider>
  );
};

function Inner() {
  const { enrollmentSourceData, trainingSystemData } =
    useNguonTuyenSinhContext();
  const totalStudents = trainingSystemData.reduce(
    (sum, item) => sum + item.students,
    0,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <HeaderPage
          title="Thống Kê Nguồn Tuyển Sinh"
          icon={<School className="w-10 h-10 text-blue-600" />}
        />

        {/* Tổng quan thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Tổng số học viên"
            value={totalStudents}
            // icon={<Users className="w-6 h-6 text-white" />}
            // className="bg-blue-600"
            color={"#2A52BE"}
            description={
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  {"+10%"}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  so với năm trước
                </span>
              </div>
            }
          />
          {trainingSystemData.map((system) => (
            <StatCard
              key={system.name}
              label={system.name}
              value={system.students}
              // icon={<GraduationCap className="w-6 h-6 text-white" />}
              className={`bg-[${system.color}]`}
              description={
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {system.growth}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
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
