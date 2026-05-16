import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useLopHocPhanOneContext,
  type StudentData,
} from "./LopHocPhanOneProvider";

interface ModalAddStudentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddStudent = ({ isOpen, onClose }: ModalAddStudentProps) => {
  const {
    addStudentToLopHocPhan,
    eligibleStudentsData,
    isLoadingEligibleStudents,
    lopHocPhanId,
  } = useLopHocPhanOneContext();

  // Chỉ dùng duy nhất 1 biến state này như bạn mong muốn
  const [studentSelectedId, setStudentSelectedId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Khởi tạo Định nghĩa Cột
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<StudentData>();

    return [
      {
        id: "select",
        header: () => (
          <div className="text-center font-semibold text-slate-500">Chọn</div>
        ),
        cell: (info) => (
          <div className="flex items-center justify-center">
            <input
              type="radio"
              name="eligible-student-radio"
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              // Kiểm tra xem ID của hàng hiện tại có khớp với state đang chọn hay không
              checked={studentSelectedId === info.row.original.id}
              onChange={() => setStudentSelectedId(info.row.original.id)}
            />
          </div>
        ),
      },
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="text-slate-400 font-mono text-xs">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("studentCode", {
        header: "Mã SV",
        cell: (info) => (
          <span className="font-semibold text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Họ và tên",
        cell: (info) => (
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        ),
      }),
    ];
  }, [studentSelectedId]); // Re-render lại cột khi state thay đổi để cập nhật dấu tích Radio

  // 3. Khởi tạo TanStack Table cơ bản (Không cần truyền state rowSelection)
  const table = useReactTable({
    data: eligibleStudentsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 4. Xử lý hành động Thêm học sinh
  const handleAddStudents = async () => {
    if (!studentSelectedId) return;

    try {
      setIsSubmitting(true);
      // Truyền mảng chứa 1 ID duy nhất để tương thích với API nhận vào Array
      await addStudentToLopHocPhan(
        {
          body: {
            studentId: studentSelectedId, // Gửi dưới dạng mảng dù chỉ có 1 ID
            courseOfferId: lopHocPhanId!, // Lấy từ context
            note: "",
          },
        },
        {
          onSuccess: () => {
            alert("Đã thêm học sinh vào lớp học phần thành công!");
            onClose();
          },
        },
      );
      setStudentSelectedId(null); // Reset state
      onClose();
    } catch (error) {
      console.error("Lỗi thêm học sinh:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[85vh] border border-slate-100 animate-scale-up">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Thêm học sinh vào lớp học phần
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chọn duy nhất một sinh viên khả dụng để xếp lớp
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body Modal */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {isLoadingEligibleStudents ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-11 bg-slate-100 rounded-lg animate-pulse w-full"
                />
              ))}
            </div>
          ) : eligibleStudentsData.length > 0 ? (
            <div className="border border-slate-100 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-3 whitespace-nowrap">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {table.getRowModel().rows.map((row) => {
                    const isSelected = studentSelectedId === row.original.id;
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer ${isSelected ? "bg-blue-50/30 hover:bg-blue-50/50" : ""}`}
                        // Bấm vào bất cứ đâu trên dòng đều kích hoạt chọn học sinh đó
                        onClick={() => setStudentSelectedId(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-3 align-middle whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-slate-300"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
              <p className="text-sm font-medium">
                Không tìm thấy sinh viên phù hợp khả dụng
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          <div className="text-sm font-medium text-slate-500">
            {studentSelectedId !== null && (
              <span className="text-blue-600 font-semibold">
                Đã xác định học sinh cần thêm
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleAddStudents}
              disabled={studentSelectedId === null || isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg active:scale-[0.98] shadow-sm shadow-blue-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Xác nhận thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddStudent;
