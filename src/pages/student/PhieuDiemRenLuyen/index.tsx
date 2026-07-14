import { useState } from "react";
import { useAppContext } from "../../../AppProvider";
import { FileSpreadsheet, Loader2, Calendar } from "lucide-react";
import { $api } from "../../../api/client";
import ModalPhieuDiemRenLuyen from "../../admin/LopDanhNghia/LopHocOne/ModalPhieuDiemRenLuyen";

const StudentPhieuDiemRenLuyenIndex = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.profile?.id;

  // 1. Quản lý state cho việc chọn Học kỳ và đóng/mở Modal
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 2. API: Lấy danh sách học kỳ
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
    {
      params: {
        query: {
          ...(studentId ? { studentId: Number(studentId) } : {}),
        },
      },
    },
    { enabled: !!studentId },
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header trang */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-900">
          Phiếu Điểm Rèn Luyện
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Xem danh sách học kỳ và tự đánh giá kết quả rèn luyện của bản thân.
        </p>
      </div>

      {/* Giao diện chính */}
      {isLoadingSemesters ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Đang tải danh sách học kỳ...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {semesters?.map((semester: any) => (
            <div
              key={semester.id}
              className="flex flex-col justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar size={18} />
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    {semester.schoolYear}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {semester.name}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Hạn nộp: Đang cập nhật
                </span>
                <button
                  onClick={() => {
                    setSelectedSemesterId(semester.id);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FileSpreadsheet size={14} />
                  Vào đánh giá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Khai báo Modal */}
      {isModalOpen && selectedSemesterId && studentId && (
        <ModalPhieuDiemRenLuyen
          studentId={Number(studentId)}
          semesterId={selectedSemesterId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSemesterId(null);
          }}
          isTeacher={false} // Đây là Sinh viên tự đánh giá
        />
      )}
    </div>
  );
};

export default StudentPhieuDiemRenLuyenIndex;
