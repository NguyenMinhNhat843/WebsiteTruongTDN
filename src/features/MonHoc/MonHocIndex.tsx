import { BookOpen, Edit3, PlusIcon, Trash2 } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { MonHocProvider, useMonHocContext } from "./MonHocProvider";
import MonHocTable from "./TableMonHoc";
import CreateMonHocModal from "./CreateMonHoc";
import UpdateMonHoc from "./UpdatemonHoc";

const MonHocIndex = () => {
  return (
    <MonHocProvider>
      <Inner />
    </MonHocProvider>
  );
};

const Inner = () => {
  const {
    monHocs,
    deleteMonHoc,
    isOpenModalCreateMonHoc,
    setIsOpenModalCreateMonHoc,
    createMonHoc,
    isCreateMonHocPending,
    isMonHocsLoading,
    monHocIdSelected,
    setMonHocIdSelected,
  } = useMonHocContext();
  return (
    <PageShell
      title="Môn học"
      sub="Quản lý thông tin môn học"
      icon={BookOpen}
      renderRight={
        <button
          onClick={() => setIsOpenModalCreateMonHoc(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50"
        >
          <PlusIcon className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:rotate-45" />
          Thêm môn học mới
        </button>
      }
    >
      <MonHocTable
        data={monHocs || []}
        isLoading={isMonHocsLoading}
        onClickRow={(id) => setMonHocIdSelected(id)}
        columns={[
          {
            header: "Thao tác",
            cell: (info) => {
              const rowId = Number(info.row.original.id);

              return (
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    className="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() =>
                      deleteMonHoc({
                        params: {
                          path: {
                            id: rowId,
                          },
                        },
                      })
                    }
                    type="button"
                    className={`p-2.5 rounded-xl transition-colors 
                  hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-40"
                `}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      <CreateMonHocModal
        isOpen={isOpenModalCreateMonHoc}
        onClose={() => setIsOpenModalCreateMonHoc(false)}
        onSubmit={(data, reset) => {
          createMonHoc(
            {
              body: data,
            },
            {
              onSuccess: () => {
                reset();
                setIsOpenModalCreateMonHoc(false);
              },
            },
          );
        }}
        isPending={isCreateMonHocPending}
      />

      <UpdateMonHoc
        idSelected={monHocIdSelected}
        onClose={() => setMonHocIdSelected(null)}
      />
    </PageShell>
  );
};

export default MonHocIndex;
