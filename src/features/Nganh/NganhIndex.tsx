import { Edit, PlusIcon, Trash2 } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { NganhProvider, useNganhContext } from "./NganhProvider";
import CreateNganhModal from "./CreateNganhHoc";
import NganhHocList from "./NganhHocList";

const NganhIndex = () => {
  return (
    <NganhProvider>
      <Inner />
    </NganhProvider>
  );
};

const Inner = () => {
  const {
    isOpenModalCreate,
    setIsOpenModalCreate,
    isPendingCreateNganh,
    createNganh,
    nganhs,
    deleteNganh,
  } = useNganhContext();
  return (
    <PageShell
      title="Quản lý ngành học"
      sub="Trang quản lý các ngành học trong hệ thống"
      renderRight={
        <button
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-indigo-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 transition duration-150"
          onClick={() => setIsOpenModalCreate(true)}
        >
          <PlusIcon className="w-4 h-4" />
          Thêm ngành học
        </button>
      }
    >
      {/* Table */}
      <NganhHocList
        data={nganhs || []}
        columns={[
          {
            header: "Hành động",
            id: "actions",
            cell: (info) => {
              const data = info.row.original;
              return (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors">
                    <Edit size={18} />
                  </button>
                  <button
                    className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                    onClick={() =>
                      deleteNganh({
                        params: {
                          path: {
                            id: data.id,
                          },
                        },
                      })
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      {/* Create */}
      <CreateNganhModal
        onClose={() => setIsOpenModalCreate(false)}
        isOpen={isOpenModalCreate}
        isPending={isPendingCreateNganh}
        onSubmit={(data, reset) => {
          createNganh(
            {
              body: { ...data },
            },
            {
              onSuccess: () => {
                reset();
                setIsOpenModalCreate(false);
              },
            },
          );
        }}
      />
    </PageShell>
  );
};

export default NganhIndex;
