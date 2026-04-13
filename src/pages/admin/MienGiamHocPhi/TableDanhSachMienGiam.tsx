import { CheckCircle, Eye, FileText } from "lucide-react";
import { formatCurrency } from "../../../util/format";
import { useExemtionContext } from "./ExemtionProvider";
import BadgeStatusExemtion from "../../../components/ui/BadgeStatusExemtion";

const TableDanhSachMienGiam = () => {
  const {
    filteredExemptions,
    setSelectedExemption,
    setShowDetailModal,
    setShowReviewModal,
    getTypeColor,
  } = useExemtionContext();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-purple-600 to-pink-600 text-white">
            <tr>
              <th className="sticky left-0 bg-purple-600 w-20 px-6 py-4 text-left text-sm font-semibold">
                Mã đơn
              </th>
              <th className="sticky left-24.5 bg-purple-600 px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                Học viên
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                Lớp/Hệ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                Loại miễn giảm
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Tổng học phí
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                % Giảm
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Số tiền giảm
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Ngày đăng ký
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExemptions.map((exemption, index) => (
              <tr
                key={exemption.id}
                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="sticky left-0 bg-inherit w-20 px-6 py-4 text-sm font-medium text-gray-900">
                  {exemption.id}
                </td>
                <td className="sticky left-24.5 bg-inherit px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {exemption.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exemption.studentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {exemption.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{exemption.class}</div>
                  <div className="text-xs text-gray-500">
                    {exemption.system}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(exemption.type)}`}
                  >
                    {exemption.typeLabel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(exemption.totalFee)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {exemption.percentage}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-600">
                  {formatCurrency(exemption.amount)}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <BadgeStatusExemtion status={exemption.status} />
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {new Date(exemption.requestDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedExemption(exemption);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {exemption.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedExemption(exemption);
                          setShowReviewModal(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Phê duyệt"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExemptions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Không tìm thấy đơn miễn giảm nào</p>
        </div>
      )}
    </div>
  );
};

export default TableDanhSachMienGiam;
