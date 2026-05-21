import { useLopHocPhanContext } from "./LopHocPhanProvider";
import { Calendar, Grid, Plus } from "lucide-react";
import PageShell from "../../../../components/ui/PageShell";
import DanhSachLopHocPhan from "./TableLopHocPhanList";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";
// import GenLopHocPhanModal from "./ModalGenLopHocPhan";
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocPhanList() {
  const {
    setShowCreate,
    hocKysData,
    hocKyIdSelected,
    setHocKyIdSelected,
    lopHocPhans,
    isLoadingLopHocPhans,
  } = useLopHocPhanContext();

  const hocKyOptions = [
    { value: -1, label: "Tất cả học kỳ" }, // Hoặc value: "" tùy cấu trúc API của bạn
    ...(hocKysData?.map((hocKy) => ({
      value: hocKy.id, // Giả sử hocKy.id là number hoặc string
      label: `${hocKy.name}${hocKy.isCurrent ? " (Hiện tại)" : ""}`,
    })) ?? []),
  ];

  return (
    <PageShell
      title="Quản lý lớp học"
      sub="Quản lý danh sách các lớp học"
      icon={Grid}
      renderRight={
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 flex-nowrap">
            {/* Bộ chọn Học kỳ - Sử dụng SelectOption */}
            <SelectOption
              containerClassName="w-56"
              icon={<Calendar size={16} />}
              value={hocKyIdSelected ?? -1}
              onChange={(e) => setHocKyIdSelected(Number(e.target.value))}
              options={hocKyOptions}
            />

            {/* Nút Thêm lớp học phần - Sử dụng ButtonAction */}
            <ButtonAction
              type="button"
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              label="Sinh lớp học phần"
              className="whitespace-nowrap rounded-lg h-9" // Giữ h-9 và rounded-lg để khớp giao diện cũ nếu cần
              onClick={() => setShowCreate(true)}
            />
          </div>
        </header>
      }
    >
      <div className="flex bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1">
            <DanhSachLopHocPhan
              data={lopHocPhans || []}
              isLoading={isLoadingLopHocPhans}
            />
          </main>
        </div>
      </div>
      {/* <GenLopHocPhanModal isOpen={true} onClose={() => {}} /> */}
    </PageShell>
  );
}
