import { ChevronDown, CircleDollarSign } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { useHocphisContext } from "./HocPhiProvider";
import { CreateTuitionModal } from "./ModalTaoCongNo";
import { ThuHocPhiPage } from "./StudentPaymentFee/ThuHocPhiSection";
import { useAppContext } from "../../AppProvider";

const QuanLyDotHocPhi = () => {
  const {
    setIsOpenModalTaoCongNo,
    isOpenModalTaoCongNo,
    isPendingCreateSemesterFees,
    createSemesterFees,
    hocPhiXemTruoc,
    isPendingHocPhiXemTruoc,
  } = useHocphisContext();
  const { hocKysData: hockys } = useAppContext();
  return (
    <PageShell
      title="Quản lý đợt học phí"
      sub="Tạo và quản lý các đợt học phí cho sinh viên."
      renderRight={
        <div className="flex items-center gap-3">
          {/* Select chọn học kỳ */}
          <div className="relative min-w-50">
            <select
              defaultValue={hockys?.find((h) => h.isCurrent)?.id}
              className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm transition-all"
            >
              {hockys?.map((hk) => (
                <option key={hk.id} value={hk.id}>
                  {hk.name} {hk.isCurrent ? "(Hiện tại)" : ""}
                </option>
              ))}
            </select>
            {/* Icon mũi tên xuống cho select */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Nút Mở đợt học phí */}
          <button
            onClick={() => {
              // Logic mở modal preview đợt học phí
              setIsOpenModalTaoCongNo(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-100 transition-all duration-200"
          >
            <CircleDollarSign size={16} />
            <span>Mở đợt học phí</span>
          </button>
        </div>
      }
    >
      <CreateTuitionModal
        isOpen={isOpenModalTaoCongNo}
        onClose={() => setIsOpenModalTaoCongNo(false)}
        hocKys={hockys || []}
        isCreatePending={isPendingCreateSemesterFees}
        createSemesterFees={() => createSemesterFees({})}
        hocPhiXemTruoc={hocPhiXemTruoc!}
        isPendingHocPhiXemTruoc={isPendingHocPhiXemTruoc}
      />
      <ThuHocPhiPage />
    </PageShell>
  );
};

export default QuanLyDotHocPhi;
