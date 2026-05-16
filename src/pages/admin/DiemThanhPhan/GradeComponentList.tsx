import { useMemo, useState, type KeyboardEvent } from "react";
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
  Sliders,
  Trash2,
  Edit3,
  Plus,
  Loader2,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";

const columnHelper = createColumnHelper<GradeComponentDto>();

const GradeComponentList = () => {
  const {
    gradeComponents,
    isLoadingGradeComponents,
    createDiemThanhPhan,
    isCreatingDiemThanhPhan,
    deleteDiemThanhPhan,
  } = useGradeComponentContext();

  // State quản lý giá trị ô nhập tên thành phần điểm mới
  const [newComponentName, setNewComponentName] = useState<string>("");

  // Hàm xử lý gửi dữ liệu lên Server khi người dùng nhấn nút hoặc gõ Enter
  const handleAddNewComponent = () => {
    const trimmedName = newComponentName.trim();
    if (!trimmedName || isCreatingDiemThanhPhan) return;

    createDiemThanhPhan(
      {
        // Gửi payload chỉ cần name theo nghiệp vụ mới của bạn
        body: { name: trimmedName },
      },
      {
        onSuccess: () => {
          setNewComponentName(""); // Xóa sạch ô nhập sau khi thêm thành công
        },
      },
    );
  };

  // Bắt sự kiện phím Enter trên ô Input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewComponent();
    }
  };

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

      // 2. Cột Tên thành phần điểm
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
              <span className="font-bold uppercase text-slate-700">{name}</span>
            </div>
          );
        },
      }),

      // 3. Cột Thao tác chức năng (Actions)
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
              <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-colors cursor-pointer">
                <Edit3 size={15} />
              </button>
              <button
                onClick={() =>
                  deleteDiemThanhPhan({
                    params: { path: { id: info.row.original.id } },
                  })
                }
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        },
      }),
    ],
    [deleteDiemThanhPhan],
  );

  const table = useReactTable({
    data: gradeComponents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageShell
      title="Cấu hình thành phần điểm"
      sub="Thiết lập danh mục các loại điểm hệ thống (Trọng số chi tiết sẽ được cấu hình riêng theo từng môn học)"
    >
      <div className="w-full space-y-4">
        {/* THANH NHẬP LIỆU NHANH (Thay thế cho Modal cũ) */}
        <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Settings size={18} />
            </div>
            <input
              type="text"
              value={newComponentName}
              onChange={(e) => setNewComponentName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreatingDiemThanhPhan}
              placeholder="Nhập tên thành phần điểm mới rồi nhấn Enter... (Ví dụ: Chuyên cần, Giữa kỳ, Cuối kỳ)"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
            />
          </div>
          <button
            type="button"
            onClick={handleAddNewComponent}
            disabled={!newComponentName.trim() || isCreatingDiemThanhPhan}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 border disabled:border-slate-200 text-white disabled:text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-100 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCreatingDiemThanhPhan ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Thêm đầu điểm
          </button>
        </div>

        {/* CONTAINER BẢNG DỮ LIỆU */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                  /* Skeleton Loading State sinh động */
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-100 rounded w-8" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-100 rounded w-32" />
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
                  /* Trạng thái trống (Empty State) */
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-slate-400 font-medium bg-white"
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
        </div>
      </div>
    </PageShell>
  );
};

export default GradeComponentList;
