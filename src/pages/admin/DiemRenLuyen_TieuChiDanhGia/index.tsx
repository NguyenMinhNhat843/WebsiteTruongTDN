import { useState } from "react";
import {
  Plus,
  Award,
  Loader2,
  RefreshCw,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { $api } from "../../../api/client";
import CreateTieuChiChamDiem from "./CreateTieuChiChamDiem";

export type UpdateCriterionDto = {
  maxScore: number;
  sortOrder: number;
  title: string;
};

const DiemRenLuyen_TieuChiDanhGiaIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State quản lý tiêu chí đang được chọn để chỉnh sửa (nếu null nghĩa là modal đang đóng)
  const [editingItem, setEditingItem] = useState<{
    id: number;
    title: string;
    maxScore: number;
    sortOrder: number;
  } | null>(null);

  // Lấy dữ liệu danh sách tiêu chí từ API
  const {
    data: tieuChiDanhGia,
    isLoading,
    refetch,
  } = $api.useQuery("get", "/assessment/criteria");

  // Hàm định dạng ngày tháng hiển thị gọn gàng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // API Xóa
  const { mutate: deleteTieuChiChamDiem, isPending: isDeleting } =
    $api.useMutation("delete", "/assessment/criteria/{id}", {
      onSuccess: () => {
        alert("Xóa tiêu chí thành công!");
        refetch();
      },
      onError: (error) => {
        alert("Xóa thất bại: " + (error as any)?.message);
      },
    });

  // API Sửa
  const { mutate: updateTieuChiChamDiem, isPending: isUpdating } =
    $api.useMutation("patch", "/assessment/criteria/{id}", {
      onSuccess: () => {
        alert("Cập nhật tiêu chí thành công!");
        setEditingItem(null); // Đóng modal sửa
        refetch(); // Tải lại danh sách
      },
      onError: (error) => {
        alert("Cập nhật thất bại: " + (error as any)?.message);
      },
    });

  // Xử lý khi nhấn nút Xóa
  const handleDelete = (id: number, title: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa tiêu chí: "${title}" không?`)
    ) {
      deleteTieuChiChamDiem({ params: { path: { id } } });
    }
  };

  // Xử lý khi Submit form chỉnh sửa
  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const body: UpdateCriterionDto = {
      title: formData.get("title") as string,
      maxScore: Number(formData.get("maxScore")),
      sortOrder: Number(formData.get("sortOrder")),
    };

    updateTieuChiChamDiem({
      params: { path: { id: editingItem.id } },
      body: body as any, // Ép kiểu nếu đặc tả openapi client yêu cầu wrapper
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Phần Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Thang điểm & Tiêu chí đánh giá
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình danh mục các tiêu chí chấm điểm rèn luyện, điểm tối đa và
            thứ tự hiển thị của từng mục.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          Tạo tiêu chí
        </button>
      </div>

      {/* 2. Nội dung chính: Trạng thái Loading / Trống / Bảng dữ liệu */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium">Đang tải danh sách tiêu chí...</p>
        </div>
      ) : !tieuChiDanhGia || tieuChiDanhGia.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 px-4 text-center">
          <div className="p-3 bg-gray-50 text-gray-400 rounded-full mb-3">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Chưa có tiêu chí nào
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            Hệ thống chưa ghi nhận tiêu chí chấm điểm rèn luyện nào. Hãy bắt đầu
            bằng cách bấm "Tạo tiêu chí".
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5 w-20 text-center">STT / Thứ tự</th>
                  <th className="px-6 py-3.5">Nội dung tiêu chí đánh giá</th>
                  <th className="px-6 py-3.5 w-32 text-center">Điểm tối đa</th>
                  <th className="px-6 py-3.5 w-40">Ngày cấu hình</th>
                  <th className="px-6 py-3.5 w-36 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {tieuChiDanhGia.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Thứ tự sắp xếp (sortOrder) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded min-w-[24px]">
                        {item.sortOrder}
                      </span>
                    </td>

                    {/* Tiêu đề / Nội dung tiêu chí */}
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-md">
                      <div className="line-clamp-2 hover:line-clamp-none transition-all duration-300 whitespace-pre-wrap leading-relaxed">
                        {item.title}
                      </div>
                    </td>

                    {/* Điểm tối đa (maxScore) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        {item.maxScore} đ
                      </span>
                    </td>

                    {/* Ngày tạo hoặc cập nhật gần nhất */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>

                    {/* Thao tác Sửa / Xóa */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            id: item.id,
                            title: item.title,
                            maxScore: item.maxScore,
                            sortOrder: item.sortOrder,
                          })
                        }
                        className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" /> Sửa
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(item.id, item.title)}
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer nhỏ thống kê tổng số lượng tiêu chí */}
          <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span>
              Tổng cộng: <strong>{tieuChiDanhGia.length}</strong> tiêu chí đánh
              giá
            </span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Làm mới
            </button>
          </div>
        </div>
      )}

      {/* 3. Gọi Modal tạo tiêu chí */}
      <CreateTieuChiChamDiem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* 4. Modal cập nhật tiêu chí (Render inline để code tinh gọn) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900">
                Cập nhật tiêu chí
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Nội dung tiêu chí
                </label>
                <textarea
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Điểm tối đa
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    required
                    min={0}
                    defaultValue={editingItem.maxScore}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    required
                    min={0}
                    defaultValue={editingItem.sortOrder}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiemRenLuyen_TieuChiDanhGiaIndex;
