import {
  Plus,
  Settings,
  User,
  Users,
  GraduationCap,
  BookOpen,
  Trash2,
  Edit2,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import { useKhoaContext } from "./KhoaProvider";
import CreateKhoaForm, { type CreateKhoaFormRef } from "./CreateKhoaForm";
import ButtonAction from "../../../components/ui/ButtonAction";
import Modal from "../../../components/ui/Modal";
import { useRef, useState } from "react";
import { LoadingWrapper } from "../../../components/ui/LoadingWrapper";

// Khai báo Type chuẩn theo cấu trúc bạn cung cấp
export type DepartmentItem = {
  id: number;
  headOfDepartmentId?: number | null | undefined;
  deptCode: string;
  deptName: string;
  description?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
  headOfDepartmentName?: any | null | undefined;
  totalMajors: number;
  totalStaffs: number;
  totalStudents: number;
};

const KhoaList = () => {
  const {
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
    departments,
    deleteDepartment,
    isLoadingDepartment,
    refetchDepartments,
  } = useKhoaContext();

  // Ép kiểu dữ liệu sang cấu trúc chuẩn
  const departmentList = departments as DepartmentItem[] | undefined;

  // State giữ thông tin của Khoa đang chỉnh sửa (nếu có)
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentItem | null>(null);

  // Tạo ref để tham chiếu đến form
  const formRef = useRef<CreateKhoaFormRef>(null);

  const handleConfirmSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  // Mở modal để tạo mới (đảm bảo làm sạch dữ liệu cũ)
  const handleOpenCreateModal = () => {
    setEditingDepartment(null);
    setOpenModalCreateKhoa(true);
  };

  // Mở modal để cập nhật dữ liệu cũ
  const handleOpenEditModal = (dept: DepartmentItem) => {
    setEditingDepartment(dept);
    setOpenModalCreateKhoa(true);
  };

  // Đóng modal và reset trạng thái chỉnh sửa
  const handleCloseModal = () => {
    setOpenModalCreateKhoa(false);
    setEditingDepartment(null);
    refetchDepartments();
  };

  return (
    <PageShell
      title="Danh mục khoa"
      sub="Hệ thống quản lý các đơn vị chuyên môn trường trung cấp"
      renderRight={
        <button
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl 
        font-bold text-[14px] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 active:scale-95 transition-all"
          onClick={handleOpenCreateModal}
        >
          <Settings size={18} />
          Thêm khoa mới
        </button>
      }
    >
      <LoadingWrapper
        isLoading={isLoadingDepartment}
        message="Đang tải danh sách khoa..."
      >
        {/* Grid Layout chứa các Card Khoa được viết Inline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentList?.map((dept) => {
            const headName =
              typeof dept.headOfDepartmentName === "string"
                ? dept.headOfDepartmentName
                : (dept.headOfDepartmentName as any)?.fullName ||
                  "Chưa bổ nhiệm";

            return (
              <div
                key={dept.id}
                className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:border-indigo-200/80 transition-all duration-300 flex flex-col justify-between min-h-[270px] overflow-hidden"
              >
                {/* Thanh dải màu Gradient trang trí */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Phần thông tin phía trên */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1.5">
                      {/* Mã Khoa */}
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold tracking-wider uppercase border border-indigo-100">
                        {dept.deptCode}
                      </span>
                      {/* Tên khoa lớn, rõ nét */}
                      <h4 className="text-[17px] font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors pt-1">
                        {dept.deptName}
                      </h4>
                    </div>

                    {/* Khối nút Hành động (Sửa / Xóa) hiển thị khi hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {/* Nút Chỉnh sửa (Edit) */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(dept)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Sửa thông tin"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Nút Xóa */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Bạn có chắc chắn muốn xóa khoa ${dept.deptName}?`,
                            )
                          ) {
                            deleteDepartment({
                              params: {
                                path: { id: dept.id },
                              },
                            });
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Xóa khoa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Trưởng khoa phụ trách */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-blue-50/80 border border-blue-100 rounded-xl text-slate-800 mb-4 transition-colors group-hover:bg-blue-100/50">
                    <User size={18} className="text-blue-500 shrink-0" />
                    <span className="text-sm font-semibold truncate">
                      Trưởng khoa:{" "}
                      <strong className="text-blue-900 font-extrabold text-[15px]">
                        {headName}
                      </strong>
                    </span>
                  </div>

                  {/* Mô tả */}
                  {dept.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 px-1 leading-relaxed">
                      {dept.description}
                    </p>
                  )}
                </div>

                {/* Phần chỉ số thống kê */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center bg-slate-50/40 rounded-2xl p-2 group-hover:bg-indigo-50/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-amber-600/90">
                      <BookOpen size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        Ngành
                      </span>
                    </div>
                    <p className="text-[16px] font-extrabold text-slate-800">
                      {dept.totalMajors || 0}
                    </p>
                  </div>

                  <div className="space-y-1 border-x border-slate-200">
                    <div className="flex items-center justify-center gap-1 text-purple-600/90">
                      <Users size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        G.Viên
                      </span>
                    </div>
                    <p className="text-[16px] font-extrabold text-slate-800">
                      {dept.totalStaffs || 0}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-emerald-600/90">
                      <GraduationCap size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        S.Viên
                      </span>
                    </div>
                    <p className="text-[16px] font-extrabold text-slate-800">
                      {dept.totalStudents || 0}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card "Thêm mới" giả lập */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col 
          items-center justify-center text-slate-400 hover:border-indigo-500 hover:bg-indigo-50/30
          hover:text-indigo-600 transition-all cursor-pointer min-h-[270px] group"
            onClick={handleOpenCreateModal}
          >
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:border-indigo-200 group-hover:scale-110 transition-all shadow-md">
              <Plus
                size={24}
                className="text-slate-500 group-hover:text-indigo-600 transition-colors"
              />
            </div>
            <span className="font-extrabold text-[15px] tracking-wide">
              Thêm khoa mới
            </span>
          </div>
        </div>

        {/* Modal tích hợp đa năng (Tạo & Sửa) */}
        {openModalCreateKhoa && (
          <Modal
            isOpen={openModalCreateKhoa}
            onClose={handleCloseModal}
            title={
              editingDepartment ? "Cập Nhật Thông Tin Khoa" : "Thêm Khoa Mới"
            }
            subTitle={
              editingDepartment
                ? "Sửa đổi khối chuyên môn"
                : "Khối chuyên môn hệ thống"
            }
            icon={Plus}
            maxWidth="2xl"
            footer={
              <>
                <button
                  onClick={handleCloseModal}
                  className="text-[13px] font-bold text-slate-500 hover:text-slate-800 px-4 transition-colors"
                >
                  Hủy bỏ
                </button>
                <ButtonAction
                  label={editingDepartment ? "Lưu thay đổi" : "Xác nhận thêm"}
                  onClick={handleConfirmSubmit}
                />
              </>
            }
          >
            <CreateKhoaForm
              ref={formRef}
              departmentData={editingDepartment || undefined}
              onSuccess={handleCloseModal}
            />
          </Modal>
        )}
      </LoadingWrapper>
    </PageShell>
  );
};

export default KhoaList;
