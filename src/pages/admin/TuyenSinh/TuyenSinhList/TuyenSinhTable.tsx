import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../util/formatDate";
import Badge from "../../../../components/ui/Badge";
import ProgressBar from "../../../../components/ui/ProgressBar";
import {
  METHOD_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  TRAINING_SYSTEM_COLORS,
  TRAINING_SYSTEM_LABELS,
} from "../constants";
import type { FunctionComponent } from "react";
import type { AdmissionRound } from "../type";
import type { Column } from "../../../../components/ui/Table";
import ReusableTable from "../../../../components/ui/Table";
import Pagination from "../../../../components/ui/Pagination";

interface ListViewProps {
  rounds: AdmissionRound[];
}

const TuyenSinhTable: FunctionComponent<ListViewProps> = ({ rounds }) => {
  const navigate = useNavigate();

  // 1. Định nghĩa các cột của bảng
  const columns: Column<AdmissionRound>[] = [
    {
      key: "name",
      label: "Tên đợt",
      className: "px-5",
      render: (r) => (
        <>
          <div className="font-medium text-gray-900 max-w-xs truncate">
            {r.name}
          </div>
          <div className="text-xs text-gray-400">
            {METHOD_LABELS[r.admissionMethod]}
          </div>
        </>
      ),
    },
    {
      key: "trainingSystem",
      label: "Hệ đào tạo",
      render: (r) => (
        <Badge className={TRAINING_SYSTEM_COLORS[r.trainingSystem]}>
          {TRAINING_SYSTEM_LABELS[r.trainingSystem]}
        </Badge>
      ),
    },
    {
      key: "time",
      label: "Thời gian",
      render: (r) => (
        <span className="text-gray-600 whitespace-nowrap">
          {formatDate(r.openDate)} → {formatDate(r.closeDate)}
        </span>
      ),
    },
    {
      key: "quota",
      label: "Chỉ tiêu",
      className: "text-right font-medium",
      render: (r) => `${r.totalRegistered} / ${r.totalQuota}`,
    },
    {
      key: "progress",
      label: "Lấp đầy",
      className: "w-36",
      render: (r) => (
        <ProgressBar value={r.totalRegistered} max={r.totalQuota} />
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => (
        <Badge className={STATUS_COLORS[r.status]}>
          {STATUS_LABELS[r.status]}
        </Badge>
      ),
    },
    {
      key: "arrow",
      label: "",
      className: "text-right text-gray-400 text-lg pr-5",
      render: () => "›",
    },
  ];

  return (
    <div>
      <ReusableTable
        data={rounds}
        columns={columns}
        rowKey="id"
        emptyMessage="Không có đợt tuyển sinh nào"
        onRowClick={(r) => navigate(`/admin/tuyen-sinh/dot-tuyen-sinh/${r.id}`)}
      />
      <Pagination
        currentPage={1}
        onPageChange={() => console.log()}
        pageSize={8}
        totalItems={20}
      />
    </div>
  );
};

export default TuyenSinhTable;
