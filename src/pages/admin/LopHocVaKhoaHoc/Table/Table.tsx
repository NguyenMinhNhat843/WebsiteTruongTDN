import type { FunctionComponent, ReactNode } from "react";
import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { HE_BADGE, PAGE_SIZE, STATUS_BADGE } from "../constants";
import { useLopHocVaKhoaHocContext } from "../LopHocVaKhoaHocProvider";
import { HE_DAO_TAO } from "../mockData";
import clsx from "clsx";
import { type LopHoc } from "../mockType";
import { Eye, Trash2 } from "lucide-react";

interface TableProps {
  className?: string;
}

// 1. Kiểu dữ liệu cho một dòng (Lớp học)
export interface ClassRecord extends LopHoc {
  stt: string;
}

interface TableColumn {
  key: string;
  label: string;
  className?: string;
  // Hàm render tùy chỉnh nhận vào toàn bộ record và trả về ReactNode
  render?: (record: ClassRecord) => ReactNode;
}

const Table: FunctionComponent<TableProps> = ({ className }) => {
  const { pageData, setDetail, setPage, totalPages, page } =
    useLopHocVaKhoaHocContext();

  const COLUMNS: TableColumn[] = [
    {
      key: "stt",
      label: "STT",
      className: "w-12 text-center text-gray-500",
      render: (r) => <span>{r.stt}</span>,
    },
    {
      key: "ma",
      label: "Mã lớp",
      className: "w-28 font-mono text-blue-600 whitespace-nowrap",
    },
    {
      key: "ten",
      label: "Tên lớp",
      className: "max-w-50 truncate font-medium text-gray-800",
    },
    {
      key: "he",
      label: "Hệ đào tạo",
      render: (r) => (
        <Badge className={HE_BADGE[r.he]}>{HE_DAO_TAO[r.he]}</Badge>
      ),
    },
    { key: "khoa", label: "Niên khóa", className: "text-gray-500" },
    {
      key: "nganh",
      label: "Ngành",
      className: "text-gray-600 whitespace-nowrap",
    },
    {
      key: "siso",
      label: "Sĩ số",
      render: (r) => (
        <span className="tabular-nums text-gray-700">
          {r.siso}/{r.max}
        </span>
      ),
    },
    {
      key: "fill",
      label: "Lấp đầy",
      className: "w-28",
      render: (r) => <ProgressBar value={r.siso} max={r.max} />,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => (
        <Badge className={STATUS_BADGE[r.status]}>{r.status}</Badge>
      ),
    },
    {
      key: "gvcn",
      label: "GVCN",
      className: "text-xs text-gray-400 max-w-27.5 whitespace-nowrap",
    },
    {
      key: "action",
      label: "Thao tác",
      className: "w-24",
      render: (r) => {
        const actions = [
          {
            label: "Xem",
            icon: <Eye size={14} />,
            onClick: () => setDetail(r),
            className:
              "text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border-blue-100",
          },
          {
            label: "Xóa",
            icon: <Trash2 size={14} />,
            onClick: () => {},
            className:
              "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-100",
          },
        ];

        return (
          <div className="flex items-center gap-2">
            {actions.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                title={btn.label} // Hiện tooltip mặc định của trình duyệt
                className={clsx(
                  "p-2 rounded-lg border transition-all duration-200 flex items-center justify-center shadow-xs",
                  btn.className,
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div
      className={clsx(
        `bg-white rounded-xl border border-gray-100 overflow-hidden`,
        className,
      )}
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linear-to-r from-blue-700 via-indigo-600 to-blue-800 text-white">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageData.length > 0 ? (
              pageData.map((r) => (
                <tr
                  key={r.ma}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${col.className || ""}`}
                    >
                      {col?.render ? col.render(r) : r[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-16 text-center text-gray-400 italic"
                >
                  Không tìm thấy lớp học nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        totalItems={totalPages * PAGE_SIZE}
      />
    </div>
  );
};

export default Table;
