import { useState } from "react";
import {
  Plus,
  Award,
  Loader2,
  RefreshCw,
  Trash2,
  Edit2,
  X,
  ClipboardCheck,
} from "lucide-react";
import { $api } from "../../../api/client";
import CreateTieuChiChamDiem from "./CreateTieuChiChamDiem";
import PageShell from "../../../components/ui/PageShell"; // Đường dẫn thực tế tới component PageShell của bạn
import { toast } from "sonner";

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
        toast.success("Xóa tiêu chí thành công!");
        refetch();
      },
      onError: (error) => {
        toast.error("Xóa thất bại: " + (error as any)?.message);
      },
    });

  // API Sửa
  const { mutate: updateTieuChiChamDiem, isPending: isUpdating } =
    $api.useMutation("patch", "/assessment/criteria/{id}", {
      onSuccess: () => {
        toast.success("Cập nhật tiêu chí thành công!");
        setEditingItem(null); // Đóng modal sửa
        refetch(); // Tải lại danh sách
      },
      onError: (error) => {
        toast.error("Cập nhật thất bại: " + (error as any)?.message);
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
      body: body as any,
    });
  };

  return (
    <PageShell
      title="Thang điểm & Tiêu chí đánh giá"
      sub="Cấu hình danh mục các tiêu chí chấm điểm rèn luyện, điểm tối đa và thứ tự hiển thị của từng mục."
      icon={ClipboardCheck}
      isLoading={isLoading}
      renderRight={
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Tạo tiêu chí
        </button>
      }
    >
      {/* 1. KHÔNG CÓ DỮ LIỆU */}
      {!tieuChiDanhGia || tieuChiDanhGia.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-16 px-4 text-center bg-white">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-3">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            Chưa có tiêu chí nào được tạo
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
            Hệ thống chưa ghi nhận tiêu chí chấm điểm rèn luyện nào. Hãy bắt đầu
            bằng cách bấm nút "Tạo tiêu chí".
          </p>
        </div>
      ) : (
        /* 2. BẢNG DỮ LIỆU CHUẨN XANH DƯƠNG */
        <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/50 border-b border-slate-200 text-xs font-bold text-blue-900/80 uppercase tracking-wider">
                  <th className="px-6 py-4 w-20 text-center">STT</th>
                  <th className="px-6 py-4">Nội dung tiêu chí đánh giá</th>
                  <th className="px-6 py-4 w-32 text-center">Điểm tối đa</th>
                  <th className="px-6 py-4 w-40">Ngày cấu hình</th>
                  <th className="px-6 py-4 w-36 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {tieuChiDanhGia.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    {/* Số thứ tự hiển thị chuẩn theo chỉ mục index */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg min-w-[26px]">
                        {index + 1}
                      </span>
                    </td>

                    {/* Tiêu đề / Nội dung tiêu chí */}
                    <td className="px-6 py-4 font-semibold text-slate-900 max-w-md">
                      <div className="line-clamp-2 hover:line-clamp-none transition-all duration-300 whitespace-pre-wrap leading-relaxed">
                        {item.title}
                      </div>
                    </td>

                    {/* Điểm tối đa (maxScore) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center font-bold text-blue-700 bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-100">
                        {item.maxScore} đ
                      </span>
                    </td>

                    {/* Ngày tạo hoặc cập nhật gần nhất */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>

                    {/* Thao tác Sửa / Xóa */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* NÚT SỬA */}
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() =>
                            setEditingItem({
                              id: item.id,
                              title: item.title,
                              maxScore: item.maxScore,
                              sortOrder: item.sortOrder || 0,
                            })
                          }
                          className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 active:scale-90 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4 stroke-[2.2]" />
                        </button>

                        {/* NÚT XÓA */}
                        <button
                          type="button"
                          title="Xóa tiêu chí"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id, item.title)}
                          className="inline-flex items-center justify-center p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 active:scale-90 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <Trash2 className="h-4 w-4 stroke-[2.2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer nhỏ thống kê */}
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>
              Tổng cộng:{" "}
              <strong className="text-slate-800">
                {tieuChiDanhGia.length}
              </strong>{" "}
              tiêu chí đánh giá
            </span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors font-bold"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Làm mới dữ liệu
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

      {/* 4. Modal cập nhật tiêu chí (Tông màu xanh dương đồng bộ) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">
                Cập nhật tiêu chí đánh giá
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nội dung tiêu chí
                </label>
                <textarea
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Điểm tối đa
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    required
                    min={0}
                    defaultValue={editingItem.maxScore}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Thứ tự sắp xếp
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    required
                    min={0}
                    defaultValue={editingItem.sortOrder}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default DiemRenLuyen_TieuChiDanhGiaIndex;
