import { useHoSoHocSinhContext } from "../HoSoHocSinhProvider";
import RowActions from "./components/RowAction";
import { studentColumns } from "./ColumnTableHocSinh";
import { DataTable } from "../../../../components/ui/DataTable";
import Pagination from "../../../../components/ui/Pagination";

const TableHoSoHocSinh = () => {
  const { viewMode, navigate, students } = useHoSoHocSinhContext();

  return (
    <div>
      {viewMode === "table" && (
        <div>
          <DataTable
            headerClassName="bg-blue-700 text-white"
            columns={[
              {
                id: "stt",
                header: "STT",
                cell: ({ row }) => <span>{row.index + 1}</span>,
                size: 50,
              },
              ...studentColumns,
              {
                id: "actions", // Cột không có trong data thì dùng ID thay cho accessorKey
                header: "Thao tác",
                cell: ({ row }) => (
                  <RowActions
                    onView={() => {
                      console.log("👁 Xem:", row);
                      navigate(`/admin/hoc-sinh/ho-so/${row.id}`);
                    }}
                    onEdit={() => console.log("✏️ Sửa:", row)}
                    onDelete={() => console.log("🗑 Xóa:", row)}
                  />
                ),
              },
            ]}
            data={students || []}
            noDataMessage="Danh sách sinh viên trống"
          />
          <Pagination
            currentPage={1}
            totalItems={10}
            onPageChange={() => console.log()}
            pageSize={8}
          />
        </div>
      )}
    </div>
  );
};

export default TableHoSoHocSinh;
