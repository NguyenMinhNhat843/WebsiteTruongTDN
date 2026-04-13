import {
  Gift,
  Search,
  Filter,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  TrendingDown,
  Award,
  AlertCircle,
  Download,
} from "lucide-react";
import { exemptionTypes } from "./mockData";
import { ExemtionProvider, useExemtionContext } from "./ExemtionProvider";
import { formatCurrency } from "../../../util/format";
import BadgeStatusExemtion from "../../../components/ui/BadgeStatusExemtion";
import Input from "../../../components/ui/Form/Input";

const ExemptionManagement = () => {
  return (
    <ExemtionProvider>
      <Inner />
    </ExemtionProvider>
  );
};

function Inner() {
  const {
    filterStatus,
    filterType,
    searchQuery,
    selectedExemption,
    setFilterStatus,
    setFilterType,
    setSearchQuery,
    setSelectedExemption,
    setShowDetailModal,
    setShowRegisterModal,
    setShowReviewModal,
    showDetailModal,
    showRegisterModal,
    showReviewModal,
    stats,
    typeStats,
    filteredExemptions,
  } = useExemtionContext();

  const getTypeColor = (type: string) => {
    const typeInfo = exemptionTypes.find((t) => t.value === type);
    const colorMap: Record<string, string> = {
      red: "bg-red-100 text-red-700 border-red-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      pink: "bg-pink-100 text-pink-700 border-pink-300",
    };
    return colorMap[typeInfo?.color || "gray"] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-400 mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản Lý Miễn Giảm Học Phí
                </h1>
                <p className="text-gray-600">
                  Đăng ký và phê duyệt miễn giảm học phí
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Đăng ký miễn giảm
            </button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Tổng số đơn",
              val: stats.totalExemptions,
              unit: "đơn",
              Icon: FileText,
              css: "bg-white border-gray-200 text-gray-900",
              iconBg: "bg-purple-100 text-purple-600",
            },
            {
              label: "Tổng miễn giảm",
              val: formatCurrency(stats.totalAmount),
              unit: "đã miễn giảm",
              Icon: TrendingDown,
              css: "bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg",
              iconBg: "bg-white/20",
            },
            {
              label: "Chờ phê duyệt",
              val: stats.pendingCount,
              unit: "đơn",
              Icon: Clock,
              css: "bg-linear-to-br from-yellow-500 to-orange-600 text-white shadow-lg",
              iconBg: "bg-white/20",
            },
          ].map((item, i) => {
            return (
              <div key={i} className={`${item.css} rounded-xl p-6 border`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${item.iconBg}`}>
                    <item.Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{item.val}</div>
                    <div className="text-xs opacity-70">{item.unit}</div>
                  </div>
                </div>
                <div className="text-md font-semibold tracking-wide">
                  {item.label}
                </div>
              </div>
            );
          })}

          {/* Card Trạng thái xử lý - Giữ riêng vì cấu trúc khác biệt hoàn toàn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Trạng thái xử lý
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Đã duyệt",
                  val: stats.approvedCount,
                  color: "text-green-600",
                },
                {
                  label: "Chờ duyệt",
                  val: stats.pendingCount,
                  color: "text-yellow-600",
                },
                {
                  label: "Từ chối",
                  val: stats.rejectedCount,
                  color: "text-red-600",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600">{s.label}:</span>
                  <span className={`font-semibold ${s.color}`}>
                    {s.val} đơn
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thống kê theo loại miễn giảm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Thống kê theo loại miễn giảm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeStats.map(({ type, count, amount }, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all bg-gray-50/30"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-600 truncate mr-2">
                    {type}
                  </span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap text-[11px]">
                    {count} SV
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Label & Filter Icon */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-5 h-5 text-gray-500" />
              <span>Bộ lọc:</span>
            </div>

            {/* Các Select filters */}
            {[
              { val: filterType, set: setFilterType, options: exemptionTypes },
              {
                val: filterStatus,
                set: setFilterStatus,
                options: [
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "approved", label: "Đã duyệt" },
                  { value: "rejected", label: "Từ chối" },
                ],
              },
            ].map((f, i) => (
              <select
                key={i}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}

            {/* Ô Tìm kiếm */}
            <Input
              icon={Search}
              placeholder="Tìm theo tên, mã SV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="w-md ml-auto"
            />
          </div>
        </div>

        {/* Bảng danh sách miễn giảm */}
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
                      <div className="text-sm text-gray-900">
                        {exemption.class}
                      </div>
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
                      {new Date(exemption.requestDate).toLocaleDateString(
                        "vi-VN",
                      )}
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

        {/* Modal chi tiết */}
        {showDetailModal && selectedExemption && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-linear-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Chi Tiết Miễn Giảm</h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedExemption(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-purple-100">
                  Mã đơn: {selectedExemption.id}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Thông tin học viên */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Thông tin học viên
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Mã SV:</span>
                      <span className="ml-2 font-medium">
                        {selectedExemption.studentId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="ml-2 font-medium">
                        {selectedExemption.studentName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lớp:</span>
                      <span className="ml-2 font-medium">
                        {selectedExemption.class}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Hệ:</span>
                      <span className="ml-2 font-medium">
                        {selectedExemption.system}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">SĐT:</span>
                      <span className="ml-2 font-medium">
                        {selectedExemption.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin miễn giảm */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Thông tin miễn giảm
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại miễn giảm:</span>
                      <span className="font-medium">
                        {selectedExemption.typeLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng học phí:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedExemption.totalFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ giảm:</span>
                      <span className="font-bold text-purple-600">
                        {selectedExemption.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-300">
                      <span className="text-gray-900 font-semibold">
                        Số tiền được giảm:
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatCurrency(selectedExemption.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lý do */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Lý do đăng ký
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedExemption.reason}
                  </p>
                </div>

                {/* Hồ sơ đính kèm */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Hồ sơ đính kèm
                  </h3>
                  <div className="space-y-2">
                    {selectedExemption.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">{doc}</span>
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          Tải về
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trạng thái và xét duyệt */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Trạng thái</h3>
                    <BadgeStatusExemtion status={selectedExemption.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đăng ký:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedExemption.requestDate,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    {selectedExemption.reviewDate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày xét duyệt:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedExemption.reviewDate,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Người xét duyệt:
                          </span>
                          <span className="font-medium">
                            {selectedExemption.reviewer}
                          </span>
                        </div>
                        {selectedExemption.reviewNote && (
                          <div className="pt-2 border-t border-blue-300">
                            <span className="text-gray-600">Ghi chú:</span>
                            <p className="mt-1 text-gray-700">
                              {selectedExemption.reviewNote}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  {selectedExemption.status === "pending" && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowReviewModal(true);
                      }}
                      className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      Phê duyệt
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal đăng ký miễn giảm */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-linear-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">
                    Đăng Ký Miễn Giảm Học Phí
                  </h2>
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">
                      Lưu ý khi đăng ký miễn giảm:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Chuẩn bị đầy đủ hồ sơ chứng minh</li>
                      <li>Thông tin phải chính xác và trung thực</li>
                      <li>Thời gian xét duyệt: 3-5 ngày làm việc</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã học viên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: SV001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: TCN21A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại miễn giảm <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Chọn loại miễn giảm</option>
                    {exemptionTypes.slice(1).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do đăng ký <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập lý do chi tiết..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hồ sơ đính kèm <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Kéo thả file hoặc click để chọn
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ: PDF, JPG, PNG (Tối đa 5MB)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button className="flex-1 px-4 py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-medium">
                    Gửi đơn đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal phê duyệt */}
        {showReviewModal && selectedExemption && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-linear-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Phê Duyệt Miễn Giảm</h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedExemption(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-purple-100">
                  Mã đơn: {selectedExemption.id}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">Học viên:</span>{" "}
                      <span className="font-medium">
                        {selectedExemption.studentName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loại:</span>{" "}
                      <span className="font-medium">
                        {selectedExemption.typeLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Số tiền giảm:</span>{" "}
                      <span className="font-bold text-green-600">
                        {formatCurrency(selectedExemption.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú xét duyệt
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert(`Từ chối đơn ${selectedExemption.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      alert(`Phê duyệt đơn ${selectedExemption.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExemptionManagement;
