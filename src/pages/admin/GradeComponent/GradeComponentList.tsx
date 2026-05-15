import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useGradeComponentContext,
  type GradeComponentDto,
} from "./GradeComponentProvider";
import {
  Hash,
  Settings,
  Percent,
  Sliders,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import AddGradeComponentModal from "./CreateGradeComponent";
import PageShell from "../../../components/ui/PageShell";

const columnHelper = createColumnHelper<GradeComponentDto>();

const GradeComponentList = () => {
  const {
    gradeComponents,
    isLoadingGradeComponents,
    isOpenModalCreate,
    setIsOpenModalCreate,
    createDiemThanhPhan,
    isCreatingDiemThanhPhan,
    deleteDiemThanhPhan,
  } = useGradeComponentContext();

  // Định nghĩa các cột hiển thị bằng TanStack Table helper
  const columns = useMemo(
    () => [
      // 1. Cột ID
      columnHelper.accessor("id", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Hash size={14} /> ID
          </span>
        ),
        cell: (info) => (
          <span className="font-mono font-bold text-slate-400">
            #{info.getValue()}
          </span>
        ),
      }),

      // 2. Cột Tên thành phần điểm (Chuyển đổi text sang Label thân thiện)
      columnHelper.accessor("name", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Settings size={14} /> Thành phần điểm
          </span>
        ),
        cell: (info) => {
          const name = info.getValue();
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold uppercase">{name}</span>
            </div>
          );
        },
      }),

      // 3. Cột Trọng số (Hiển thị dạng Số thập phân & Thanh tiến trình %)
      columnHelper.accessor("weight", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Percent size={14} /> Tỷ trọng bài thi
          </span>
        ),
        cell: (info) => {
          const weight = info.getValue();
          const percentage = Math.round(weight * 100);

          // Định màu sắc thanh tiến trình dựa trên độ lớn của trọng số
          const getProgressBarColor = (pct: number) => {
            if (pct >= 50) return "bg-blue-600";
            if (pct >= 30) return "bg-indigo-500";
            return "bg-sky-400";
          };

          return (
            <div className="flex items-center gap-4 max-w-xs">
              {/* Con số phần trăm nổi bật */}
              <div className="w-12 shrink-0">
                <span className="text-sm font-black text-slate-800">
                  {percentage}%
                </span>
                <span className="block text-[11px] text-slate-400 font-medium font-mono">
                  ({weight})
                </span>
              </div>
              {/* Thanh Progress bar mô phỏng trực quan */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        },
      }),

      // 4. Cột Thao tác chức năng (Actions)
      columnHelper.display({
        id: "actions",
        header: () => (
          <span className="flex justify-end">
            <Sliders size={14} /> Hành động
          </span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-end gap-1.5">
              <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                <Edit3 size={15} />
              </button>
              <button
                onClick={() =>
                  deleteDiemThanhPhan({
                    params: { path: { id: info.row.original.id } },
                  })
                }
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: gradeComponents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageShell
      title="Cấu hình thành phần điểm"
      sub="Thiết lập cấu trúc tỷ trọng điểm số (Hệ số quy đổi tổng kết)"
      renderRight={
        <button
          onClick={() => setIsOpenModalCreate(true)}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-100"
        >
          <Plus size={16} /> Thêm đầu điểm
        </button>
      }
    >
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* TABLE DATA CONTAINER */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-slate-100 bg-slate-50/30"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider"
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

            <tbody className="divide-y divide-slate-100">
              {isLoadingGradeComponents ? (
                // Skeleton Loading State sinh động
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5">
                      <div className="h-4 bg-slate-100 rounded w-8" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-32" />
                        <div className="h-3 bg-slate-100 rounded w-16" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-4 bg-slate-100 rounded w-8" />
                        <div className="h-2 bg-slate-100 rounded w-full max-w-[150px]" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-8 bg-slate-100 rounded-lg w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-slate-600 align-middle"
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
                // Trạng thái trống (Empty State)
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400 italic bg-white"
                  >
                    Chưa có loại điểm thành phần nào được cấu hình trong hệ
                    thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER SUMMARY */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>Đang hiển thị {gradeComponents?.length || 0} thành phần</span>
        </div>

        <AddGradeComponentModal
          isOpen={isOpenModalCreate}
          onClose={() => setIsOpenModalCreate(false)}
          isSubmitting={isCreatingDiemThanhPhan}
          onSubmit={(data, onSuccess) =>
            createDiemThanhPhan(
              {
                body: data,
              },
              {
                onSuccess: () => {
                  onSuccess();
                },
              },
            )
          }
        />
      </div>
    </PageShell>
  );
};

export default GradeComponentList;
