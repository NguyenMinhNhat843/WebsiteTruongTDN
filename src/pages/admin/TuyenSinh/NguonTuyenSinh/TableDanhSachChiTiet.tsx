import { Users, FileText, ChevronRight } from "lucide-react";
import { useNguonTuyenSinhContext } from "./NguonTuyenSinhProvider";

const TableDanhSachChiTiet = () => {
  const { enrollmentSourceData, totalStudents } = useNguonTuyenSinhContext();

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Header của Table */}
      <div className="p-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          Chi Tiết Nguồn Tuyển Sinh
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
          Xuất báo cáo <FileText className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Nguồn tuyển sinh
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-200">
                Trung cấp nghề
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-200">
                Sơ cấp nghề
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-purple-600 uppercase tracking-wider border-b border-slate-200">
                Đại học liên kết
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-orange-600 uppercase tracking-wider border-b border-slate-200">
                Hệ 9+
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 bg-slate-100/50">
                Tổng cộng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollmentSourceData.map((row, idx) => {
              const total = row.tcn + row.scn + row.dhlk + row.he9;
              return (
                <tr
                  key={idx}
                  className="group hover:bg-blue-50/30 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <span className="font-semibold text-slate-700">
                        {row.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={
                        row.tcn > 0
                          ? "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          : "text-slate-300"
                      }
                    >
                      {row.tcn > 0 ? row.tcn : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={
                        row.scn > 0
                          ? "px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                          : "text-slate-300"
                      }
                    >
                      {row.scn > 0 ? row.scn : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={
                        row.dhlk > 0
                          ? "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                          : "text-slate-300"
                      }
                    >
                      {row.dhlk > 0 ? row.dhlk : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={
                        row.he9 > 0
                          ? "px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                          : "text-slate-300"
                      }
                    >
                      {row.he9 > 0 ? row.he9 : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center bg-slate-50/30">
                    <span className="text-sm font-bold text-slate-900 leading-none">
                      {total}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer Tổng cộng */}
          <tfoot className="bg-blue-900">
            {" "}
            {/* Đổi từ slate-900 sang blue-900 */}
            <tr>
              <td className="px-6 py-5 whitespace-nowrap text-white font-bold rounded-bl-xl">
                TỔNG CỘNG HỆ THỐNG
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-center">
                <div className="text-blue-200 font-bold text-lg leading-none">
                  {" "}
                  {/* Chỉnh màu text cho dễ nhìn trên nền xanh */}
                  {enrollmentSourceData.reduce((sum, row) => sum + row.tcn, 0)}
                </div>
                <div className="text-[10px] text-blue-200/60 uppercase mt-1 font-medium">
                  Học viên
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-center">
                <div className="text-emerald-300 font-bold text-lg leading-none">
                  {enrollmentSourceData.reduce((sum, row) => sum + row.scn, 0)}
                </div>
                <div className="text-[10px] text-emerald-300/60 uppercase mt-1 font-medium">
                  Học viên
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-center">
                <div className="text-purple-300 font-bold text-lg leading-none">
                  {enrollmentSourceData.reduce((sum, row) => sum + row.dhlk, 0)}
                </div>
                <div className="text-[10px] text-purple-300/60 uppercase mt-1 font-medium">
                  Học viên
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-center">
                <div className="text-orange-300 font-bold text-lg leading-none">
                  {enrollmentSourceData.reduce((sum, row) => sum + row.he9, 0)}
                </div>
                <div className="text-[10px] text-orange-300/60 uppercase mt-1 font-medium">
                  Học viên
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-center bg-blue-700 rounded-br-xl">
                {" "}
                {/* Blue-700 tạo độ chuyển màu nhẹ so với blue-900 */}
                <div className="text-white font-black text-2xl leading-none">
                  {totalStudents}
                </div>
                <div className="text-[10px] text-white/80 uppercase mt-1 font-bold">
                  Tổng tất cả
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TableDanhSachChiTiet;
