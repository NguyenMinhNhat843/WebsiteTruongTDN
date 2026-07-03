import { useState } from "react";
import { $api } from "../../../../api/client";
import type { paths } from "../../../../api/v1";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Users, Trash2, Edit3, Loader2 } from "lucide-react";
import ModalCreatePhongHoc from "../Create/ModalCreatePhongHoc";

export type QueryRoomDto = paths["/rooms"]["get"]["parameters"]["query"];
type RoomTypeType = NonNullable<NonNullable<QueryRoomDto>["type"]>;

const ROOM_TYPE_CONFIGS: {
  value: RoomTypeType | "ALL";
  label: string;
  badgeClass: string;
  cardBorderClass: string;
  activeTabClass: string;
}[] = [
  {
    value: "ALL",
    label: "Tất cả phòng",
    badgeClass: "bg-gray-100 text-gray-800",
    cardBorderClass: "border-l-gray-300",
    activeTabClass: "bg-gray-900 text-white shadow-sm",
  },
  {
    value: "Lý thuyết",
    label: "Lý thuyết",
    badgeClass: "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10",
    cardBorderClass: "border-l-blue-500",
    activeTabClass: "bg-blue-600 text-white shadow-sm",
  },
  {
    value: "Thực hành",
    label: "Thực hành",
    badgeClass: "bg-purple-50 text-purple-700 ring-1 ring-purple-700/10",
    cardBorderClass: "border-l-purple-500",
    activeTabClass: "bg-purple-600 text-white shadow-sm",
  },
  {
    value: "Phòng Lab/Máy tính",
    label: "Phòng Lab / Máy tính",
    badgeClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10",
    cardBorderClass: "border-l-indigo-500",
    activeTabClass: "bg-indigo-600 text-white shadow-sm",
  },
  {
    value: "Xưởng thực tập",
    label: "Xưởng thực tập",
    badgeClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-700/10",
    cardBorderClass: "border-l-amber-500",
    activeTabClass: "bg-amber-600 text-white shadow-sm",
  },
  {
    value: "Phòng chức năng",
    label: "Phòng chức năng",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10",
    cardBorderClass: "border-l-emerald-500",
    activeTabClass: "bg-emerald-600 text-white shadow-sm",
  },
];

const RoomList = () => {
  const queryClient = useQueryClient();
  const [searchCode, setSearchCode] = useState<string>("");
  const [selectedType, setSelectedType] = useState<RoomTypeType | "ALL">("ALL");

  // State quản lý Modal sửa/tạo phòng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  const queryParams: QueryRoomDto = {
    ...(searchCode.trim() !== "" ? { roomCode: searchCode.trim() } : {}),
    ...(selectedType !== "ALL" ? { type: selectedType } : {}),
  };

  // API lấy danh sách phòng
  const {
    data: rooms,
    isLoading,
    isError,
  } = $api.useQuery("get", "/rooms", {
    params: { query: queryParams },
  });

  // API Xóa phòng
  const { mutate: mutateDeleteRoom } = $api.useMutation(
    "delete",
    "/rooms/{id}",
  );

  const handleDelete = (id: number, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ${code}?`)) {
      mutateDeleteRoom(
        { params: { path: { id } } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/rooms"] });
          },
          onError: (error) => {
            console.error("Lỗi khi xóa phòng:", error);
            alert("Xóa phòng thất bại!");
          },
        },
      );
    }
  };

  const handleOpenEditModal = (id: number) => {
    setEditingRoomId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoomId(null);
  };

  return (
    <div className="space-y-6">
      {/* ================= BỘ LỌC VÀ TÌM KIẾM ================= */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="max-w-md w-full">
            <label className="sr-only">Tìm kiếm mã phòng</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Nhập mã phòng cần tìm (ví dụ: PM402...)"
                className="w-full rounded-lg border border-gray-300 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Lọc theo loại phòng
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ROOM_TYPE_CONFIGS.map((config) => {
              const isSelected = selectedType === config.value;
              return (
                <button
                  key={config.value}
                  type="button"
                  onClick={() => setSelectedType(config.value)}
                  className={`inline-flex items-center rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
                    isSelected
                      ? config.activeTabClass
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= DANH SÁCH PHÒNG HỌC ================= */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-xl bg-white p-5 border border-gray-100 h-40 space-y-3"
            >
              <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded pt-4"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-center text-sm text-red-600">
          Đã có lỗi xảy ra khi tải danh sách phòng học. Vui lòng thử lại sau!
        </div>
      )}

      {!isLoading && !isError && rooms?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 px-4 border border-gray-100 text-center shadow-sm">
          <Search className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Không tìm thấy phòng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc loại phòng khác.
          </p>
        </div>
      )}

      {!isLoading && !isError && rooms && rooms.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const config =
              ROOM_TYPE_CONFIGS.find((c) => c.value === room.type) ||
              ROOM_TYPE_CONFIGS[0];

            return (
              <div
                key={room.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-5 border border-gray-200 border-l-4 ${config.cardBorderClass} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    {/* Bấm vào tên mã phòng sẽ hiển thị Modal Update */}
                    <h4
                      onClick={() => room.id && handleOpenEditModal(room.id)}
                      className="text-xl font-bold text-gray-900 tracking-tight cursor-pointer hover:text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {room.roomCode}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${config.badgeClass}`}
                    >
                      {room.type}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-400 w-16">
                        Tòa nhà:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {room.building || "Chưa xếp khu"}
                      </span>
                    </div>

                    {/* Cặp Icon Edit và Delete nhỏ gọn */}
                    <div className="flex items-center gap-2 opacity-80 hover:opacity-100">
                      <button
                        onClick={() => room.id && handleOpenEditModal(room.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          room.id &&
                          room.roomCode &&
                          handleDelete(room.id, room.roomCode)
                        }
                        className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100"
                        title="Xóa phòng"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Sức chứa:</span>
                    <span className="font-bold text-gray-900">
                      {room.capacity ? `${room.capacity} chỗ` : "Chưa rõ"}
                    </span>
                  </div>

                  {room.createdAt && (
                    <span className="text-gray-400 text-[11px]">
                      {new Date(room.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal đa năng: Create nếu roomId trống, Update nếu có roomId */}
      <ModalCreatePhongHoc
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roomId={editingRoomId}
      />
    </div>
  );
};

export default RoomList;
