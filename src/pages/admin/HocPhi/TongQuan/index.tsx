import { useState, useEffect } from "react";
import { $api } from "../../../../api/client";

// Component con hiển thị Skeleton khi tải dữ liệu
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-3 h-8 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
    </div>
  );
}

export default function TuitionDashboard() {
  // 1. Lấy danh sách các đợt thu học phí để làm bộ lọc
  const { data: tuitionPeriods, isLoading: isLoadingPeriods } = $api.useQuery(
    "get",
    "/tuition-periods",
  );

  const [selectedPeriodId, setSelectedPeriodId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (tuitionPeriods && tuitionPeriods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(tuitionPeriods[0].id);
    }
  }, [tuitionPeriods, selectedPeriodId]);

  // 2. Call API Tổng quan
  const { data: overview, isLoading: isOverviewLoading } = $api.useQuery(
    "get",
    "/tuition-dashboard/tuition-overview",
    { params: { query: { periodId: selectedPeriodId as number } } },
    { enabled: !!selectedPeriodId },
  );

  // 3. Call API Biểu đồ dòng tiền
  const { data: trend, isLoading: isTrendLoading } = $api.useQuery(
    "get",
    "/tuition-dashboard/payment-trend",
    { params: { query: { periodId: selectedPeriodId as number } } },
    { enabled: !!selectedPeriodId },
  );

  const isGlobalLoading =
    isLoadingPeriods || isOverviewLoading || isTrendLoading;
  const kpis = overview?.kpis;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-slate-800 antialiased selection:bg-blue-50">
      {/* HEADER & FILTER AREA */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tổng Quan Tài Chính
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi công nợ, doanh thu thực tế và quản lý tiến độ đóng học phí
            của học sinh.
          </p>
        </div>

        {/* Bộ lọc Select Box */}
        <div className="relative min-w-[200px]">
          <select
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            value={selectedPeriodId ?? ""}
            onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
            disabled={isLoadingPeriods}
          >
            {tuitionPeriods?.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 1. KHU VỰC CHỈ SỐ KPI CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isGlobalLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* KPI 1 */}
            <div className="group rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tổng công nợ phát sinh
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                {(kpis?.totalBilled ?? 0).toLocaleString()}
                <span className="text-sm font-normal text-slate-400 ml-1">
                  VND
                </span>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-flex h-5 items-center rounded-md bg-slate-100 px-1.5 font-medium text-slate-600">
                  {kpis?.totalInvoices ?? 0} hóa đơn
                </span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="group rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Thực thu (Đã thu)
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 tabular-nums">
                {(kpis?.totalCollected ?? 0).toLocaleString()}
                <span className="text-sm font-normal text-emerald-500 ml-1">
                  VND
                </span>
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đạt {kpis?.collectionRate ?? 0}%
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="group rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-rose-200 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Còn thiếu (Còn nợ)
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 tabular-nums">
                {(kpis?.totalOutstanding ?? 0).toLocaleString()}
                <span className="text-sm font-normal text-rose-500 ml-1">
                  VND
                </span>
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-rose-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Cần đôn đốc thu hồi
              </div>
            </div>

            {/* KPI 4 */}
            <div className="group rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tỷ lệ hoàn thành đợt
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${kpis?.collectionRate ?? 0}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Tiến độ đợt thu
                </span>
                <span className="font-bold text-blue-600 tabular-nums">
                  {kpis?.collectionRate ?? 0}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. KHU VỰC THỐNG KÊ CHI TIẾT */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trạng thái hóa đơn học phí */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Trạng thái hóa đơn học phí
          </h3>
          <div className="divide-y divide-slate-100">
            {overview?.statusDistribution?.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between py-3.5 transition-colors hover:bg-slate-50/40"
              >
                <div className="flex items-center gap-3">
                  {item.status === "paid" && (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                      Đã hoàn thành
                    </span>
                  )}
                  {item.status === "partial" && (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10">
                      Mới đóng 1 phần
                    </span>
                  )}
                  {item.status !== "paid" && item.status !== "partial" && (
                    <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10">
                      Chưa thanh toán
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-400 tabular-nums">
                    {item.count} học sinh
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 tracking-tight tabular-nums">
                  {item.amount.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    đ
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phương thức thanh toán phổ biến */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Dòng tiền qua các kênh thanh toán
          </h3>
          <div className="divide-y divide-slate-100">
            {overview?.paymentMethods?.map((item) => (
              <div
                key={item.method}
                className="flex items-center justify-between py-3.5 transition-colors hover:bg-slate-50/40"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 tracking-wide">
                    {item.method}
                  </span>
                  <span className="text-xs font-medium text-slate-400 tabular-nums">
                    {item.count} giao dịch
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 tracking-tight tabular-nums">
                  {item.amount.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    đ
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CHI TIẾT DỮ LIỆU */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Nhật ký giao dịch gần đây */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Giao dịch thành công gần đây
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Mã học sinh</th>
                  <th className="pb-3 font-semibold">Kênh thanh toán</th>
                  <th className="pb-3 text-right font-semibold">
                    Số tiền nhận
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview?.recentPayments?.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 font-semibold text-slate-900 tabular-nums">
                      HS-{p.student?.id}
                    </td>
                    <td className="py-3.5">
                      <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-600 tracking-tight tabular-nums">
                      +{p.amountPaid.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danh sách nợ nhiều nhất */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Học sinh nợ học phí cao nhất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Mã học sinh</th>
                  <th className="pb-3 font-semibold">Tình trạng nợ</th>
                  <th className="pb-3 text-right font-semibold">
                    Dư nợ còn lại
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview?.topDebtors?.map((d) => (
                  <tr
                    key={d.id}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 font-semibold text-slate-900 tabular-nums">
                      HS-{d.student?.id}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          d.status === "partial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                            : "bg-rose-50 text-rose-700 border border-rose-200/50"
                        }`}
                      >
                        {d.status === "partial"
                          ? "Nợ một phần"
                          : "Chưa đóng nợ"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-rose-600 tracking-tight tabular-nums">
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
