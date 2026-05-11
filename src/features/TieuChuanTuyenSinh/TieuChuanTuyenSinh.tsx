import { PlusIcon, TrashIcon } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import TieuChiTable from "./TieuChiTuyenSinhTable";
import {
  TieuChuanTuyenSinhProvider,
  useTieuChuanTuyenSinhContext,
} from "./TieuChuanTuyenSinhProvider";
import FormCreateTieuChi from "./CreateTieuChiModal";

const TieuChuanTuyenSinh = () => {
  return (
    <TieuChuanTuyenSinhProvider>
      <Inner />
    </TieuChuanTuyenSinhProvider>
  );
};

const Inner = () => {
  const {
    tieuChis,
    setIsOpenModalCreateTieuChi,
    isOpenModalCreateTieuChi,
    createTieuChi,
    deleteTieuChi,
  } = useTieuChuanTuyenSinhContext();
  return (
    <PageShell
      title="Danh mục tiêu chí tuyển sinh"
      sub="Quản lý các tiêu chí tuyển sinh của trường"
      renderRight={
        <button
          onClick={() => setIsOpenModalCreateTieuChi(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-lg"
        >
          {/* Icon dấu cộng (SVG) */}
          <PlusIcon className="w-4 h-4" />
          Thêm tiêu chí
        </button>
      }
    >
      <TieuChiTable
        data={tieuChis || []}
        columnAdd={[
          {
            accessorKey: "action",
            cell: (info) => {
              const row = info.row.original;
              return (
                <button
                  onClick={() =>
                    deleteTieuChi(
                      {
                        body: {
                          id: row.id,
                        },
                      },
                      {
                        onSuccess: () => {
                          alert("Xóa tiêu chí thành công");
                        },
                      },
                    )
                  }
                >
                  <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
              );
            },
          },
        ]}
      />

      <FormCreateTieuChi
        isOpen={isOpenModalCreateTieuChi}
        onClose={() => setIsOpenModalCreateTieuChi(false)}
        onSubmit={(data, reset) =>
          createTieuChi(
            {
              body: {
                ...data,
              },
            },
            {
              onSuccess: () => {
                reset();
                setIsOpenModalCreateTieuChi(false);
              },
            },
          )
        }
      />
    </PageShell>
  );
};

export default TieuChuanTuyenSinh;
