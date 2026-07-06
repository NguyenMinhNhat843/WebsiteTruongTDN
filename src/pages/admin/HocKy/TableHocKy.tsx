import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useHocKyContext, type HocKyDto } from "./HocKyProvider";
import { useMemo, useState } from "react";
import { $api } from "../../../api/client";
import { CreateHocKyModal } from "./CreateHocKyModal";
import { Calendar, CheckCircle2, Clock, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  hocKyList: HocKyDto[];
  isHocKyListPending: boolean;
  columnsAdditional?: ColumnDef<HocKyDto>[];
}

const HocKyTable = ({
  hocKyList,
  isHocKyListPending,
  columnsAdditional,
}: Props) => {
  const { deleteHocKy, isDeleteHocKyPending } = useHocKyContext();

  const [semesterId, setSemesterId] = useState<number | null>(null);
  const { data: semesterOne, isLoading: isSemesterOneLoading } = $api.useQuery(
    "get",
    "/semesters/{id}",
    {
      params: {
        path: {
          id: semesterId!,
        },
      },
    },
    {
      enabled: semesterId !== null,
    },
  );

  const columns = useMemo<ColumnDef<HocKyDto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Mã học kỳ",
      },
      {
        accessorKey: "name",
        header: "Tên học kỳ",
        cell: (info) => (
          <div
            className="flex flex-col hover:text-blue-600 cursor-pointer"
            onClick={() => setSemesterId(info.row.original.id)}
          >
            <span className="font-bold text-gray-800">
              {info.getValue() as string}
            </span>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              {info.row.original.schoolYear}
            </span>
          </div>
        ),
      },
      {
        accessorFn: (row) => `${row.startDate} - ${row.endDate}`,
        id: "duration",
        header: "Thời gian",
        cell: (info) => (
          <div className="flex flex-col text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>
                {new Date(info.row.original.startDate).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock size={14} className="text-gray-400" />
              <span>
                {new Date(info.row.original.endDate).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "isCurrent",
        header: "Trạng thái",
        cell: (info) => {
          const isCurrent = info.getValue() as boolean;
          return isCurrent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 size={12} /> Hiện tại
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
              Lưu trữ
            </span>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "", // Thường để trống tiêu đề cho cột thao tác
        cell: (info) => {
          const hocKy = info.row.original;

          const handleDelete = async (e: React.MouseEvent) => {
            e.stopPropagation(); // Chặn sự kiện click vào hàng (nếu có)

            // Sử dụng window.confirm mặc định
            const isConfirmed = window.confirm(
              `Bạn có chắc chắn muốn xóa học kỳ "${hocKy.name}" không?\nLưu ý: Hành động này không thể hoàn tác.`,
            );

            if (isConfirmed) {
              // Gọi hàm xóa truyền từ props/hook
              deleteHocKy(
                {
                  params: {
                    path: {
                      id: hocKy.id,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    toast.success("Xóa học kỳ thành công!");
                    window.location.reload();
                  },
                  onError: () => {
                    toast.error(
                      "Có lỗi xảy ra khi xóa học kỳ. Vui lòng thử lại.",
                    );
                  },
                },
              );
            }
          };

          return (
            <div className="flex justify-end pr-2">
              <button
                onClick={handleDelete}
                disabled={isDeleteHocKyPending}
                className={`p-2 rounded-lg transition-all ${
                  isDeleteHocKyPending
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-red-50 group"
                }`}
                title="Xóa học kỳ"
              >
                {isDeleteHocKyPending ? (
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                ) : (
                  <Trash2
                    size={16}
                    className="text-gray-400 group-hover:text-red-500 transition-colors"
                  />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: hocKyList || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
  });

  if (isHocKyListPending) {
    return (
      <div className="w-full h-40 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50/50 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
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
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm whitespace-nowrap"
                    >
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
                  colSpan={columns.length + (columnsAdditional?.length || 0)}
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  Không có dữ liệu học kỳ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateHocKyModal
        semester={semesterOne}
        isOpen={semesterId !== null}
        onClose={() => setSemesterId(null)}
      />
    </div>
  );
};

export default HocKyTable;
