import RowActions from "../../pages/admin/HoSoHocSinh/HoSoHocSinhList/components/RowAction";
import { studentColumns } from "./ColumnTableHocSinh";
import { useHocSinhContext } from "./HocSinhProvider";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const TableHoSoHocSinh = () => {
  const { navigate, students, deleteStudent } = useHocSinhContext();
  const table = useReactTable({
    data: students || [],
    columns: [
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
            onDelete={() => {
              console.log("🗑 Xóa:", row);
              deleteStudent(
                {
                  params: {
                    path: {
                      id: row.original.id, // Sử dụng original để lấy dữ liệu gốc của hàng
                    },
                  },
                },
                {
                  onSuccess: () => {
                    alert("Xóa sinh viên thành công!");
                  },
                  onError: () => {
                    alert("❌ Xóa thất bại:");
                  },
                },
              );
            }}
          />
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-bold text-slate-600 uppercase text-[11px] tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-slate-500"
                >
                  Không có dữ liệu sinh viên.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHoSoHocSinh;
