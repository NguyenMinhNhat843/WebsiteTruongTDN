import { useState } from "react";
import {
  Users,
  FileText,
  GaugeCircle,
  UserPlus,
  FileCheck,
  CreditCard,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "./components/StatCard";
import ShortcutCard from "./components/ShortCutCard";
import { useNavigate } from "react-router-dom";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import MajorDistributionChart from "./components/MajorDistributionChart";
import AcademicPerformanceChart from "./components/AcademicPerfomanceChart";

type ChartTab = "growth" | "major" | "performance";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useAppContext();
  const [activeTab, setActiveTab] = useState<ChartTab>("growth");

  // --- GET API ---
  const { data: statisOverview, isLoading: isLoadingOverview } = $api.useQuery(
    "get",
    "/analytics/overview",
  );

  const { data: growthCharts, isLoading: isLoadingGrowthCharts } =
    $api.useQuery("get", "/analytics/growth-charts");

  // API Cập nhật DTO mới
  const { data: operationDetails, isLoading: isLoadingOperations } =
    $api.useQuery("get", "/analytics/operation-details");

  // API mới 1: Tỷ trọng ngành học (Pie Chart)
  const { data: majorDistribution, isLoading: isLoadingMajor } = $api.useQuery(
    "get",
    "/analytics/major-distribution",
  );

  // API mới 2: Tình hình học lực theo lớp (Stacked Bar Chart)
  const { data: academicPerformance, isLoading: isLoadingPerformance } =
    $api.useQuery("get", "/analytics/academic-performance");

  // Biến đổi cấu trúc data từ API chart cũ
  const chartData =
    growthCharts?.registerGrowth.map((item, index) => {
      const studyingItem = growthCharts.studyingGrowth?.[index];
      return {
        name: item.month,
        "Học viên mới": item.count,
        "Đang học": studyingItem ? studyingItem.count : 0,
      };
    }) || [];

  // Helper định dạng tiền tệ VNĐ
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col p-8">
        <main className="flex-1">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Chào buổi sáng, {profile?.fullName || "Admin"} 👋
              </h2>
              <p className="text-gray-500">
                Dưới đây là cập nhật mới nhất về hệ thống của bạn.
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-xl border border-blue-200 self-start md:self-auto text-sm shadow-sm flex items-center gap-2">
              <ClipboardCheck size={16} />
              {operationDetails?.semesterName || "Đang tải học kỳ..."}
            </div>
          </div>

          {/* 1. Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoadingOverview ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"
                />
              ))
            ) : (
              <>
                <StatCard
                  icon={Users}
                  title="Tổng học sinh"
                  value={statisOverview?.totalStudents?.toLocaleString() || "0"}
                  color="bg-blue-500"
                  sub={<span className="text-gray-400">Tất cả trạng thái</span>}
                />

                <StatCard
                  icon={GaugeCircle}
                  title="Giảng viên"
                  value={statisOverview?.totalTeachers?.toLocaleString() || "0"}
                  color="bg-purple-500"
                  sub={<span className="text-gray-400">Đang công tác</span>}
                />

                <StatCard
                  icon={FileText}
                  title="Học viên mới đăng ký"
                  value={
                    statisOverview?.registerStudents?.toLocaleString() || "0"
                  }
                  color="bg-orange-500"
                  sub={<span className="text-gray-400">Chờ duyệt tư vấn</span>}
                />

                <StatCard
                  icon={GraduationCap}
                  title="Học viên đang học"
                  value={
                    statisOverview?.studyingStudents?.toLocaleString() || "0"
                  }
                  color="bg-emerald-500"
                  sub={
                    <span className="text-gray-400">
                      Đang đợi xét tuyển:{" "}
                      <strong className="text-amber-600">
                        {statisOverview?.pendingStudents || 0}
                      </strong>
                    </span>
                  }
                />
              </>
            )}
          </div>

          {/* 2. Advanced Actionable Widgets (Đã cập nhật theo DTO mới) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Card Vận hành Lớp học */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-700 text-sm tracking-wide uppercase">
                    Vận hành & Sĩ số
                  </h4>
                  <span className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                    Lấp đầy: {operationDetails?.classrooms?.schoolFillRate || 0}
                    %
                  </span>
                </div>

                {isLoadingOperations ? (
                  <div className="h-24 bg-slate-50 animate-pulse rounded-xl" />
                ) : (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      Trạng thái lớp hoạt động:
                    </div>
                    <div className="text-base font-bold text-gray-800 mb-3">
                      {operationDetails?.classrooms?.totalActiveClasses || 0}{" "}
                      lớp học đang chạy
                    </div>

                    <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-gray-500 font-medium">
                          Tổng số chỗ ngồi:
                        </span>
                        <span className="text-gray-800 font-bold">
                          {(
                            operationDetails?.classrooms
                              ?.totalCurrentStudents || 0
                          ).toLocaleString()}
                          <span className="text-gray-400 font-normal"> / </span>
                          {(
                            operationDetails?.classrooms?.totalMaxStudents || 0
                          ).toLocaleString()}{" "}
                          HS
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-500"
                          style={{
                            width: `${operationDetails?.classrooms?.schoolFillRate || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {(operationDetails?.classrooms?.overloadedClassesCount ||
                      0) > 0 ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                        <div className="flex items-center gap-2 text-red-700 text-xs font-bold mb-1.5">
                          <AlertTriangle size={14} />
                          Cảnh báo{" "}
                          {operationDetails?.classrooms
                            ?.overloadedClassesCount || 0}{" "}
                          lớp quá tải:
                        </div>
                        <div className="max-h-20 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                          {operationDetails?.classrooms?.overloadedClasses?.map(
                            (c: any, index: number) => (
                              <div
                                key={index}
                                className="text-xs text-red-600 flex justify-between items-center"
                              >
                                <span>• Lớp {c.className}</span>
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[10px]">
                                  {c.size} HS
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Sĩ số các lớp học đều nằm trong ngưỡng an toàn.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Card Tài chính Học phí - Chỉ số chính (Thay thế cho Tuyển sinh cũ) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-700 text-sm tracking-wide uppercase">
                    Tình hình Học phí
                  </h4>
                  <DollarSign size={18} className="text-emerald-500" />
                </div>

                {isLoadingOperations ? (
                  <div className="h-24 bg-slate-50 animate-pulse rounded-xl" />
                ) : operationDetails?.finance ? (
                  <div>
                    <div
                      className="text-xs text-gray-400 mb-0.5 truncate"
                      title={operationDetails.finance.periodName}
                    >
                      Đợt hiện tại: {operationDetails.finance.periodName}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Hạn chót:{" "}
                      {new Date(
                        operationDetails.finance.endDate,
                      ).toLocaleDateString("vi-VN")}
                    </div>

                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {formatVND(
                        operationDetails.finance.metrics.totalCollected,
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mb-3">
                      Đã thu thành công (
                      {operationDetails.finance.metrics.collectionRate}%)
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Phải thu:</span>
                        <span className="font-semibold text-gray-700">
                          {formatVND(
                            operationDetails.finance.metrics.totalInvoiced,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-500">Còn nợ:</span>
                        <span className="font-semibold text-red-600">
                          {formatVND(
                            operationDetails.finance.metrics.totalRemaining,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 text-center py-8">
                    Chưa kích hoạt hoặc thiết lập đợt thu học phí nào.
                  </div>
                )}
              </div>
            </div>

            {/* Card Tài chính Học phí - Trạng thái hóa đơn & Giao dịch gần đây (Thay thế cho Nề nếp cũ) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-700 text-sm tracking-wide uppercase">
                    Giao dịch gần đây
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {isLoadingOperations ? (
                  <div className="h-24 bg-slate-50 animate-pulse rounded-xl" />
                ) : operationDetails?.finance ? (
                  <div className="space-y-3">
                    {/* Phân phối hóa đơn */}
                    <div className="flex justify-between gap-1 text-[11px] text-center bg-gray-50 p-2 rounded-xl">
                      <div className="flex-1 border-r border-gray-200">
                        <span className="block font-bold text-emerald-600">
                          {operationDetails.finance.statusDistribution.paid}
                        </span>
                        <span className="text-gray-400">Đã đóng</span>
                      </div>
                      <div className="flex-1 border-r border-gray-200">
                        <span className="block font-bold text-amber-600">
                          {operationDetails.finance.statusDistribution.partial}
                        </span>
                        <span className="text-gray-400">Một phần</span>
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-red-500">
                          {operationDetails.finance.statusDistribution.unpaid}
                        </span>
                        <span className="text-gray-400">Chưa đóng</span>
                      </div>
                    </div>

                    {/* Danh sách 3/5 giao dịch gần đây rút gọn cho vừa widget */}
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-0.5 custom-scrollbar">
                      {operationDetails.finance.recentPayments
                        ?.slice(0, 3)
                        .map((payment: any) => (
                          <div
                            key={payment.id}
                            className="flex justify-between items-center text-xs p-1.5 bg-white border border-slate-100 rounded-lg shadow-sm"
                          >
                            <div className="truncate pr-2">
                              <span className="font-medium text-gray-800 block truncate">
                                {payment.studentName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {payment.studentCode} • {payment.method}
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-bold text-emerald-600 block">
                                +{formatVND(payment.amountPaid)}
                              </span>
                            </div>
                          </div>
                        ))}
                      {operationDetails.finance.recentPayments?.length ===
                        0 && (
                        <div className="text-center text-gray-400 py-2 text-[11px]">
                          Chưa có giao dịch nào phát sinh.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 text-center py-8">
                    Kỳ hiện tại không có dữ liệu giao dịch học phí.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Tabbed Chart Section */}
          <div className="w-full mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              {/* Tabs list Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                <h3 className="font-bold text-gray-700">
                  Thống kê & Biểu đồ học viện
                </h3>

                {/* Tab buttons */}
                <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("growth")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "growth"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <TrendingUp size={14} />
                    Tăng trưởng
                  </button>
                  <button
                    onClick={() => setActiveTab("major")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "major"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <PieIcon size={14} />
                    Tỷ trọng ngành học
                  </button>
                  <button
                    onClick={() => setActiveTab("performance")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "performance"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <BarChart3 size={14} />
                    Học lực theo lớp
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-80 w-full">
                {/* Tab 1: Biểu đồ Tăng trưởng */}
                {activeTab === "growth" && (
                  <>
                    {isLoadingGrowthCharts ? (
                      <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
                        Đang tải dữ liệu tăng trưởng...
                      </div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                          />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Legend verticalAlign="top" height={36} />
                          <Line
                            type="monotone"
                            dataKey="Học viên mới"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Đang học"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Không có dữ liệu tăng trưởng.
                      </div>
                    )}
                  </>
                )}

                {/* Tab 2: Biểu đồ Tỷ trọng Ngành học */}
                {activeTab === "major" && (
                  <MajorDistributionChart
                    data={majorDistribution}
                    isLoading={isLoadingMajor}
                  />
                )}

                {/* Tab 3: Biểu đồ Học lực theo lớp */}
                {activeTab === "performance" && (
                  <AcademicPerformanceChart
                    data={academicPerformance}
                    isLoading={isLoadingPerformance}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Shortcuts */}
        <div className="grid py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ShortcutCard
            icon={UserPlus}
            label="Tiếp nhận học viên"
            bgColor="bg-blue-600"
            onClick={() => navigate("/admin/hoc-sing/ho-so")}
          />
          <ShortcutCard
            icon={FileCheck}
            label="Duyệt kết quả"
            bgColor="bg-emerald-600"
            onClick={() => navigate("/admin/dao-tao/diem-thi")}
          />
          <ShortcutCard
            icon={CreditCard}
            label="Thu học phí"
            bgColor="bg-orange-500"
            onClick={() => navigate("/admin/tai-chinh/thu-hoc-phi")}
          />
          <ShortcutCard
            icon={ClipboardList}
            label="Thời khóa biểu"
            bgColor="bg-purple-600"
            onClick={() => navigate("/admin/dao-tao/thoi-khoa-bieu")}
          />
          <ShortcutCard
            icon={MessageSquare}
            label="Gửi thông báo"
            bgColor="bg-rose-500"
          />
          <ShortcutCard
            icon={ShieldCheck}
            label="Phân quyền"
            bgColor="bg-slate-700"
            onClick={() => navigate("/admin/cai-dat/phan-quyen")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
