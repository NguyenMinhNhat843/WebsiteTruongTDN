import { useState, useMemo } from "react";
import { $api } from "../../../../api/client";
import type { paths } from "../../../../api/v1";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Users, Trash2, Edit3, Folder } from "lucide-react";
import ModalCreatePhongHoc from "../Create/ModalCreatePhongHoc";

export type QueryRoomDto = paths["/rooms"]["get"]["parameters"]["query"];
type RoomTypeType = NonNullable<NonNullable<QueryRoomDto>["type"]>;

// Cấu hình giao diện đồng bộ màu sắc nhẹ (Soft Pastel) theo từng loại phòng
const ROOM_TYPE_CONFIGS: {
  value: RoomTypeType | "ALL";
  label: string;
  badgeClass: string;
  cardClass: string; // Sử dụng màu nền nhẹ & viền đồng bộ thay vì border-left
  activeTabClass: string;
}[] = [
  {
    value: "ALL",
    label: "Tất cả phòng",
    badgeClass: "bg-gray-100 text-gray-800",
    cardClass: "bg-gray-50/50 border-gray-200 text-gray-800",
    activeTabClass: "bg-gray-600 text-white shadow-sm",
  },
  {
    value: "Lý thuyết",
    label: "Lý thuyết",
    badgeClass: "bg-blue-100 text-blue-800",
    cardClass:
      "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60 text-blue-900",
    activeTabClass: "bg-blue-600 text-white shadow-sm",
  },
  {
    value: "Thực hành",
    label: "Thực hành",
    badgeClass: "bg-purple-100 text-purple-800",
    cardClass:
      "bg-purple-50/40 border-purple-100 hover:bg-purple-50/60 text-purple-900",
    activeTabClass: "bg-purple-600 text-white shadow-sm",
  },
  {
    value: "Phòng Lab/Máy tính",
    label: "Phòng Lab / Máy tính",
    badgeClass: "bg-indigo-100 text-indigo-800",
    cardClass:
      "bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/60 text-indigo-900",
    activeTabClass: "bg-indigo-600 text-white shadow-sm",
  },
  {
    value: "Xưởng thực tập",
    label: "Xưởng thực tập",
    badgeClass: "bg-amber-100 text-amber-800",
    cardClass:
      "bg-amber-50/40 border-amber-100 hover:bg-amber-50/60 text-amber-900",
    activeTabClass: "bg-amber-600 text-white shadow-sm",
  },
  {
    value: "Phòng chức năng",
    label: "Phòng chức năng",
    badgeClass: "bg-emerald-100 text-emerald-800",
    cardClass:
      "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/60 text-emerald-900",
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

  // Nhóm các phòng học theo loại để hiển thị khoa học
  const groupedRooms = useMemo(() => {
    if (!rooms) return [];

    // Lấy danh sách các cấu hình loại phòng (bỏ phần "ALL")
    const categories = ROOM_TYPE_CONFIGS.filter((c) => c.value !== "ALL");

    return categories
      .map((cat) => {
        const filtered = rooms.filter((r) => r.type === cat.value);
        return {
          category: cat,
          list: filtered,
        };
      })
      .filter((group) => group.list.length > 0); // Chỉ hiển thị nhóm có phòng
  }, [rooms]);

  return (
    <div className="space-y-8">
      {/* ================= BỘ LỌC VÀ TÌM KIẾM ================= */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
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
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            Phân loại phòng học
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ROOM_TYPE_CONFIGS.map((config) => {
              const isSelected = selectedType === config.value;
              return (
                <button
                  key={config.value}
                  type="button"
                  onClick={() => setSelectedType(config.value)}
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? config.activeTabClass
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 active:scale-95"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= LOADING SKELETON ================= */}
      {isLoading && (
        <div className="space-y-6">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl bg-white p-5 border border-gray-100 h-44 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ERROR FEEDBACK ================= */}
      {isError && (
        <div className="rounded-2xl bg-red-50 p-4 border border-red-100 text-center text-sm font-semibold text-red-600">
          Đã có lỗi xảy ra khi tải danh sách phòng học. Vui lòng thử lại sau!
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!isLoading && !isError && rooms?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 px-4 border border-gray-100 text-center shadow-sm">
          <div className="p-4 rounded-full bg-gray-50 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Không tìm thấy phòng học phù hợp
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Tất cả phòng" để làm mới
            bộ lọc.
          </p>
        </div>
      )}

      {/* ================= DANH SÁCH ĐÃ ĐƯỢC PHÂN NHÓM ================= */}
      {!isLoading && !isError && rooms && rooms.length > 0 && (
        <div className="space-y-10">
          {groupedRooms.map(({ category, list }) => (
            <div key={category.value} className="space-y-4">
              {/* Tiêu đề nhóm phòng học */}
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Folder className="h-5 w-5 text-gray-400" />
                <h3 className="text-base font-bold text-gray-800">
                  {category.label} ({list.length})
                </h3>
              </div>

              {/* Grid danh sách các phòng thuộc nhóm */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((room) => {
                  const config =
                    ROOM_TYPE_CONFIGS.find((c) => c.value === room.type) ||
                    ROOM_TYPE_CONFIGS[0];

                  return (
                    <div
                      key={room.id}
                      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 border shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ${config.cardClass}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() =>
                              room.id && handleOpenEditModal(room.id)
                            }
                            className="text-xl font-bold tracking-tight cursor-pointer hover:underline flex items-center gap-1"
                          >
                            {room.roomCode}
                          </h4>
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${config.badgeClass}`}
                          >
                            {room.type}
                          </span>
                        </div>

                        <div className="mt-4 flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="opacity-60 font-medium w-16">
                              Tòa nhà:
                            </span>
                            <span className="font-semibold">
                              {room.building || "Chưa xếp khu"}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                room.id && handleOpenEditModal(room.id)
                              }
                              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
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
                              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Xóa phòng"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer Card */}
                      <div className="mt-5 border-t border-black/5 pt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Users className="h-4 w-4 opacity-60" />
                          <span>Sức chứa:</span>
                          <span>
                            {room.capacity ? `${room.capacity} chỗ` : "Chưa rõ"}
                          </span>
                        </div>

                        {room.createdAt && (
                          <span className="opacity-50 text-[11px]">
                            {new Date(room.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
