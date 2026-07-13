import { useState, useEffect } from "react";
import { $api } from "../../../../api/client";
// Giả định $api được import từ file cấu hình openapi-react-query của bạn

export default function TuitionDashboard() {
  // 1. Lấy danh sách các đợt thu học phí để làm bộ lọc
  const { data: tuitionPeriods, isLoading: isLoadingPeriods } = $api.useQuery(
    "get",
    "/tuition-periods",
  );

  // State lưu id đợt học phí đang được chọn
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | undefined>(
    undefined,
  );

  // Tự động chọn đợt học phí đầu tiên khi danh sách tải xong
  useEffect(() => {
    if (tuitionPeriods && tuitionPeriods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(tuitionPeriods[0].id);
    }
  }, [tuitionPeriods, selectedPeriodId]);

  // 2. Call API Tổng quan (Truyền periodId qua query params)
  const { data: overview, isLoading: isOverviewLoading } = $api.useQuery(
    "get",
    "/tuition-dashboard/tuition-overview",
    {
      params: {
        query: { periodId: selectedPeriodId as number },
      },
    },
    {
      enabled: !!selectedPeriodId, // Chỉ chạy khi đã có selectedPeriodId
    },
  );

  // 3. Call API Biểu đồ dòng tiền (Truyền periodId qua query params)
  const { data: trend, isLoading: isTrendLoading } = $api.useQuery(
    "get",
    "/tuition-dashboard/payment-trend",
    {
      params: {
        query: { periodId: selectedPeriodId as number },
      },
    },
    {
      enabled: !!selectedPeriodId,
    },
  );

  // Hiển thị trạng thái loading khi đang tải danh sách bộ lọc hoặc dữ liệu tổng quan
  if (isLoadingPeriods || isOverviewLoading || isTrendLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-medium text-slate-500 bg-slate-50">
        Đang tải dữ liệu tài chính...
      </div>
    );
  }

  const kpis = overview?.kpis;

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      {/* HEADER & FILTER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tổng Quan Tài Chính
          </h1>
          <p className="text-sm text-slate-500">
            Theo dõi công nợ, doanh thu và tiến độ đóng học phí.
          </p>
        </div>

        {/* Bộ lọc Đợt học phí dùng dữ liệu thật từ API */}
        <select
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
          value={selectedPeriodId ?? ""}
          onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
        >
          {tuitionPeriods?.map((period) => (
            <option key={period.id} value={period.id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>

      {/* 1. KHU VỰC CHỈ SỐ KPI CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Tổng công nợ phát sinh
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(kpis?.totalBilled ?? 0).toLocaleString()}đ
          </p>
          <span className="mt-1 inline-block text-xs text-slate-400">
            Từ {kpis?.totalInvoices ?? 0} hóa đơn
          </span>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Thực thu (Đã thu)
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {(kpis?.totalCollected ?? 0).toLocaleString()}đ
          </p>
          <span className="mt-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
            Đạt {kpis?.collectionRate ?? 0}%
          </span>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Còn thiếu (Còn nợ)
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {(kpis?.totalOutstanding ?? 0).toLocaleString()}đ
          </p>
          <span className="mt-1 inline-block text-xs text-slate-400">
            Cần đôn đốc thu thêm
          </span>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Tỷ lệ hoàn thành đợt
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${kpis?.collectionRate ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-medium text-slate-600">
            {kpis?.collectionRate ?? 0}%
          </p>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ PHÂN PHỐI & PHƯƠNG THỨC */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Phân phối trạng thái hóa đơn */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Trạng thái hóa đơn học phí
          </h3>
          <div className="space-y-3">
            {overview?.statusDistribution?.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0"
              >
                <span className="text-sm font-medium capitalize text-slate-600">
                  {item.status === "paid"
                    ? "🟢 Đã hoàn thành"
                    : item.status === "partial"
                      ? "🟡 Mới đóng 1 phần"
                      : "🔴 Chưa đóng"}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.count} học sinh</p>
                  <p className="text-xs text-slate-400">
                    {item.amount.toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phương thức thanh toán phổ biến */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Dòng tiền qua các kênh thanh toán
          </h3>
          <div className="space-y-3">
            {overview?.paymentMethods?.map((item) => (
              <div
                key={item.method}
                className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0"
              >
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                  {item.method}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {item.amount.toLocaleString()}đ
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.count} giao dịch
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CHI TIẾT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Nhật ký giao dịch gần đây */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Giao dịch thành công gần đây
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                  <th className="pb-3">Mã HS</th>
                  <th className="pb-3">Kênh</th>
                  <th className="pb-3 text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {overview?.recentPayments?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-medium text-slate-900">
                      HS-{p.student?.id}
                    </td>
                    <td className="py-3 text-slate-500">{p.method}</td>
                    <td className="py-3 text-right font-semibold text-emerald-600">
                      +{p.amountPaid.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danh sách nợ nhiều nhất */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Học sinh nợ học phí nhiều nhất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                  <th className="pb-3">Mã HS</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3 text-right">Còn nợ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {overview?.topDebtors?.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-medium text-slate-900">
                      HS-{d.student?.id}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        {d.status === "partial" ? "Nợ một phần" : "Chưa đóng"}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-rose-600">
                      {d.remainingAmount.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
