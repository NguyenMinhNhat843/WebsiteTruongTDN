import HocKyTable from "./TableHocKy";
import { useHocKyContext } from "./HocKyProvider";
import PageShell from "../../../components/ui/PageShell";
import { PlusIcon } from "lucide-react";
import { CreateHocKyModal } from "./CreateHocKyModal";
import { toast } from "sonner";

const HocKyList = () => {
  const {
    hocKyList,
    isHocKyListPending,
    setIsOpenModalCreate,
    createhocKy,
    isCreateHocKyPending,
    isCreateHocKyError,
  } = useHocKyContext();
  return (
    <PageShell
      title="Danh sách học kỳ"
      sub="Quản lý học kỳ"
      renderRight={
        <button
          onClick={() => setIsOpenModalCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all duration-200 ease-in-out border border-indigo-600"
        >
          <PlusIcon size={16} className="text-white" />
          <span>Mở học kỳ mới</span>
        </button>
      }
    >
      <HocKyTable
        hocKyList={hocKyList || []}
        isHocKyListPending={isHocKyListPending}
      />

      <CreateHocKyModal
        isOpen={useHocKyContext().isOpenModalCreate}
        onClose={() => setIsOpenModalCreate(false)}
        createHocKy={(data) =>
          createhocKy(
            {
              body: data,
            },
            {
              onSuccess: () => {
                toast.success("Tạo học kỳ thành công!");
                window.location.reload();
              },
              onError: () => {
                toast.error("Có lỗi xảy ra khi tạo học kỳ. Vui lòng thử lại.");
              },
            },
          )
        }
        isCreateHocKyPending={isCreateHocKyPending}
        isCreateHocKyError={isCreateHocKyError}
      />
    </PageShell>
  );
};

export default HocKyList;
