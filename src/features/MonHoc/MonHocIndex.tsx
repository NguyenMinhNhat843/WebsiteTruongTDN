import { PlusIcon, Trash2 } from "lucide-react";
import PageShell from "../../components/ui/PageShell";
import { MonHocProvider, useMonHocContext } from "./MonHocProvider";
import MonHocTable from "./TableMonHoc";
import CreateMonHocModal from "./CreateMonHoc";

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
  } = useMonHocContext();
  return (
    <PageShell
      title="Môn học"
      sub="Quản lý thông tin môn học"
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
        columns={[
          {
            header: "Thao tác",
            cell: (info) => {
              const rowData = info.row.original;
              return (
                <button
                  onClick={() =>
                    deleteMonHoc({
                      params: {
                        path: {
                          id: rowData.id,
                        },
                      },
                    })
                  }
                  className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 transition-transform duration-150 group-hover:-rotate-12" />
                  <span>Xóa</span>
                </button>
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
    </PageShell>
  );
};

export default MonHocIndex;
