import { useState } from "react";
import ModalCreatePhongHoc from "./Create/ModalCreatePhongHoc";
import RoomList from "./List/RoomList";

const PhongHocIndex = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

  // Hàm được kích hoạt khi tạo phòng thành công ở Modal
  const handleCreateSuccess = () => {
    // Lát nữa bạn có thể gọi hàm refetch danh sách phòng ở đây
    console.log("Tạo phòng thành công, đang làm mới danh sách...");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
      {/* Container giới hạn chiều rộng để giao diện không bị loãng trên màn hình lớn */}
      <div className="mx-auto max-w-7xl">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Quản lý Phòng Học
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Danh sách, phân loại cấu hình và không gian giảng dạy của trường
              trung cấp nghề.
            </p>
          </div>

          {/* Nút Thêm phòng học mới */}
          <button
            type="button"
            onClick={() => setIsOpenCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
          >
            {/* Icon dấu cộng (Plus SVG) */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Thêm phòng học
          </button>
        </div>

        {/* --- BODY SECTION (Tạm trống) --- */}
        <RoomList />
      </div>

      {/* --- MODAL CONTROL --- */}
      <ModalCreatePhongHoc
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default PhongHocIndex;
