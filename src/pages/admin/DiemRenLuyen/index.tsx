import { useState } from "react";
import {
  Plus,
  Calendar,
  Shield,
  ShieldAlert,
  Loader2,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { $api } from "../../../api/client";
import CreateDotDanhGia from "./Create/CreateDotDanhGia";

const DiemRenLuyenIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy dữ liệu danh sách đợt đánh giá
  const {
    data: periods,
    isLoading: isLoadingPeriods,
    refetch,
  } = $api.useQuery("get", "/assessment/periods");

  // Hàm định dạng ngày tháng hiển thị trực quan
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản lý điểm rèn luyện
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi, kích hoạt hoặc khóa dữ liệu các đợt chấm điểm rèn luyện
            của sinh viên.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          Tạo đợt đánh giá
        </button>
      </div>

      {/* 2. Danh sách dạng Card */}
      {isLoadingPeriods ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">
            Đang tải danh sách đợt đánh giá...
          </p>
        </div>
      ) : !periods || periods.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 px-4 text-center">
          <div className="p-3 bg-gray-50 text-gray-400 rounded-full mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Không có dữ liệu
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            Hiện chưa có đợt đánh giá nào. Hãy nhấn nút "Tạo đợt đánh giá" để
            bắt đầu.
          </p>
        </div>
      ) : (
        // Responsive Grid layout: 1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop lớn
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {periods.map((period) => (
            <div
              key={period.id}
              className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div>
                {/* Phần Trạng thái (Badges) */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Trạng thái Hoạt động */}
                  {period.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200/60">
                      Tạm ẩn
                    </span>
                  )}

                  {/* Trạng thái Khóa điểm */}
                  {period.isFrozen ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      Đã khóa điểm
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      Đang mở nhập
                    </span>
                  )}
                </div>

                {/* Tên đợt đánh giá */}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.75rem] text-base leading-snug">
                  {period.name}
                </h3>
              </div>

              {/* Phần thông tin chân Card & Nút hành động */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <span>Tạo ngày: {formatDate(period.createdAt)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Xem chi tiết đợt ID: ${period.id}`)}
                  className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  Chi tiết
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Modal tạo mới */}
      <CreateDotDanhGia
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch(); // Reload danh sách sau khi thêm mới
        }}
      />
    </div>
  );
};

export default DiemRenLuyenIndex;
