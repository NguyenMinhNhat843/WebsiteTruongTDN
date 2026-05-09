import { CalendarDays, Plus } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { KhoaDaoTaoProvider, useKhoaDaoTaoContext } from "./KhoaHocProvider";
import CreateBatchModal from "./CreateKhoaDaoTao";
import KhoaDaoTaoTable from "./TableKhoaDaotao";

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
  } = useKhoaDaoTaoContext();

  return (
    <PageShell
      title="Quản lý khóa đào tạo"
      sub="Trang quản lý các khóa đào tạo trong hệ thống"
      renderRight={
        <div className="flex gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group min-w-50">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <CalendarDays size={18} />
              </div>
              <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl appearance-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all cursor-pointer">
                <option value="">Tất cả học kỳ</option>
                <option value="HK1-2024">Học kỳ 1 (2024 - 2025)</option>
                <option value="HK2-2024">Học kỳ 2 (2024 - 2025)</option>
                <option value="HK3-2024">Học kỳ hè (2024)</option>
              </select>
              {/* Custom Arrow Icon */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bên phải: Nút thêm khóa đào tạo */}
          <button
            className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-200 active:scale-95 overflow-hidden"
            onClick={() => setIsOpenModalCreateBatch(true)}
          >
            <div className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full"></div>
            <Plus
              size={20}
              strokeWidth={3}
              className="transition-transform group-hover:rotate-90 duration-300"
            />
            <span className="relative">Thêm khóa đào tạo</span>
          </button>
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
    </PageShell>
  );
};

export default KhoaDaoTao;
