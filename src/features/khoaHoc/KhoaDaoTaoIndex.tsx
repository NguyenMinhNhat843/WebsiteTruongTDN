import { CalendarDays, Plus } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { KhoaDaoTaoProvider, useKhoaDaoTaoContext } from "./KhoaHocProvider";
import CreateBatchModal from "./CreateKhoaDaoTao";
import KhoaDaoTaoTable from "./TableKhoaDaotao";
import { UpdateBatchModal } from "./UpdateKhoaDaoTaoModal";
import ButtonAction from "../../components/ui/ButtonAction";
import { SelectOption } from "../../components/ui/Form/SelectOption";

const KhoaDaoTao = () => {
  return (
    <KhoaDaoTaoProvider>
      <Inner />
    </KhoaDaoTaoProvider>
  );
};

const Inner = () => {
  const {
    addBatch,
    isOpenModalCreateBatch,
    setIsOpenModalCreateBatch,
    isAddBatchPending,
    batches,
    batchSelected,
    setBatchSelected,
    updateBatch,
  } = useKhoaDaoTaoContext();

  const hocKyOptions = [
    { value: "", label: "Tất cả học kỳ" },
    { value: "HK1-2024", label: "Học kỳ 1 (2024 - 2025)" },
    { value: "HK2-2024", label: "Học kỳ 2 (2024 - 2025)" },
    { value: "HK3-2024", label: "Học kỳ hè (2024)" },
  ];

  return (
    <PageShell
      title="Quản lý khóa đào tạo"
      sub="Trang quản lý các khóa đào tạo trong hệ thống"
      renderRight={
        <div className="flex gap-4 items-center">
          {/* Bộ lọc học kỳ */}
          <SelectOption
            options={hocKyOptions}
            containerClassName="min-w-[200px]" // Thay thế min-w-50 không chuẩn của Tailwind
            icon={<CalendarDays size={18} />}
            // Bạn có thể thêm value và onChange ở đây nếu cần quản lý state
          />

          {/* Nút thêm khóa đào tạo */}
          <ButtonAction
            variant="primary"
            icon={
              <Plus
                size={20}
                strokeWidth={3}
                className="transition-transform group-hover:rotate-90 duration-300"
              />
            }
            onClick={() => setIsOpenModalCreateBatch(true)}
          >
            Thêm khóa đào tạo
          </ButtonAction>
        </div>
      }
    >
      {/* Main Table */}
      <KhoaDaoTaoTable data={batches || []} />

      {/* Modal Form */}
      <CreateBatchModal
        isOpen={isOpenModalCreateBatch}
        onClose={() => setIsOpenModalCreateBatch(false)}
        onSubmit={(data) => {
          addBatch(
            { body: data },
            {
              onSuccess: () => {
                setIsOpenModalCreateBatch(false);
              },
            },
          );
        }}
        isPending={isAddBatchPending}
      />

      <UpdateBatchModal
        isOpen={batchSelected !== null}
        onClose={() => setBatchSelected(null)}
        data={batchSelected}
        onSave={(id, payload) =>
          updateBatch({
            params: {
              path: {
                id,
              },
            },
            body: {
              curriculumId: payload.curriculumId!,
              status: batchSelected!.status, // PHẢI CÓ: Lấy giá trị hiện tại của batch
              batchName: batchSelected!.batchName,
            },
          })
        }
      />
    </PageShell>
  );
};

export default KhoaDaoTao;
