import { Plus, Settings } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import KhoaCard from "./components/KhoaCard";
import { useKhoaContext } from "./KhoaProvider";
import ThietLapKhoaModal from "./ThietLapKhoa";
import CreateKhoaForm, { type CreateKhoaFormRef } from "./CreateKhoaForm";
import ButtonAction from "../../../components/ui/ButtonAction";
import Modal from "../../../components/ui/Modal";
import { useRef } from "react";

const KhoaList = () => {
  const {
    openModalThietLapKhoa,
    setOpenModalThietLapKhoa,
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
  } = useKhoaContext();
  const departments = [
    {
      id: "1",
      code: "KCNTT",
      name: "Khoa Công nghệ thông tin",
      head: "ThS. Nguyễn Văn A",
      teachers: 15,
      students: 450,
      color: "#4f46e5", // Indigo
    },
    {
      id: "2",
      code: "KCNOTO",
      name: "Khoa Công nghệ Ô tô",
      head: "KS. Trần Hoàng B",
      teachers: 20,
      students: 600,
      color: "#0ea5e9", // Sky
    },
    {
      id: "3",
      code: "KDLKS",
      name: "Khoa Du lịch & Khách sạn",
      head: "ThS. Lê Thị C",
      teachers: 12,
      students: 320,
      color: "#f59e0b", // Amber
    },
    {
      id: "4",
      code: "KDCN",
      name: "Khoa Điện công nghiệp",
      head: "ThS. Ngô Quốc D",
      teachers: 18,
      students: 500,
      color: "#10b981", // Emerald
    },
    {
      id: "5",
      code: "KKT",
      name: "Khoa Kế toán doanh nghiệp",
      head: "ThS. Phạm Thanh E",
      teachers: 10,
      students: 280,
      color: "#ec4899", // Pink
    },
  ];

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
        font-bold text-[13px] hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          onClick={() => setOpenModalThietLapKhoa(true)}
        >
          <Settings size={16} />
          Thiết lập khoa
        </button>
      }
    >
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <KhoaCard
            key={dept.id}
            name={dept.name}
            code={dept.code}
            head={dept.head}
            teachers={dept.teachers}
            students={dept.students}
            color={dept.color}
            onClick={() => console.log(`Chi tiết khoa: ${dept.name}`)}
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

      {openModalThietLapKhoa && (
        <ThietLapKhoaModal
          onClose={() => setOpenModalThietLapKhoa(false)}
          isOpen={openModalThietLapKhoa}
        />
      )}

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
              <ButtonAction label="Xác nhận thêm" onClick={handleConfirmAdd} />
            </>
          }
        >
          <CreateKhoaForm ref={formRef} />
        </Modal>
      )}
    </PageShell>
  );
};

export default KhoaList;
