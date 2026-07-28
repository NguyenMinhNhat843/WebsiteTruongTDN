import { GraduationCap, Plus } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { KhoaDaoTaoProvider, useKhoaDaoTaoContext } from './KhoaHocProvider'
import CreateBatchModal from './CreateKhoaDaoTao'
import KhoaDaoTaoTable from './TableKhoaDaotao'
import { UpdateBatchModal } from './UpdateKhoaDaoTaoModal'
import ButtonAction from '../../../components/ui/ButtonAction'

const KhoaDaoTao = () => {
  return (
    <KhoaDaoTaoProvider>
      <Inner />
    </KhoaDaoTaoProvider>
  )
}

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
    isBatchesPending,
  } = useKhoaDaoTaoContext()

  return (
    <PageShell
      title="Quản lý khóa đào tạo"
      sub="Trang quản lý các khóa đào tạo trong hệ thống"
      icon={GraduationCap}
      renderRight={
        <ButtonAction
          label="Thêm khóa đào tạo"
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => setIsOpenModalCreateBatch(true)}
        />
      }
    >
      {/* Main Table */}
      <KhoaDaoTaoTable data={batches || []} isLoading={isBatchesPending} />

      {/* Modal Form */}
      <CreateBatchModal
        isOpen={isOpenModalCreateBatch}
        onClose={() => setIsOpenModalCreateBatch(false)}
        onSubmit={(data) => {
          addBatch(
            { body: data },
            {
              onSuccess: () => {
                setIsOpenModalCreateBatch(false)
              },
            },
          )
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
                setBatchSelected(null)
              },
            },
          )
        }
      />
    </PageShell>
  )
}

export default KhoaDaoTao
