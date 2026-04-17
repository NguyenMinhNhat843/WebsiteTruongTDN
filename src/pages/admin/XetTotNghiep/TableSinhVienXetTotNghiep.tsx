import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { useXetTotNghiepContext } from "./XetTotNghiepProvider";
import type { Column } from "../../../components/ui/Table";
import type { Student } from "./type";
import clsx from "clsx";
import ReusableTable from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ButtonAction from "../../../components/ui/ButtonAction";

const StatusBadge = ({ status }: { status: string }) => {
  // Cấu hình các style dựa trên giá trị status
  const config: Record<string, { container: string; dot: string }> = {
    "Đủ điều kiện": {
      container: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      dot: "bg-emerald-600",
    },
    "Không đủ điều kiện": {
      container: "bg-rose-50 text-rose-700 ring-rose-600/20",
      dot: "bg-rose-600",
    },
    // Trạng thái dự phòng (VD: Chờ xét, Đang xét)
    default: {
      container: "bg-slate-50 text-slate-600 ring-slate-600/10",
      dot: "bg-slate-400",
    },
  };

  const style = config[status] || config.default;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset uppercase tracking-wider",
        style.container,
      )}
    >
      {status}
    </span>
  );
};

const TableSinhVienXetTotNghiep = () => {
  const { filteredStudents, setOpenModelOne } = useXetTotNghiepContext();

  const columns: Column<Student>[] = [
    {
      key: "name",
      label: "Sinh viên",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {s.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-800">{s.name}</div>
            <div className="text-xs text-slate-400 font-mono">{s.id}</div>
          </div>
        </div>
      ),
    },
    { key: "system", label: "Hệ đào tạo" },
    { key: "major", label: "Ngành" },
    {
      key: "gpa",
      label: "Điểm TB",
      render: (s) => (
        <span
          className={clsx(
            "font-mono font-bold",
            s.gpa >= 2.5 ? "text-slate-700" : "text-red-500",
          )}
        >
          {s.gpa.toFixed(2)}
        </span>
      ),
    },
    {
      key: "vocationalCert",
      label: "CC Nghề",
      className: "text-center",
      render: (s) =>
        s.vocationalCert ? (
          <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
        ) : (
          <XCircle size={18} className="text-rose-500 mx-auto" />
        ),
    },
    {
      key: "status",
      label: "Kết quả",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "actions",
      label: "Chi tiết",
      className: "text-right",
      render: () => (
        <ButtonAction
          icon={<FileText size={18} />}
          color="#3b82f6"
          onClick={() => {
            setOpenModelOne(true);
          }}
          title="Chi tiết"
          withText={false}
        />
      ),
    },
  ];

  return (
    <div>
      <ReusableTable data={filteredStudents} columns={columns} rowKey="id" />
      <Pagination
        currentPage={1}
        onPageChange={() => console.log()}
        pageSize={8}
        totalItems={20}
      />
    </div>
  );
};

export default TableSinhVienXetTotNghiep;
