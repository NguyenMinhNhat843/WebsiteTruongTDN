import RowActions from "./components/RowAction";
import { useHocSinhContext } from "../HocSinhProvider";
import { formatDate } from "../../../../util/formatDate";
import { BadgeStudentStatus } from "../../../../components/enum/StudentStatusBadge";

const TableHoSoHocSinh = () => {
  const {
    navigate,
    students,
    deleteStudent,
    isLoadingStudents,
    filters,
    setFilters,
    total, // Tổng số học sinh (ví dụ: 100)
  } = useHocSinhContext();

  // Lấy trang hiện tại và kích thước trang (limit) để tính toán
  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;

  // Tính tổng số trang: Chia tổng số phần tử cho limit và làm tròn lên
  const totalPages = Math.ceil((total || 0) / pageSize) || 1;

  // Hàm chuyển trang bảo vệ ranh giới từ 1 đến totalPages
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

  return (
    <div className="w-full flex flex-col gap-4">
      {/* KHỐI TABLE */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider w-[60px]">
                  STT
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Họ và tên
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Lớp học
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Khóa đào tạo
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Hồ sơ
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Đánh giá
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-right pr-7">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* 1. TRẠNG THÁI LOADING SKELETON */}
              {isLoadingStudents ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, colIdx) => (
                      <td key={colIdx} className="px-5 py-4">
                        <div className="h-4 bg-slate-200/80 rounded-md w-full max-w-[120px]"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : students.length > 0 ? (
                /* 2. TRẠNG THÁI CÓ DỮ LIỆU */
                students.map((student, index) => {
                  const stt = (currentPage - 1) * pageSize + index + 1;
                  const progress = student.documentProgress;
                  const isCompleted =
                    progress &&
                    progress.current === progress.total &&
                    progress.total > 0;

                  const isQualified = student.isQualified;

                  return (
                    <tr
                      key={student.id || index}
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      {/* STT */}
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {stt}
                      </td>

                      {/* Họ và tên */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <div className="font-bold text-slate-800 text-[13px]">
                            {(student.fullName as unknown as string) ||
                              "Chưa có tên"}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {typeof student.gender === "boolean"
                              ? student.gender
                                ? "Nam"
                                : "Nữ"
                              : "Chưa xác định"}{" "}
                            · {formatDate(String(student.dob))}
                          </div>
                        </div>
                      </td>

                      {/* Lớp học */}
                      <td className="px-5 py-3.5 text-slate-700">
                        {student.class?.classCode ? (
                          student.class.classCode
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/60 shadow-sm select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Chưa phân lớp
                          </span>
                        )}
                      </td>

                      {/* Khóa đào tạo */}
                      <td className="px-5 py-3.5 text-slate-700">
                        {student.batch?.batchCode || "-"}
                      </td>

                      {/* Hồ sơ */}
                      <td className="px-5 py-3.5">
                        {progress ? (
                          <span
                            className={`inline-flex items-center justify-center font-semibold text-xs px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                                : "bg-amber-50 text-amber-600 border border-amber-200/50"
                            }`}
                          >
                            {progress.current}/{progress.total}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Đánh giá (QUALIFIED) */}
                      <td className="px-5 py-3.5">
                        {isQualified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            Đạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Không đạt
                          </span>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-3.5">
                        <BadgeStudentStatus status={student.status} />
                      </td>

                      {/* Thao tác */}
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          <RowActions
                            onView={() =>
                              navigate(
                                `/admin/hoc-sinh/ho-so/${student.studentCode}`,
                              )
                            }
                            onDelete={() =>
                              handleDelete(
                                student.id || -1,
                                student.studentCode || "",
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* 3. TRẠNG THÁI TRỐNG */
                <tr>
                  <td
                    colSpan={8}
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

            {/* Tạo các nút bấm dựa trên totalPages đã tính toán */}
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
    </div>
  );
};

export default TableHoSoHocSinh;
