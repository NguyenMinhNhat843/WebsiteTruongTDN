import { useState } from "react";
import {
  DollarSign,
  Search,
  Filter,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Eye,
  Download,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  class: string;
  system: string;
  totalFee: number;
  paid: number;
  remaining: number;
  status: "paid" | "partial" | "unpaid";
  dueDate: string;
  phone: string;
  email: string;
  paymentHistory: Payment[];
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  receiver: string;
  note: string;
}

// Dữ liệu mẫu
const studentsData: Student[] = [
  {
    id: "SV001",
    name: "Nguyễn Văn An",
    class: "TCN21A",
    system: "Trung cấp nghề",
    totalFee: 12000000,
    paid: 12000000,
    remaining: 0,
    status: "paid",
    dueDate: "2026-03-15",
    phone: "0901234567",
    email: "nguyenvanan@email.com",
    paymentHistory: [
      {
        id: "P001",
        date: "2026-01-10",
        amount: 6000000,
        method: "Chuyển khoản",
        receiver: "Trần Thị B",
        note: "Học phí kỳ 1",
      },
      {
        id: "P002",
        date: "2026-02-15",
        amount: 6000000,
        method: "Tiền mặt",
        receiver: "Trần Thị B",
        note: "Học phí kỳ 2",
      },
    ],
  },
  {
    id: "SV002",
    name: "Trần Thị Bình",
    class: "SCN21B",
    system: "Sơ cấp nghề",
    totalFee: 8000000,
    paid: 4000000,
    remaining: 4000000,
    status: "partial",
    dueDate: "2026-04-20",
    phone: "0902345678",
    email: "tranthib@email.com",
    paymentHistory: [
      {
        id: "P003",
        date: "2026-01-15",
        amount: 4000000,
        method: "Chuyển khoản",
        receiver: "Trần Thị B",
        note: "Đợt 1",
      },
    ],
  },
  {
    id: "SV003",
    name: "Lê Văn Cường",
    class: "DHLK21A",
    system: "Đại học liên kết",
    totalFee: 15000000,
    paid: 0,
    remaining: 15000000,
    status: "unpaid",
    dueDate: "2026-04-10",
    phone: "0903456789",
    email: "levanc@email.com",
    paymentHistory: [],
  },
  {
    id: "SV004",
    name: "Phạm Thị Dung",
    class: "9PLUS21A",
    system: "Hệ 9+",
    totalFee: 10000000,
    paid: 5000000,
    remaining: 5000000,
    status: "partial",
    dueDate: "2026-04-25",
    phone: "0904567890",
    email: "phamthid@email.com",
    paymentHistory: [
      {
        id: "P004",
        date: "2026-02-01",
        amount: 5000000,
        method: "Tiền mặt",
        receiver: "Trần Thị B",
        note: "Đợt 1",
      },
    ],
  },
  {
    id: "SV005",
    name: "Hoàng Văn Em",
    class: "TCN21B",
    system: "Trung cấp nghề",
    totalFee: 12000000,
    paid: 8000000,
    remaining: 4000000,
    status: "partial",
    dueDate: "2026-04-15",
    phone: "0905678901",
    email: "hoangvane@email.com",
    paymentHistory: [
      {
        id: "P005",
        date: "2026-01-20",
        amount: 4000000,
        method: "Chuyển khoản",
        receiver: "Trần Thị B",
        note: "Đợt 1",
      },
      {
        id: "P006",
        date: "2026-03-01",
        amount: 4000000,
        method: "Tiền mặt",
        receiver: "Trần Thị B",
        note: "Đợt 2",
      },
    ],
  },
  {
    id: "SV006",
    name: "Võ Thị Phương",
    class: "SCN21C",
    system: "Sơ cấp nghề",
    totalFee: 8000000,
    paid: 0,
    remaining: 8000000,
    status: "unpaid",
    dueDate: "2026-04-05",
    phone: "0906789012",
    email: "vothip@email.com",
    paymentHistory: [],
  },
  {
    id: "SV007",
    name: "Đỗ Văn Giang",
    class: "TCN21C",
    system: "Trung cấp nghề",
    totalFee: 12000000,
    paid: 12000000,
    remaining: 0,
    status: "paid",
    dueDate: "2026-03-20",
    phone: "0907890123",
    email: "dovang@email.com",
    paymentHistory: [
      {
        id: "P007",
        date: "2026-01-05",
        amount: 12000000,
        method: "Chuyển khoản",
        receiver: "Trần Thị B",
        note: "Thanh toán toàn bộ",
      },
    ],
  },
  {
    id: "SV008",
    name: "Bùi Thị Hằng",
    class: "DHLK21B",
    system: "Đại học liên kết",
    totalFee: 15000000,
    paid: 7500000,
    remaining: 7500000,
    status: "partial",
    dueDate: "2026-04-30",
    phone: "0908901234",
    email: "buithih@email.com",
    paymentHistory: [
      {
        id: "P008",
        date: "2026-02-10",
        amount: 7500000,
        method: "Chuyển khoản",
        receiver: "Trần Thị B",
        note: "Đợt 1",
      },
    ],
  },
];

function TuitionFee() {
  const [students] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSystem, setFilterSystem] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNote, setPaymentNote] = useState("");

  // Tính toán thống kê
  const stats = {
    totalStudents: students.length,
    totalRevenue: students.reduce((sum, s) => sum + s.paid, 0),
    totalRemaining: students.reduce((sum, s) => sum + s.remaining, 0),
    paidStudents: students.filter((s) => s.status === "paid").length,
    partialStudents: students.filter((s) => s.status === "partial").length,
    unpaidStudents: students.filter((s) => s.status === "unpaid").length,
  };

  // Lọc danh sách
  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSystem =
      filterSystem === "all" || student.system === filterSystem;
    const matchStatus =
      filterStatus === "all" || student.status === filterStatus;

    return matchSearch && matchSystem && matchStatus;
  });

  const handlePayment = () => {
    if (!selectedStudent || !paymentAmount) return;

    // Logic xử lý thanh toán sẽ được thêm vào đây
    alert(
      `Đã thu ${formatCurrency(Number(paymentAmount))} từ ${selectedStudent.name}`,
    );
    setShowPaymentModal(false);
    setPaymentAmount("");
    setPaymentNote("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: {
        label: "Đã đóng",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      partial: {
        label: "Đóng 1 phần",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      unpaid: {
        label: "Chưa đóng",
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

  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      "Trung cấp nghề": "text-blue-600",
      "Sơ cấp nghề": "text-green-600",
      "Đại học liên kết": "text-purple-600",
      "Hệ 9+": "text-orange-600",
    };
    return colors[system] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản Lý Thu Học Phí
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý thu học phí toàn trường
              </p>
            </div>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </div>
                <div className="text-xs text-gray-500">học viên</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              Tổng số học viên
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="text-xs text-green-100">đã thu</div>
              </div>
            </div>
            <div className="text-sm font-medium">Tổng đã thu</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalRemaining)}
                </div>
                <div className="text-xs text-orange-100">còn lại</div>
              </div>
            </div>
            <div className="text-sm font-medium">Tổng còn nợ</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Trạng thái thanh toán
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Đã đóng đủ:</span>
                <span className="font-semibold text-green-600">
                  {stats.paidStudents} SV
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Đóng 1 phần:</span>
                <span className="font-semibold text-yellow-600">
                  {stats.partialStudents} SV
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Chưa đóng:</span>
                <span className="font-semibold text-red-600">
                  {stats.unpaidStudents} SV
                </span>
              </div>
            </div>
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
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tất cả hệ đào tạo</option>
              <option value="Trung cấp nghề">Trung cấp nghề</option>
              <option value="Sơ cấp nghề">Sơ cấp nghề</option>
              <option value="Đại học liên kết">Đại học liên kết</option>
              <option value="Hệ 9+">Hệ 9+</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="paid">Đã đóng đủ</option>
              <option value="partial">Đóng 1 phần</option>
              <option value="unpaid">Chưa đóng</option>
            </select>

            <div className="ml-auto flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã SV, lớp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-sm bg-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Bảng danh sách học viên */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mã SV
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Họ và tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Lớp
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
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
                  <th className="px-6 py-4 text-center text-sm font-semibold">
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {student.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.class}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${getSystemColor(student.system)}`}
                      >
                        {student.system}
                      </span>
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
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(student.status)}
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

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không tìm thấy học viên nào</p>
            </div>
          )}
        </div>

        {/* Modal thu học phí */}
        {showPaymentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Thu Học Phí</h2>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedStudent(null);
                      setPaymentAmount("");
                      setPaymentNote("");
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-green-100">
                  Học viên: {selectedStudent.name}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">Tổng học phí:</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(selectedStudent.totalFee)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Đã đóng:</div>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(selectedStudent.paid)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-600">Còn lại:</div>
                      <div className="font-bold text-red-600 text-lg">
                        {formatCurrency(selectedStudent.remaining)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền thu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                    <option value="card">Thẻ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedStudent(null);
                      setPaymentAmount("");
                      setPaymentNote("");
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!paymentAmount}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận thu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal chi tiết học phí */}
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Chi Tiết Học Phí</h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedStudent(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Thông tin học viên */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Thông tin học viên
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Mã SV:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lớp:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.class}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Hệ:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.system}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">SĐT:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tổng quan học phí */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      Tổng học phí
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedStudent.totalFee)}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-600 mb-1">Đã đóng</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedStudent.paid)}
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-600 mb-1">Còn lại</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(selectedStudent.remaining)}
                    </div>
                  </div>
                </div>

                {/* Lịch sử thanh toán */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Lịch sử thanh toán
                  </h3>
                  {selectedStudent.paymentHistory.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(payment.amount)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Mã: {payment.id}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-700">
                                {new Date(payment.date).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {payment.method}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Thu ngân: {payment.receiver}</div>
                            {payment.note && (
                              <div className="text-xs text-gray-500 mt-1">
                                Ghi chú: {payment.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Chưa có lịch sử thanh toán</p>
                    </div>
                  )}
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  <button className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <Printer className="w-4 h-4" />
                    In biên lai
                  </button>
                  <button className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Xuất PDF
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

export default TuitionFee;
