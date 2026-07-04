import { useState } from "react";
import { Plus, Award, Loader2, RefreshCw } from "lucide-react";
import { $api } from "../../../api/client";
import CreateTieuChiChamDiem from "./CreateTieuChiChamDiem"; // Điều chỉnh lại đường dẫn cho đúng cấu trúc của bạn

const DiemRenLuyen_TieuChiDanhGiaIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                  <th className="px-6 py-3.5 w-24 text-right">Thao tác</th>
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

                    {/* Thao tác nhanh */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-800 transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={() => {
                          alert(`Chỉnh sửa tiêu chí ID: ${item.id}`);
                        }}
                      >
                        Sửa
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
          refetch(); // Tự động cập nhật lại danh sách ngay sau khi thêm mới thành công
        }}
      />
    </div>
  );
};

export default DiemRenLuyen_TieuChiDanhGiaIndex;
