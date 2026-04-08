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

const dataTest: AdmissionRound = {
  id: "6",
  name: "Đợt tuyển sinh Cao đẳng - Kỳ 2/2024",
  trainingSystem: "cao_dang",
  admissionMethod: "xet_tuyen",
  openDate: "2024-07-01",
  closeDate: "2024-08-31",
  totalQuota: 180,
  totalRegistered: 0,
  tuitionFee: 13500000,
  majors: [{ id: "m14", name: "Kế toán", quota: 180, registered: 0 }],
  status: "cancelled",
  note: "Huỷ do không đủ số lượng đăng ký",
  createdAt: "2024-06-01",
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
    <div className="space-y-5">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button className="hover:text-blue-600 transition-colors">
          Danh sách
        </button>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{round.name}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Title bar */}
        <div className="p-6 border-b border-gray-50 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge className={TRAINING_SYSTEM_COLORS[round.trainingSystem]}>
                {TRAINING_SYSTEM_LABELS[round.trainingSystem]}
              </Badge>
              <Badge className={STATUS_COLORS[round.status]}>
                {STATUS_LABELS[round.status]}
              </Badge>
              <Badge className="bg-slate-100 text-slate-700">
                {METHOD_LABELS[round.admissionMethod]}
              </Badge>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {round.name}
            </h1>
            <p className="text-sm text-gray-400">
              Tạo ngày {formatDate(round.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              // onClick={onEdit}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Chỉnh sửa
            </button>
            <button
              // onClick={onDelete}
              className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Xoá
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Tổng chỉ tiêu",
              value: round.totalQuota.toLocaleString(),
            },
            {
              label: "Đã đăng ký",
              value: round.totalRegistered.toLocaleString(),
              sub: `${rate}% lấp đầy`,
            },
            {
              label: "Học phí / năm",
              value: formatCurrency(round.tuitionFee),
            },
          ].map((stat) => (
            <StatCard
              label={stat.label}
              value={stat.value}
              description={stat.sub}
              key={stat.label}
            />
          ))}

          {round.minScore !== undefined ? (
            <StatCard label="Điểm chuẩn tối thiểu" value={round.minScore} />
          ) : (
            <StatCard label="Điểm chuẩn" value="Không yêu cầu" />
          )}
        </div>

        {/* Fill rate bar */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Tỷ lệ lấp đầy</span>
              <span
                className={`font-semibold ${rate >= 100 ? "text-red-600" : rate >= 80 ? "text-orange-500" : "text-blue-600"}`}
              >
                {round.totalRegistered} / {round.totalQuota}
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${rate >= 100 ? "bg-red-500" : rate >= 80 ? "bg-orange-400" : "bg-blue-500"}`}
                style={{ width: `${Math.min(100, rate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline & info */}
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Thời gian
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày mở</span>
                <span className="font-medium text-gray-800">
                  {formatDate(round.openDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày đóng</span>
                <span className="font-medium text-gray-800">
                  {formatDate(round.closeDate)}
                </span>
              </div>
              {round.examDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày thi</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(round.examDate)}
                  </span>
                </div>
              )}
              {round.location && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 flex-shrink-0">Địa điểm</span>
                  <span className="font-medium text-gray-800 text-right">
                    {round.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {round.note && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Ghi chú
              </h3>
              <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 leading-relaxed">
                {round.note}
              </p>
            </div>
          )}
        </div>

        {/* Majors */}
        {round.majors.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Ngành / Nghề tuyển sinh
            </h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Tên ngành
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      Chỉ tiêu
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      Đã ĐK
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-600 w-40">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {round.majors.map((m) => {
                    const r = fillRate(m.registered, m.quota);
                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-800 font-medium">
                          {m.name}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {m.quota}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                          {m.registered}
                        </td>
                        <td className="px-4 py-3">
                          <ProgressBar value={m.registered} max={m.quota} />
                        </td>
                      </tr>
                    );
                  })}
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
