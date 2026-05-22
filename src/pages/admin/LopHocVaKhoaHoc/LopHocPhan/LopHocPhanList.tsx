import { useLopHocPhanContext } from "./LopHocPhanProvider";
import { Calendar, Grid } from "lucide-react";
import PageShell from "../../../../components/ui/PageShell";
import DanhSachLopHocPhan from "./TableLopHocPhanList";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
// import GenLopHocPhanModal from "./ModalGenLopHocPhan";
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocPhanList() {
  const {
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
