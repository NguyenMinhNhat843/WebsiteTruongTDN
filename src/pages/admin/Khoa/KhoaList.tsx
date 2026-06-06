import { Plus, Settings } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import KhoaCard from "./components/KhoaCard";
import { useKhoaContext } from "./KhoaProvider";
import CreateKhoaForm, { type CreateKhoaFormRef } from "./CreateKhoaForm";
import ButtonAction from "../../../components/ui/ButtonAction";
import Modal from "../../../components/ui/Modal";
import { useRef } from "react";
import { LoadingWrapper } from "../../../components/ui/LoadingWrapper";

const KhoaList = () => {
  const {
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
    departments,
    deleteDepartment,
    isLoadingDepartment,
  } = useKhoaContext();

  // Tạo ref để tham chiếu đến form
  const formRef = useRef<CreateKhoaFormRef>(null);
  const handleConfirmAdd = () => {
    // Kích hoạt hàm submit bên trong form
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <PageShell
      title="Danh mục khoa"
      sub="Hệ thống quản lý các đơn vị chuyên môn trường trung cấp"
      renderRight={
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl 
        font-bold text-[13px] hover:opacity-90 shadow-lg"
          onClick={() => setOpenModalCreateKhoa(true)}
        >
          <Settings size={16} />
          Thêm khoa mới
        </button>
      }
    >
      <LoadingWrapper
        isLoading={isLoadingDepartment}
        message="Đang tải danh sách khoa..."
      >
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((dept) => (
            <KhoaCard
              key={dept.id}
              name={dept.deptName}
              code={dept.deptCode}
              head={String(dept.headOfDepartmentId)}
              teachers={15}
              students={100}
              color="#ec4899"
              onDelete={() =>
                deleteDepartment({
                  params: {
                    path: {
                      id: dept.id,
                    },
                  },
                })
              }
            />
          ))}

          {/* Card "Thêm mới" giả lập */}
          <div
            className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col 
        items-center justify-center text-slate-400 hover:border-indigo-400
        hover:text-indigo-500 transition-all cursor-pointer min-h-[250px] group"
            onClick={() => setOpenModalCreateKhoa(true)}
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
              <span className="text-2xl font-light">+</span>
            </div>
            <span className="font-bold text-[14px]">Thêm khoa mới</span>
          </div>
        </div>

        {openModalCreateKhoa && (
          <Modal
            isOpen={openModalCreateKhoa}
            onClose={() => setOpenModalCreateKhoa(false)}
            title="Thêm Khoa Mới"
            subTitle="Khối chuyên môn hệ thống"
            icon={Plus}
            maxWidth="2xl"
            footer={
              <>
                <button
                  onClick={() => setOpenModalCreateKhoa(false)}
                  className="text-[13px] font-bold text-slate-500 hover:text-slate-800 px-4"
                >
                  Hủy bỏ
                </button>
                <ButtonAction
                  label="Xác nhận thêm"
                  onClick={handleConfirmAdd}
                />
              </>
            }
          >
            <CreateKhoaForm
              ref={formRef}
              onSuccess={() => setOpenModalCreateKhoa(false)}
            />
          </Modal>
        )}
      </LoadingWrapper>
    </PageShell>
  );
};

export default KhoaList;
