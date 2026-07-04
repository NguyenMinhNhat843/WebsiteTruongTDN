import { Edit, PlusIcon, Trash2 } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
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
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 transform active:scale-98"
          onClick={() => setIsOpenModalCreate(true)}
        >
          <PlusIcon className="w-4 h-4" />
          Thêm ngành học
        </button>
      }
    >
      {/* Card List Instead of Table */}
      <NganhHocList
        data={nganhs || []}
        renderActions={(data) => (
          <div className="flex gap-1.5">
            <button
              className="p-1.5 hover:bg-purple-50 text-gray-500 hover:text-purple-600 rounded-lg transition-colors border border-transparent hover:border-purple-100"
              title="Chỉnh sửa"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
              title="Xóa"
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
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {/* Create Modal */}
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
