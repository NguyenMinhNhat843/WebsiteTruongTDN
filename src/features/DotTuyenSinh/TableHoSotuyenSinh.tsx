import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useHoSoTuyenSinhContext,
  type HoSoTuyenSinhDto,
} from "./HoSoTuyenSInhProvider";
import { columns } from "./TableHoSoTuyenSinhColumn";
import { Trash } from "lucide-react";

interface Props {
  hoSoTuyenSinhs?: HoSoTuyenSinhDto[];
  isLoadingHoSoTuyenSinh: boolean;
}

export function HoSoTuyenSinhTable({
  hoSoTuyenSinhs,
  isLoadingHoSoTuyenSinh,
}: Props) {
  const { deleteHoSo, isDeleting } = useHoSoTuyenSinhContext();
  const table = useReactTable({
    data: hoSoTuyenSinhs ?? [],
    columns: [
      ...columns,
      {
        accessorKey: "actions",
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <button
              onClick={() =>
                deleteHoSo(
                  {
                    params: { path: { id } },
                  },
                  {
                    onSuccess: () => {
                      alert("Xóa hồ sơ tuyển sinh thành công!");
                    },
                  },
                )
              }
              disabled={isDeleting}
            >
              <Trash className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-slate-50/50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-[11px] uppercase tracking-[0.1em] font-bold text-slate-400"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="group">
          {isLoadingHoSoTuyenSinh ? (
            // Skeleton Rows mang cảm giác mềm mại hơn
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, j) => (
                  <td key={j} className="px-6 py-5">
                    <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group/row hover:bg-indigo-50/30 transition-all duration-300 ease-in-out cursor-default"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-5 text-sm text-slate-600 first:rounded-l-2xl last:rounded-r-2xl"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-20 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-slate-300 text-lg font-medium italic">
                    Trống rỗng
                  </span>
                  <p className="text-slate-400 text-xs not-italic">
                    Hiện tại chưa có hồ sơ nào được nộp.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
