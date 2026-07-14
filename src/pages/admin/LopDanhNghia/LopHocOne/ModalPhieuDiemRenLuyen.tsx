import { useEffect, useState } from "react";
import {
  X,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { $api } from "../../../../api/client";
import { toast } from "sonner";

interface ModalPhieuDiemRenLuyenProps {
  studentId: number;
  semesterId: number;
  isOpen: boolean;
  onClose: () => void;
  isTeacher?: boolean; // Khác biệt giao diện giữa Giáo viên và Học sinh
}

const ModalPhieuDiemRenLuyen = ({
  studentId,
  semesterId,
  isOpen,
  onClose,
  isTeacher = true,
}: ModalPhieuDiemRenLuyenProps) => {
  // 1. Gọi API Load Phiếu Điểm
  const {
    data: assessmentData,
    isLoading,
    refetch,
  } = $api.useQuery(
    "get",
    "/assessment/load",
    {
      params: {
        query: {
          studentId,
          semesterId,
        },
      },
    },
    { enabled: isOpen && !!studentId && !!semesterId },
  );

  // Giả định mutation cập nhật dữ liệu của bạn
  const { mutate: updateAssessment, isPending: isUpdating } = $api.useMutation(
    "post",
    "/assessment/submit",
  );

  // 2. State quản lý form cục bộ
  const [scores, setScores] = useState<
    Record<number, { studentScore: number; teacherScore: number }>
  >({});
  const [comment, setComment] = useState<string>("");

  // Đồng bộ data từ API vào State khi dữ liệu tải xong
  useEffect(() => {
    if (assessmentData?.details) {
      const initialScores: typeof scores = {};
      assessmentData.details.forEach((detail) => {
        initialScores[detail.id] = {
          studentScore: detail.studentScore,
          teacherScore: detail.teacherScore,
        };
      });
      setScores(initialScores);
      setComment((assessmentData.teacherComment as string) || "");
    }
  }, [assessmentData]);

  // Nếu modal không mở hoặc đang load dữ liệu thì không render
  if (!isOpen) return null;

  // 3. Sắp xếp danh sách tiêu chí theo thứ tự sortOrder tăng dần
  const sortedDetails = [...(assessmentData?.details || [])].sort(
    (a, b) =>
      a.periodCriterion.criterion.sortOrder -
      b.periodCriterion.criterion.sortOrder,
  );

  // 4. Tính toán tổng điểm real-time trên giao diện
  const totalMaxScore = sortedDetails.reduce(
    (sum, item) => sum + item.periodCriterion.criterion.maxScore,
    0,
  );
  const totalStudentScore = Object.values(scores).reduce(
    (sum, item) => sum + (item.studentScore || 0),
    0,
  );
  const totalTeacherScore = Object.values(scores).reduce(
    (sum, item) => sum + (item.teacherScore || 0),
    0,
  );

  // 5. Kiểm tra quyền chỉnh sửa dựa trên trạng thái phiếu điểm
  const isApproved = assessmentData?.status === "APPROVED";
  const isPending = assessmentData?.status === "PENDING";

  const canEditStudentScore =
    !isTeacher && assessmentData?.status === "NOT_SUBMITTED";
  const canEditTeacherScore = isTeacher && isPending;

  // 6. Xử lý lưu dữ liệu
  const handleSave = (submitStatus?: "PENDING" | "APPROVED") => {
    const payload = {
      assessmentId: assessmentData!.id!,
      status: submitStatus || assessmentData?.status || "NOT_SUBMITTED",
      teacherComment: isTeacher ? comment : "",
      details: Object.entries(scores).map(([id, val]) => ({
        id: Number(id),
        studentScore: val.studentScore,
        teacherScore: val.teacherScore,
      })),
    };

    updateAssessment(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật phiếu điểm thành công!");
          refetch();
          if (submitStatus) onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại."),
      },
    );
  };

  // Helper render badge trạng thái bằng màu Tailwind chuẩn
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200">
            <CheckCircle size={14} /> Đã duyệt
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-200">
            <AlertCircle size={14} /> Chờ duyệt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200">
            <FileText size={14} /> Nháp / Chưa nộp
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Phiếu Điểm Rèn Luyện
            </h3>
            {renderStatusBadge(assessmentData?.status)}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Có Thể Cuộn) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            // Hiện spinner khi đang load data ban đầu
            <div className="flex flex-col items-center justify-center space-y-2 py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">
                Đang tải dữ liệu phiếu điểm...
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">STT</th>
                      <th className="px-4 py-3">Tiêu chí đánh giá</th>
                      <th className="px-4 py-3 text-center w-28">
                        Điểm tối đa
                      </th>
                      <th className="px-4 py-3 text-center w-36">Sinh viên</th>
                      <th className="px-4 py-3 text-center w-36">GVCN duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    {sortedDetails.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-center font-medium text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.periodCriterion.criterion.title}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-100">
                            {item.periodCriterion.criterion.maxScore}đ
                          </span>
                        </td>
                        {/* Input Sinh Viên */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={item.periodCriterion.criterion.maxScore}
                            disabled={!canEditStudentScore}
                            value={scores[item.id]?.studentScore ?? 0}
                            onChange={(e) => {
                              const val = Math.min(
                                item.periodCriterion.criterion.maxScore,
                                Math.max(0, parseInt(e.target.value) || 0),
                              );
                              setScores((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...prev[item.id],
                                  studentScore: val,
                                },
                              }));
                            }}
                            className="w-20 px-2 py-1 text-center bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                          />
                        </td>
                        {/* Input Giáo Viên */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={item.periodCriterion.criterion.maxScore}
                            disabled={!canEditTeacherScore}
                            value={scores[item.id]?.teacherScore ?? 0}
                            onChange={(e) => {
                              const val = Math.min(
                                item.periodCriterion.criterion.maxScore,
                                Math.max(0, parseInt(e.target.value) || 0),
                              );
                              setScores((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...prev[item.id],
                                  teacherScore: val,
                                },
                              }));
                            }}
                            className="w-20 px-2 py-1 text-center bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Footer Table hiển thị tổng điểm đạt được */}
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200 font-bold text-gray-900">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3.5 text-right text-gray-600"
                      >
                        Tổng điểm đạt được:
                      </td>
                      <td className="px-4 py-3.5 text-center text-blue-700">
                        {totalMaxScore}đ
                      </td>
                      <td className="px-4 py-3.5 text-center text-blue-600">
                        {totalStudentScore}đ
                      </td>
                      <td className="px-4 py-3.5 text-center text-emerald-600">
                        {totalTeacherScore}đ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Ô nhận xét ý kiến của GVCN */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Ý kiến / Nhận xét của GVCN:
                </label>
                <textarea
                  rows={3}
                  disabled={!canEditTeacherScore}
                  value={comment}
                  placeholder={
                    isTeacher
                      ? "Nhập nhận xét đánh giá tại đây..."
                      : "Chưa có ý kiến nhận xét từ GVCN"
                  }
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-400 resize-none text-sm"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer chứa Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>

          {/* Actions dành cho Sinh Viên */}
          {canEditStudentScore && (
            <>
              <button
                onClick={() => handleSave()}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Thay icon Save bằng Spinner nếu đang updating */}
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Lưu nháp
              </button>

              <button
                onClick={() => handleSave("PENDING")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {/* Thêm hiệu ứng Spinner chạy trước chữ */}
                {isUpdating && <Loader2 size={16} className="animate-spin" />}
                Nộp phiếu điểm
              </button>
            </>
          )}

          {/* Actions dành cho Giáo Viên */}
          {canEditTeacherScore && (
            <>
              <button
                onClick={() => handleSave()}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Thay icon Save bằng Spinner nếu đang updating */}
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Lưu thay đổi
              </button>

              <button
                onClick={() => handleSave("APPROVED")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isUpdating && <Loader2 size={16} className="animate-spin" />}
                Duyệt & Khóa phiếu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPhieuDiemRenLuyen;
