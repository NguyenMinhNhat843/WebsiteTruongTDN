import HocKyTable from "./TableHocKy";
import { useHocKyContext } from "./HocKyProvider";
import PageShell from "../../../components/ui/PageShell";
import { Loader2, PlusIcon, Trash2 } from "lucide-react";
import { CreateHocKyModal } from "./CreateHocKyModal";

const HocKyList = () => {
  const {
    hocKyList,
    isHocKyListPending,
    setIsOpenModalCreate,
    createhocKy,
    isCreateHocKyPending,
    isCreateHocKyError,
    deleteHocKy,
    isDeleteHocKyPending,
  } = useHocKyContext();
  return (
    <PageShell
      title="Danh sách học kỳ"
      sub="Quản lý học kỳ"
      renderRight={
        <button
          onClick={() => setIsOpenModalCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all duration-200 ease-in-out border border-indigo-600"
        >
          <PlusIcon size={16} className="text-white" />
          <span>Mở học kỳ mới</span>
        </button>
      }
    >
      <HocKyTable
        hocKyList={hocKyList || []}
        isHocKyListPending={isHocKyListPending}
        columnsAdditional={[
          {
            accessorKey: "actions",
            header: "", // Thường để trống tiêu đề cho cột thao tác
            cell: (info) => {
              const hocKy = info.row.original;

              const handleDelete = async (e: React.MouseEvent) => {
                e.stopPropagation(); // Chặn sự kiện click vào hàng (nếu có)

                // Sử dụng window.confirm mặc định
                const isConfirmed = window.confirm(
                  `Bạn có chắc chắn muốn xóa học kỳ "${hocKy.name}" không?\nLưu ý: Hành động này không thể hoàn tác.`,
                );

                if (isConfirmed) {
                  // Gọi hàm xóa truyền từ props/hook
                  deleteHocKy(
                    {
                      params: {
                        path: {
                          id: hocKy.id,
                        },
                      },
                    },
                    {
                      onSuccess: () => {
                        alert("Xóa học kỳ thành công!");
                      },
                      onError: () => {
                        alert(
                          "Có lỗi xảy ra khi xóa học kỳ. Vui lòng thử lại.",
                        );
                      },
                    },
                  );
                }
              };

              return (
                <div className="flex justify-end pr-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleteHocKyPending}
                    className={`p-2 rounded-lg transition-all ${
                      isDeleteHocKyPending
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-red-50 group"
                    }`}
                    title="Xóa học kỳ"
                  >
                    {isDeleteHocKyPending ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-gray-400"
                      />
                    ) : (
                      <Trash2
                        size={16}
                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                      />
                    )}
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      <CreateHocKyModal
        isOpen={useHocKyContext().isOpenModalCreate}
        onClose={() => setIsOpenModalCreate(false)}
        createHocKy={(data) =>
          createhocKy(
            {
              body: data,
            },
            {
              onSuccess: () => {
                alert("Tạo học kỳ thành công!");
              },
            },
          )
        }
        isCreateHocKyPending={isCreateHocKyPending}
        isCreateHocKyError={isCreateHocKyError}
      />
    </PageShell>
  );
};

export default HocKyList;
