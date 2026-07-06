import React, { useEffect } from "react";
import { $api } from "../../../../api/client";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  User,
  ShieldCheck,
  Award,
  MessageSquare,
  TrendingUp,
  X,
} from "lucide-react";

interface CreateBangDiemRenLuyenProps {
  periodId: number;
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CreateBangDiemRenLuyenModal = ({
  periodId,
  userId,
  isOpen,
  onClose,
}: CreateBangDiemRenLuyenProps) => {
  const { data: studentAssessment, isLoading: isLoadingStudentAssessment } =
    $api.useQuery(
      "get",
      "/assessment/student/{id}/assessment",
      {
        params: {
          path: { id: userId },
          query: { periodId },
        },
      },
      {
        // Chỉ kích hoạt gọi API khi modal được mở thực sự
        enabled: isOpen,
      },
    );

  // Xử lý đóng modal khi nhấn phím ESC (Chuẩn UX)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Ngăn chặn cuộn trang phía sau khi đang mở modal
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper mapping trạng thái đánh giá
  const getStatusBadge = (
    status: NonNullable<typeof studentAssessment>["status"],
  ) => {
    const config = {
      APPROVED: {
        text: "Đã phê duyệt",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      PENDING: {
        text: "Chờ duyệt",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      NOT_SUBMITTED: {
        text: "Chưa nộp",
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertCircle,
      },
    };
    const current = config[status] || config.NOT_SUBMITTED;
    const Icon = current.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {current.text}
      </span>
    );
  };

  // Helper mapping xếp loại học lực/rèn luyện
  const getGradeBadge = (
    grade: NonNullable<typeof studentAssessment>["finalGrade"],
  ) => {
    if (!grade)
      return (
        <span className="text-slate-400 font-normal text-xs">
          Chưa xếp loại
        </span>
      );
    const config = {
      EXCELLENT: {
        text: "Xuất sắc",
        color: "text-purple-600 bg-purple-50 border-purple-200",
      },
      GOOD: {
        text: "Tốt",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      },
      FAIR: { text: "Khá", color: "text-blue-600 bg-blue-50 border-blue-200" },
      AVERAGE: {
        text: "Trung bình",
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      POOR: {
        text: "Yếu/Kém",
        color: "text-rose-600 bg-rose-50 border-rose-200",
      },
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-bold border ${config[grade].color}`}
      >
        {config[grade].text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased text-slate-800">
      {/* Lớp phủ mờ (Backdrop nền) */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Thân hộp thoại chính (Modal Box) */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] md:h-[85vh] flex flex-col rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 animate-in fade-in-50 zoom-in-95">
        {/* Nút đóng góc trên cùng bên phải */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Đóng hộp thoại"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PHẦN ĐẦU MODAL (Sticky Header) */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white pr-14 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Chi Tiết Bảng Điểm Rèn Luyện
            </h1>
            {studentAssessment && getStatusBadge(studentAssessment.status)}
          </div>
          {studentAssessment && (
            <p className="text-xs text-slate-400 mt-1">
              Cập nhật cuối:{" "}
              {new Date(studentAssessment.updatedAt).toLocaleDateString(
                "vi-VN",
              )}
            </p>
          )}
        </div>

        {/* THÂN MODAL (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {isLoadingStudentAssessment ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium animate-pulse">
                Đang truy vấn dữ liệu học sinh...
              </p>
            </div>
          ) : !studentAssessment ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] py-12 text-center bg-white border border-dashed border-slate-200 rounded-xl">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                Dữ liệu trống
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mt-1">
                Học sinh chưa có thông tin xếp loại rèn luyện trong đợt này.
              </p>
            </div>
          ) : (
            <>
              {/* Thẻ Điểm Tổng Hợp */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 grid grid-cols-3 gap-4 shadow-sm">
                <div className="text-center border-r border-slate-100 py-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center justify-center gap-1">
                    <User className="w-3 h-3" /> Tự đánh giá
                  </p>
                  <p className="text-xl font-black text-slate-700">
                    {studentAssessment.totalStudentScore}
                    <span className="text-xs font-normal text-slate-400 ml-0.5">
                      đ
                    </span>
                  </p>
                </div>
                <div className="text-center border-r border-slate-100 py-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-500" /> Hội đồng
                    chấm
                  </p>
                  <p className="text-xl font-black text-blue-600">
                    {studentAssessment.totalTeacherScore}
                    <span className="text-xs font-medium text-blue-400 ml-0.5">
                      đ
                    </span>
                  </p>
                </div>
                <div className="text-center py-1 flex flex-col justify-center items-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-purple-500" /> Xếp loại chung
                  </p>
                  <div className="mt-0.5">
                    {getGradeBadge(studentAssessment.finalGrade)}
                  </div>
                </div>
              </div>

              {/* Bảng Tiêu Chí Điểm Chi Tiết */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <h2 className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                    Danh mục chi tiết điểm số
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/30">
                        <th className="py-3 px-4 w-12 text-center">STT</th>
                        <th className="py-3 px-4">Nội dung tiêu chí</th>
                        <th className="py-3 px-4 text-center w-20">Tối đa</th>
                        <th className="py-3 px-4 text-center w-24">
                          Trò tự chấm
                        </th>
                        <th className="py-3 px-4 text-center w-24">
                          Thầy phê duyệt
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                      {studentAssessment.details?.length > 0 ? (
                        studentAssessment.details
                          .sort(
                            (a, b) =>
                              (a.criterion?.sortOrder || 0) -
                              (b.criterion?.sortOrder || 0),
                          )
                          .map((item, index) => {
                            const max = item.criterion?.maxScore || 100;
                            const progressPercent = Math.min(
                              100,
                              Math.max(0, (item.teacherScore / max) * 100),
                            );

                            return (
                              <tr
                                key={item.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                                  {index + 1}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1 max-w-lg">
                                    <span className="font-medium text-slate-900 block leading-tight">
                                      {item.criterion?.title ||
                                        "Nội dung tiêu chí chưa cập nhật"}
                                    </span>
                                    {/* Thanh đo mức độ điểm nhỏ tinh tế */}
                                    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                                  {max}
                                </td>
                                <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 text-xs">
                                    {item.studentScore}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center font-semibold text-blue-600">
                                  <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded text-blue-600 text-xs">
                                    {item.teacherScore}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-slate-400 text-sm"
                          >
                            Chưa ghi nhận điểm chi tiết.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box Nhận Xét từ Giáo Viên */}
              {studentAssessment.teacherComment && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2 text-blue-800 font-semibold text-xs uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <h3>Ý kiến/Nhận xét của Giáo viên</h3>
                  </div>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-blue-300">
                    {typeof studentAssessment.teacherComment === "string"
                      ? studentAssessment.teacherComment
                      : JSON.stringify(studentAssessment.teacherComment)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* PHẦN CHÂN MODAL (Sticky Footer) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBangDiemRenLuyenModal;
