import { useState } from "react";
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

interface Exemption {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  system: string;
  type: string;
  typeLabel: string;
  amount: number;
  percentage: number;
  reason: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  reviewDate?: string;
  reviewer?: string;
  reviewNote?: string;
  phone: string;
  totalFee: number;
}

// Dữ liệu mẫu
const exemptionsData: Exemption[] = [
  {
    id: "MG001",
    studentId: "SV001",
    studentName: "Nguyễn Văn An",
    class: "TCN21A",
    system: "Trung cấp nghề",
    type: "policy",
    typeLabel: "Con gia đình chính sách",
    amount: 6000000,
    percentage: 50,
    reason: "Con liệt sĩ, có giấy xác nhận từ UBND xã",
    documents: ["Giấy khai sinh", "Giấy xác nhận liệt sĩ", "Sổ hộ khẩu"],
    status: "approved",
    requestDate: "2026-01-10",
    reviewDate: "2026-01-15",
    reviewer: "Trần Văn B",
    reviewNote: "Đủ điều kiện, phê duyệt",
    phone: "0901234567",
    totalFee: 12000000,
  },
  {
    id: "MG002",
    studentId: "SV002",
    studentName: "Trần Thị Bình",
    class: "SCN21B",
    system: "Sơ cấp nghề",
    type: "difficult",
    typeLabel: "Hoàn cảnh khó khăn",
    amount: 4000000,
    percentage: 50,
    reason: "Gia đình khó khăn, có giấy xác nhận hộ nghèo",
    documents: ["Giấy xác nhận hộ nghèo", "Sổ hộ khẩu"],
    status: "pending",
    requestDate: "2026-04-05",
    phone: "0902345678",
    totalFee: 8000000,
  },
  {
    id: "MG003",
    studentId: "SV003",
    studentName: "Lê Văn Cường",
    class: "DHLK21A",
    system: "Đại học liên kết",
    type: "excellent",
    typeLabel: "Học sinh giỏi",
    amount: 3000000,
    percentage: 20,
    reason: "Học sinh giỏi cấp tỉnh năm 2025",
    documents: ["Bằng khen học sinh giỏi", "Bảng điểm THPT"],
    status: "approved",
    requestDate: "2026-01-20",
    reviewDate: "2026-01-22",
    reviewer: "Trần Văn B",
    reviewNote: "Thành tích xuất sắc, được miễn giảm",
    phone: "0903456789",
    totalFee: 15000000,
  },
  {
    id: "MG004",
    studentId: "SV004",
    studentName: "Phạm Thị Dung",
    class: "9PLUS21A",
    system: "Hệ 9+",
    type: "orphan",
    typeLabel: "Trẻ mồ côi",
    amount: 10000000,
    percentage: 100,
    reason: "Mồ côi cả cha lẫn mẹ, đang ở trại trẻ mồ côi",
    documents: ["Giấy xác nhận mồ côi", "Giấy xác nhận từ trại"],
    status: "approved",
    requestDate: "2026-02-01",
    reviewDate: "2026-02-03",
    reviewer: "Trần Văn B",
    reviewNote: "Miễn 100% học phí",
    phone: "0904567890",
    totalFee: 10000000,
  },
  {
    id: "MG005",
    studentId: "SV005",
    studentName: "Hoàng Văn Em",
    class: "TCN21B",
    system: "Trung cấp nghề",
    type: "ethnic",
    typeLabel: "Dân tộc thiểu số",
    amount: 3600000,
    percentage: 30,
    reason: "Dân tộc thiểu số vùng cao",
    documents: ["CMND/CCCD", "Giấy xác nhận dân tộc"],
    status: "pending",
    requestDate: "2026-04-08",
    phone: "0905678901",
    totalFee: 12000000,
  },
  {
    id: "MG006",
    studentId: "SV006",
    studentName: "Võ Thị Phương",
    class: "SCN21C",
    system: "Sơ cấp nghề",
    type: "disability",
    typeLabel: "Người khuyết tật",
    amount: 6400000,
    percentage: 80,
    reason: "Khuyết tật vận động, có sổ khuyết tật",
    documents: ["Sổ khuyết tật", "Giấy khám sức khỏe"],
    status: "rejected",
    requestDate: "2026-03-15",
    reviewDate: "2026-03-20",
    reviewer: "Trần Văn B",
    reviewNote: "Hồ sơ không đầy đủ, cần bổ sung",
    phone: "0906789012",
    totalFee: 8000000,
  },
  {
    id: "MG007",
    studentId: "SV007",
    studentName: "Đỗ Văn Giang",
    class: "TCN21C",
    system: "Trung cấp nghề",
    type: "policy",
    typeLabel: "Con gia đình chính sách",
    amount: 4800000,
    percentage: 40,
    reason: "Con thương binh hạng 1/4",
    documents: ["Sổ thương binh của cha", "Giấy khai sinh"],
    status: "pending",
    requestDate: "2026-04-09",
    phone: "0907890123",
    totalFee: 12000000,
  },
];

const exemptionTypes = [
  { value: "all", label: "Tất cả loại", color: "gray" },
  { value: "policy", label: "Gia đình chính sách", color: "red" },
  { value: "difficult", label: "Hoàn cảnh khó khăn", color: "orange" },
  { value: "excellent", label: "Học sinh giỏi", color: "yellow" },
  { value: "orphan", label: "Trẻ mồ côi", color: "purple" },
  { value: "ethnic", label: "Dân tộc thiểu số", color: "blue" },
  { value: "disability", label: "Người khuyết tật", color: "pink" },
];

function ExemptionManagement() {
  const [exemptions] = useState<Exemption[]>(exemptionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedExemption, setSelectedExemption] = useState<Exemption | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Tính toán thống kê
  const stats = {
    totalExemptions: exemptions.length,
    totalAmount: exemptions
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0),
    pendingCount: exemptions.filter((e) => e.status === "pending").length,
    approvedCount: exemptions.filter((e) => e.status === "approved").length,
    rejectedCount: exemptions.filter((e) => e.status === "rejected").length,
  };

  // Thống kê theo loại
  const typeStats = exemptionTypes.slice(1).map((type) => {
    const items = exemptions.filter(
      (e) => e.type === type.value && e.status === "approved",
    );
    return {
      type: type.label,
      count: items.length,
      amount: items.reduce((sum, e) => sum + e.amount, 0),
      color: type.color,
    };
  });

  // Lọc danh sách
  const filteredExemptions = exemptions.filter((exemption) => {
    const matchSearch =
      exemption.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exemption.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exemption.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = filterType === "all" || exemption.type === filterType;
    const matchStatus =
      filterStatus === "all" || exemption.status === filterStatus;

    return matchSearch && matchType && matchStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        label: "Chờ duyệt",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      approved: {
        label: "Đã duyệt",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      rejected: {
        label: "Từ chối",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Đăng ký miễn giảm
            </button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalExemptions}
                </div>
                <div className="text-xs text-gray-500">đơn</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">Tổng số đơn</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalAmount)}
                </div>
                <div className="text-xs text-green-100">đã miễn giảm</div>
              </div>
            </div>
            <div className="text-sm font-medium">Tổng miễn giảm</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.pendingCount}</div>
                <div className="text-xs text-yellow-100">đơn</div>
              </div>
            </div>
            <div className="text-sm font-medium">Chờ phê duyệt</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Trạng thái xử lý
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Đã duyệt:</span>
                <span className="font-semibold text-green-600">
                  {stats.approvedCount} đơn
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Chờ duyệt:</span>
                <span className="font-semibold text-yellow-600">
                  {stats.pendingCount} đơn
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Từ chối:</span>
                <span className="font-semibold text-red-600">
                  {stats.rejectedCount} đơn
                </span>
              </div>
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
            {typeStats.map((stat, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {stat.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    {stat.count} SV
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(stat.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {exemptionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>

            <div className="ml-auto flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã SV, mã đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-sm bg-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Bảng danh sách miễn giảm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Học viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Lớp/Hệ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
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
                  <th className="px-6 py-4 text-center text-sm font-semibold">
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {exemption.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {exemption.class}
                      </div>
                      <div className="text-xs text-gray-500">
                        {exemption.system}
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(exemption.status)}
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0">
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
                    {getStatusBadge(selectedExemption.status)}
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0">
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
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-medium">
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
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
