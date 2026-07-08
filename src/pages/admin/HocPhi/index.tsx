import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { $api } from "../../../api/client";
import ModalCreateDotHocPhi from "./Create/ModalCreateDotHocPhi";

const DotHocPhiIndex = () => {
  // --- State quản lý Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTuitionId, setSelectedTuitionId] = useState<
    number | undefined
  >(undefined);

  // 1. Query: Lấy danh sách đợt học phí
  const {
    data: dotHocPhiList,
    isLoading,
    refetch,
  } = $api.useQuery("get", "/tuition-periods");

  // 2. Mutation: Xóa đợt học phí
  const { mutate: deleteDotHocPhi } = $api.useMutation(
    "delete",
    "/tuition-periods/{id}",
  );

  // --- Xử lý các sự kiện ---
  const handleOpenCreateModal = () => {
    setSelectedTuitionId(undefined); // Reset ID về undefined để nhận diện là Create mode
    setIsModalOpen(true);
  };

  const handleOpenUpdateModal = (id: number) => {
    setSelectedTuitionId(id); // Set ID để nhận diện là Update mode
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa đợt học phí "${name}" không?`)
    ) {
      deleteDotHocPhi(
        {
          params: { path: { id } },
        },
        {
          onSuccess: () => {
            alert("Xóa đợt học phí thành công!");
            refetch(); // Reload lại danh sách sau khi xóa thành công
          },
          onError: (error) => {
            alert("Có lỗi xảy ra khi xóa!");
            console.error(error);
          },
        },
      );
    }
  };

  // Định dạng hiển thị ngày tháng nhanh gọn
  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý đợt học phí
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem, tạo mới và cấu hình thời gian đóng học phí của các học kỳ.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm đợt học phí</span>
        </button>
      </div>

      {/* --- DANH SÁCH / BẢNG --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Đang tải danh sách đợt học phí...
          </p>
        </div>
      ) : !dotHocPhiList || dotHocPhiList.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">
            Chưa có đợt học phí nào được tạo
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="text-sm text-blue-600 font-semibold hover:underline mt-1"
          >
            Tạo đợt học phí ngay
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Tên đợt học phí</th>
                  <th className="px-6 py-3.5">Mã học kỳ</th>
                  <th className="px-6 py-3.5">Thời gian áp dụng</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {dotHocPhiList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Tên đợt */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.name}
                    </td>

                    {/* ID Học kỳ */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        Kỳ {item.semesterId}
                      </span>
                    </td>

                    {/* Thời gian */}
                    <td className="px-6 py-4 text-slate-500 space-y-0.5">
                      <div className="text-xs">
                        <span className="font-medium text-slate-400">Từ:</span>{" "}
                        {formatDisplayDate(item.startDate)}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-slate-400">Đến:</span>{" "}
                        {formatDisplayDate(item.endDate)}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200/50">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đang hoạt động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full border border-rose-200/50">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Đã khóa</span>
                        </span>
                      )}
                    </td>

                    {/* Nút bấm Thao tác */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenUpdateModal(item.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL DÙNG CHUNG (CREATE/UPDATE) --- */}
      <ModalCreateDotHocPhi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tuitionId={selectedTuitionId}
        onSuccess={() => {
          refetch(); // Kích hoạt reload lại data bảng khi submit form thành công
        }}
      />
    </div>
  );
};

export default DotHocPhiIndex;
