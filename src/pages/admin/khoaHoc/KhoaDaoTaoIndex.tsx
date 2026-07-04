import { Plus } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import { KhoaDaoTaoProvider, useKhoaDaoTaoContext } from "./KhoaHocProvider";
import CreateBatchModal from "./CreateKhoaDaoTao";
import KhoaDaoTaoTable from "./TableKhoaDaotao";
import { UpdateBatchModal } from "./UpdateKhoaDaoTaoModal";
import ButtonAction from "../../../components/ui/ButtonAction";

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
    isUpdating,
  } = useKhoaDaoTaoContext();

  return (
    <PageShell
      title="Quản lý khóa đào tạo"
      sub="Trang quản lý các khóa đào tạo trong hệ thống"
      renderRight={
        <div className="flex gap-4 items-center">
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
        isSubmitting={isUpdating}
        onSave={(id, payload) =>
          updateBatch(
            {
              params: {
                path: {
                  id,
                },
              },
              body: payload,
            },
            {
              onSuccess: () => {
                setBatchSelected(null);
              },
            },
          )
        }
      />
    </PageShell>
  );
};

export default KhoaDaoTao;
