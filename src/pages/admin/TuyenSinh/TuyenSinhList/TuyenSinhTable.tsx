import { useNavigate } from "react-router-dom";
import Badge from "../../../../components/ui/Badge";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { formatDate } from "../../../../util/formatDate";
import {
  METHOD_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  TRAINING_SYSTEM_COLORS,
  TRAINING_SYSTEM_LABELS,
} from "../constants";
import type { FunctionComponent } from "react";
import type { AdmissionRound } from "../type";

interface ListViewProps {
  rounds: AdmissionRound[];
}

const TuyenSinhTable: FunctionComponent<ListViewProps> = ({ rounds }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {rounds.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          Không có đợt tuyển sinh nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Tên đợt
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Hệ đào tạo
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Thời gian
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Chỉ tiêu
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 w-36">
                  Lấp đầy
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Trạng thái
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rounds.map((r) => (
                <tr
                  key={r.id}
                  onClick={() =>
                    navigate(`/admin/tuyen-sinh/dot-tuyen-sinh/${r.id}`)
                  }
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {METHOD_LABELS[r.admissionMethod]}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={TRAINING_SYSTEM_COLORS[r.trainingSystem]}>
                      {TRAINING_SYSTEM_LABELS[r.trainingSystem]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(r.openDate)} → {formatDate(r.closeDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {r.totalRegistered} / {r.totalQuota}
                  </td>
                  <td className="px-4 py-3">
                    <ProgressBar value={r.totalRegistered} max={r.totalQuota} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLORS[r.status]}>
                      {STATUS_LABELS[r.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-right">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TuyenSinhTable;
