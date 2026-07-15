import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import RowActions from "./components/RowAction";
import { useHocSinhContext } from "../HocSinhProvider";
import { formatDate } from "../../../../util/formatDate";
import { BadgeStudentStatus } from "../../../../components/ui/StudentStatusBadge";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import {
  STUDENT_STATUS_TABS,
  type StudentStatusEnum,
} from "../../../../api/enum";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type ApproveStudentDto = components["schemas"]["ApprovedStudentDto"];
export type StudentItem = components["schemas"]["QualifiedStudentResponseDto"];

const TableHoSoHocSinh = () => {
  const {
    navigate,
    students,
    deleteStudent,
    isLoadingStudents,
    filters,
    setFilters,
    total,
  } = useHocSinhContext();

  const currentTab = filters.status || "";
  const queryClient = useQueryClient();

  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;
  const totalPages = Math.ceil((total || 0) / pageSize) || 1;

  // State quản lý Modal Duyệt Hàng Loạt
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const [maxStudents, setMaxStudents] = useState<string>("");

  /**
   * Xét duyệt học sinh, chuyển từ chờ xét tuyển sang đã đậu
   */
  const { mutate: approveStudent, isPending: isPendingApprove } =
    $api.useMutation("patch", "/students/approve");

  const handleConfirmApprove = () => {
    const limitAmount = maxStudents ? parseInt(maxStudents, 10) : undefined;

    // Bạn có thể đính kèm limit hoặc quote vào body gửi lên backend
    approveStudent(
      {
        body: {
          quote: limitAmount,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đã xét duyệt danh sách học sinh thành công!");
          setIsOpenApproveModal(false);
          setMaxStudents("");
          queryClient.invalidateQueries({
            queryKey: ["get", "/students"],
          });
        },
        onError: () => {
          toast.error("Duyệt hàng loạt thất bại!");
        },
      },
    );
  };

  const handleTabChange = (status: StudentStatusEnum) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: status || undefined,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = (id: number, studentCode: string) => {
    deleteStudent(
      {
        params: {
          path: { id: id || -1 },
        },
      },
      {
        onSuccess: () => {
          alert(`Xóa sinh viên ${studentCode} thành công!`);
        },
        onError: () => {
          alert("❌ Xóa thất bại!");
        },
      },
    );
  };

  // Khai báo cột và xử lý logic ẩn/hiện động theo tab hiện tại
  const columns = useMemo<ColumnDef<StudentItem>[]>(() => {
    const baseColumns: ColumnDef<StudentItem>[] = [
      {
        id: "stt",
        header: "STT",
        cell: (info) => (currentPage - 1) * pageSize + info.row.index + 1,
        meta: {
          className: "w-[60px]",
        },
      },
      {
        id: "fullName",
        header: "Họ và tên",
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex flex-col">
              <div className="font-bold text-slate-800 text-[13px]">
                {student.fullName || "Chưa có tên"}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                {typeof student.gender === "boolean" && (
                  <span>{student.gender ? "Nam" : "Nữ"}</span>
                )}
                {typeof student.gender === "boolean" && student.dob && (
                  <span className="text-slate-300">·</span>
                )}
                {student.dob && <span>{formatDate(String(student.dob))}</span>}
              </div>
            </div>
          );
        },
      },
      {
        id: "major",
        header: "Ngành học",
        cell: ({ row }) => row.original.major?.majorName || "-",
      },
      {
        id: "class",
        header: "Lớp học",
        cell: ({ row }) => {
          const student = row.original;
          return student.class?.classCode ? (
            student.class.classCode
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/60 shadow-sm select-none">
              Chưa có
            </span>
          );
        },
      },
      {
        id: "batch",
        header: "Khóa đào tạo",
        cell: ({ row }) => row.original.batch?.batchCode || "-",
      },
      {
        id: "documentProgress",
        header: "Hồ sơ",
        cell: ({ row }) => {
          const progress = row.original.documentProgress;
          if (!progress)
            return <span className="text-slate-400 text-xs">-</span>;

          const isCompleted =
            progress.current === progress.total && progress.total > 0;

          return (
            <span
              className={`inline-flex items-center justify-center font-semibold text-xs px-2 py-0.5 rounded-full ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                  : "bg-amber-50 text-amber-600 border border-amber-200/50"
              }`}
            >
              {progress.current}/{progress.total}
            </span>
          );
        },
      },
      {
        id: "isQualified",
        header: "Đánh giá",
        cell: ({ row }) => {
          const isQualified = row.original.isQualified;
          return isQualified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              Đủ điều kiện
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              Không đủ điều kiện
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => <BadgeStudentStatus status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Thao tác",
        meta: {
          className: "text-right pr-7",
        },
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex justify-end">
              <RowActions
                onView={() =>
                  navigate(`/admin/hoc-sinh/ho-so/${student.studentCode}`)
                }
                onDelete={() =>
                  handleDelete(student.id || -1, student.studentCode || "")
                }
              />
            </div>
          );
        },
      },
    ];

    // Xử lý loại bỏ cột động dựa theo trạng thái của tab hiện tại
    return baseColumns.filter((col) => {
      if (currentTab === "registered") {
        return ![
          "class",
          "batch",
          "documentProgress",
          "isQualified",
          "status",
        ].includes(col.id!);
      }
      if (currentTab === "pending" || currentTab === "failed") {
        return !["class", "batch", "documentProgress"].includes(col.id!);
      }
      if (currentTab === "approved" || currentTab === "studying") {
        return !["isQualified"].includes(col.id!);
      }
      return true;
    });
  }, [currentTab, currentPage, pageSize, navigate]);

  const table = useReactTable({
    data: students || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {/* THANH CHUYỂN TAB (TABS NAVIGATION) */}
      <div className="flex items-center justify-between border-b border-slate-200 px-2 pb-2 gap-4">
        <div className="flex gap-6 overflow-x-auto custom-scrollbar flex-1 min-w-0">
          {STUDENT_STATUS_TABS.map((tab) => {
            const isActive = currentTab === tab.value;

            return (
              <button
                key={tab.value || "all"}
                onClick={() => handleTabChange(tab.value)}
                className={`pb-2 text-sm font-medium transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-indigo-600 font-bold"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-600 rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>

        {/* Nút Duyệt Mở Modal - Chỉ hiển thị khi ở tab "Chờ xét tuyển" */}
        {currentTab === "pending" && students.length > 0 && (
          <button
            onClick={() => setIsOpenApproveModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 dynamic-btn shrink-0 whitespace-nowrap"
          >
            <span>✓</span> Duyệt toàn bộ hồ sơ
          </button>
        )}
      </div>

      {/* KHỐI TABLE */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-50/70 border-b border-slate-200"
                >
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as any;
                    return (
                      <th
                        key={header.id}
                        className={`px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider ${
                          meta?.className || ""
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoadingStudents ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: columns.length }).map((_, colIdx) => (
                      <td key={colIdx} className="px-5 py-4">
                        <div className="h-4 bg-slate-200/80 rounded-md w-full max-w-[120px]"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as any;
                      return (
                        <td
                          key={cell.id}
                          className={`px-5 py-3.5 text-slate-700 ${
                            meta?.className || ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-400 font-medium bg-slate-50/20"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xl">📭</span>
                      <span>Không có dữ liệu sinh viên nào được tìm thấy.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* THANH PHÂN TRANG (PAGINATION PANEL) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-sm text-slate-500">
            Hiển thị dòng{" "}
            <span className="font-semibold text-slate-700">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, total || 0)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-slate-700">{total}</span> học
            sinh
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingStudents}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoadingStudents}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoadingStudents}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* MODAL BOX NHỎ GỌN XÉT DUYỆT HÀNG LOẠT */}
      {isOpenApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100 flex flex-col gap-4 transform transition-all scale-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Xác nhận duyệt hàng loạt
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hệ thống sẽ tự động lọc và duyệt theo danh sách các học sinh có
                điều kiện tốt nhất.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Số lượng học sinh tối đa muốn duyệt:
              </label>
              <input
                type="number"
                min="1"
                placeholder="Để trống nếu muốn duyệt toàn bộ trang"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
              />
              <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-1.5 rounded-lg mt-1">
                ⚠️{" "}
                {maxStudents
                  ? `Sẽ tiến hành duyệt tối đa ${maxStudents} hồ sơ.`
                  : "Để trống sẽ thực hiện duyệt TOÀN BỘ hồ sơ hợp lệ ở trang này."}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsOpenApproveModal(false);
                  setMaxStudents("");
                }}
                disabled={isPendingApprove}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isPendingApprove}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-xl shadow-sm transition-all flex items-center gap-1.5 min-w-[90px] justify-center"
              >
                {isPendingApprove ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang duyệt...
                  </>
                ) : (
                  "Xác nhận duyệt"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHoSoHocSinh;
