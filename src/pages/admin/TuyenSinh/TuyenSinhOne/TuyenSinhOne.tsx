import type { FunctionComponent } from "react";
import Badge from "../../../../components/ui/Badge";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { StatCard } from "../../../../components/ui/StatCard";
import { formatDate } from "../../../../util/formatDate";
import {
  METHOD_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  TRAINING_SYSTEM_COLORS,
  TRAINING_SYSTEM_LABELS,
} from "../constants";
import { fillRate, formatCurrency } from "../helpers";
import type { AdmissionRound } from "../type";
import Breadcrumb from "../../../../components/ui/Breadcrum";

const dataTest: AdmissionRound = {
  id: "1",
  name: "Đợt tuyển sinh Trung cấp nghề - Kỳ 1/2025",
  trainingSystem: "trung_cap_nghe",
  admissionMethod: "xet_tuyen",
  openDate: "2025-01-10",
  closeDate: "2025-03-31",
  totalQuota: 300,
  totalRegistered: 274,
  tuitionFee: 8500000,
  location: "Cơ sở 1 - 123 Nguyễn Huệ, TP. Nha Trang",
  majors: [
    { id: "m1", name: "Điện công nghiệp", quota: 100, registered: 95 },
    { id: "m2", name: "Hàn", quota: 80, registered: 72 },
    { id: "m3", name: "Kỹ thuật máy lạnh", quota: 60, registered: 61 },
    { id: "m4", name: "Cơ khí chế tạo", quota: 60, registered: 46 },
  ],
  status: "open",
  note: "Miễn học phí cho học sinh dân tộc thiểu số",
  createdAt: "2024-12-20",
};

interface DotTuyenSinhOneProps {
  round?: AdmissionRound;
}

const DotTuyenSinhOne: FunctionComponent<DotTuyenSinhOneProps> = ({
  round = dataTest,
}) => {
  const rate = fillRate(round?.totalRegistered || 0, round?.totalQuota || 0);

  if (!round) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        Đợt tuyển sinh không tồn tại
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: "Danh sách",
            link: "/admin/tuyen-sinh/dot-tuyen-sinh",
          },
          {
            label: round.name,
          },
        ]}
      />

      <div className="mx-auto space-y-6 animate-in fade-in duration-500">
        {/* SECTION 1: HEADER & ACTION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`${TRAINING_SYSTEM_COLORS[round.trainingSystem]} px-3 py-1`}
              >
                {TRAINING_SYSTEM_LABELS[round.trainingSystem]}
              </Badge>
              <Badge
                className={`${STATUS_COLORS[round.status]} px-3 py-1 shadow-sm`}
              >
                {STATUS_LABELS[round.status]}
              </Badge>
              <Badge className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1">
                {METHOD_LABELS[round.admissionMethod]}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {round.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Tạo ngày {formatDate(round.createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
              Chỉnh sửa
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all active:scale-95">
              Xoá
            </button>
          </div>
        </div>

        {/* SECTION 2: STATS & PROGRESS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              {
                label: "Tổng chỉ tiêu",
                value: round.totalQuota.toLocaleString(),
                color: "#0284c7",
              },
              {
                label: "Đã đăng ký",
                value: round.totalRegistered.toLocaleString(),
                sub: `${rate}% lấp đầy`,
                color: "#f59e0b",
              },
              {
                label: "Học phí / năm",
                value: formatCurrency(round.tuitionFee),
                color: "#8b5cf6",
              },
              {
                label:
                  round.minScore !== undefined
                    ? "Điểm chuẩn tối thiểu"
                    : "Điểm chuẩn",
                value: round.minScore ?? "Không yêu cầu",
                color: round.minScore !== undefined ? "#10b981" : "#64748b",
              },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Fill Rate Highlight Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tỷ lệ lấp đầy
                </p>
                <h3 className="text-2xl font-bold text-gray-900">{rate}%</h3>
              </div>
              <span
                className={`text-sm font-bold px-2 py-1 rounded-lg ${rate >= 100 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
              >
                {round.totalRegistered} / {round.totalQuota}
              </span>
            </div>
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${rate >= 100 ? "bg-red-500" : rate >= 80 ? "bg-orange-400" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"}`}
                style={{ width: `${Math.min(100, rate)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 italic text-center">
              Dữ liệu được cập nhật thời gian thực
            </p>
          </div>
        </div>

        {/* SECTION 3: TIMELINE & NOTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-blue-500 pl-3">
              Lộ trình tuyển sinh
            </h3>
            <div className="space-y-4">
              {[
                { label: "Ngày mở đơn", date: round.openDate, icon: "🚀" },
                { label: "Ngày đóng đơn", date: round.closeDate, icon: "⌛" },
                {
                  label: "Ngày thi tuyển",
                  date: round.examDate,
                  icon: "📝",
                  hide: !round.examDate,
                },
              ].map(
                (item, i) =>
                  !item.hide && (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-gray-600 text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-gray-900 font-semibold text-sm">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  ),
              )}
              {round.location && (
                <div className="mt-4 p-3 rounded-xl bg-blue-50/30 border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                    Địa điểm tổ chức
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {round.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-l-4 border-amber-500 pl-3">
              Ghi chú quản lý
            </h3>
            {round.note ? (
              <div className="flex-1 relative p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 italic text-gray-700 text-sm leading-relaxed">
                <span className="absolute top-2 right-4 text-4xl text-amber-200/50 font-serif">
                  "
                </span>
                {round.note}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-xl">
                <svg
                  className="w-8 h-8 opacity-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.674a1 1 0 00.922-.617l2.108-4.742A1 1 0 0016.446 10H13V4.477a1 1 0 00-1.991-.126l-3.337 11.25a1 1 0 001.127 1.279z"
                  />
                </svg>
                <span className="text-xs italic">Không có ghi chú thêm</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: MAJORS TABLE */}
        {round.majors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-purple-500 pl-3">
                Danh sách Ngành / Nghề
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {round.majors.length} Ngành
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-4">Tên ngành</th>
                    <th className="text-right px-6 py-4">Chỉ tiêu</th>
                    <th className="text-right px-6 py-4">Đã đăng ký</th>
                    <th className="px-6 py-4 w-56 text-center">
                      Tiến độ lấp đầy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {round.majors.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors">
                          {m.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-600">
                        {m.quota}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded-md font-bold text-gray-800">
                          {m.registered}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <ProgressBar value={m.registered} max={m.quota} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-8">
                            {Math.round((m.registered / m.quota) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DotTuyenSinhOne;
