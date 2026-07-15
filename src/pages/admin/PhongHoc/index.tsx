import { useState } from "react";
import { DoorOpen, Plus } from "lucide-react"; // Import icon từ Lucide
import PageShell from "../../../components/ui/PageShell"; // Đường dẫn thực tế tới component PageShell của bạn
import ModalCreatePhongHoc from "./Create/ModalCreatePhongHoc";
import RoomList from "./List/RoomList";

const PhongHocIndex = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Có thể liên kết với trạng thái fetching dữ liệu thực tế nếu có

  // Hàm được kích hoạt khi tạo phòng thành công ở Modal
  const handleCreateSuccess = () => {
    // Lát nữa bạn có thể gọi hàm refetch danh sách phòng ở đây
    console.log("Tạo phòng thành công, đang làm mới danh sách...");
  };

  return (
    <PageShell
      title="Quản lý Phòng Học"
      sub="Danh sách, phân loại cấu hình và không gian giảng dạy của trường trung cấp nghề."
      icon={DoorOpen}
      isLoading={isLoading}
      renderRight={
        <button
          type="button"
          onClick={() => setIsOpenCreateModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
        >
          <Plus size={18} className="stroke-[2.5]" />
          Thêm phòng học
        </button>
      }
    >
      {/* --- BODY SECTION --- */}
      <div className="py-2">
        <RoomList />
      </div>

      {/* --- MODAL CONTROL --- */}
      <ModalCreatePhongHoc
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </PageShell>
  );
};

export default PhongHocIndex;
