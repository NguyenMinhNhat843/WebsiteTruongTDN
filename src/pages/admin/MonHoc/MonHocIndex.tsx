import { BookOpen, PlusIcon, Trash2 } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import { MonHocProvider, useMonHocContext } from "./MonHocProvider";
import CreateMonHocModal from "./CreateMonHoc";
import UpdateMonHoc from "./UpdateMonHoc";
import MonHocList from "./MonHocList";

const MonHocIndex = () => {
  return (
    <MonHocProvider>
      <Inner />
    </MonHocProvider>
  );
};

const Inner = () => {
  const {
    isOpenModalCreateMonHoc,
    setIsOpenModalCreateMonHoc,
    createMonHoc,
    isCreateMonHocPending,
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
      <MonHocList />

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
              /* eslint-disable @typescript-eslint/no-explicit-any */
              onError: (err: any) => {
                alert(err.message || "Tạo môn học thất bại!");
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
