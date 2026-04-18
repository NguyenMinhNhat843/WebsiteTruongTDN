import { CreditCard, Eye, Printer, User } from "lucide-react";
import BadgeTrangThaiHocPhi from "../../../components/ui/BadgeTrangThaiHocPhi";
import type { EnumTrangThaiHocPhi } from "../../../type/enum";
import { formatCurrency } from "../../../util/format";
import { useThuHocPhiContext } from "./ThuHocPhiProvider";
import { HeDaoTaoBadge } from "../../../components/ui/HeDaoTaoBadge";
import Pagination from "../../../components/ui/Pagination";

const TableThuHocPhi = () => {
  const {
    filteredStudents,
    setSelectedStudent,
    setShowDetailModal,
    setShowPaymentModal,
  } = useThuHocPhiContext();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-green-600 w-20 px-6 py-4 text-left text-sm font-semibold">
                Mã SV
              </th>
              <th className="sticky left-22 z-10 bg-green-600 px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                Họ và tên
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Lớp</th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                Hệ đào tạo
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Tổng học phí
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Đã đóng
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Còn lại
              </th>
              <th className="px-6 py-4 text-center whitespace-nowrap text-sm font-semibold">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Hạn đóng
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="sticky left-0 z-10 bg-inherit w-20 px-6 py-4 text-sm font-medium text-gray-900">
                  {student.id}
                </td>
                <td className="sticky left-22 z-10 bg-inherit px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <HeDaoTaoBadge value={student.system} />
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(student.totalFee)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-green-600">
                  {formatCurrency(student.paid)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-red-600">
                  {formatCurrency(student.remaining)}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <BadgeTrangThaiHocPhi
                    status={student.status as EnumTrangThaiHocPhi}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {new Date(student.dueDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {student.status !== "paid" && (
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowPaymentModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Thu học phí"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="In biên lai"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={1}
        onPageChange={() => console.log("Page changed")}
        pageSize={10}
        totalItems={100}
      />

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Không tìm thấy học viên nào</p>
        </div>
      )}
    </div>
  );
};

export default TableThuHocPhi;
