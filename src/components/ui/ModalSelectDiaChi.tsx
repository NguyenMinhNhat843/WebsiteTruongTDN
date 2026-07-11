import { useState, useMemo } from "react";
import { $api } from "../../api/client";
import { Search, ChevronRight, X, Check, MapPin, Loader2 } from "lucide-react";

interface SelectedAddress {
  province: { code: string; name: string } | null;
  ward: { code: string; name: string } | null;
  village: { id: number; name: string } | null;
}

interface ModalSelectDiaChiProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: SelectedAddress) => void;
}

const ModalSelectDiaChi = ({
  isOpen,
  onClose,
  onSelect,
}: ModalSelectDiaChiProps) => {
  // States lưu item đang được chọn active ở mỗi cột
  const [selectedTinh, setSelectedTinh] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [selectedXa, setSelectedXa] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [selectedThon, setSelectedThon] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // States hỗ trợ ô tìm kiếm (Search) ở mỗi cột
  const [searchTinh, setSearchTinh] = useState("");
  const [searchXa, setSearchXa] = useState("");
  const [searchThon, setSearchThon] = useState("");

  // --- API FETCHING ---
  const { data: tinhs, isLoading: isLoadingTinh } = $api.useQuery(
    "get",
    "/provinces",
  );

  const { data: xa, isLoading: isLoadingXa } = $api.useQuery(
    "get",
    "/wards",
    { params: { query: { provinceCode: selectedTinh?.code || "" } } },
    { enabled: !!selectedTinh?.code },
  );

  const { data: thon, isLoading: isLoadingThon } = $api.useQuery(
    "get",
    "/villages",
    { params: { query: { wardCode: selectedXa?.code || "" } } },
    { enabled: !!selectedXa?.code },
  );

  // --- LOGIC SEARCH TẠI LOCAL ---
  const filteredTinhs = useMemo(() => {
    return (
      tinhs?.filter((t) =>
        t.name.toLowerCase().includes(searchTinh.toLowerCase()),
      ) || []
    );
  }, [tinhs, searchTinh]);

  const filteredXas = useMemo(() => {
    return (
      xa?.filter((x) =>
        x.name.toLowerCase().includes(searchXa.toLowerCase()),
      ) || []
    );
  }, [xa, searchXa]);

  const filteredThons = useMemo(() => {
    return (
      thon?.filter((v) =>
        v.name.toLowerCase().includes(searchThon.toLowerCase()),
      ) || []
    );
  }, [thon, searchThon]);

  // --- LOGIC KHI CHANGE LỰA CHỌN ---
  const handleSelectTinh = (code: string, name: string) => {
    setSelectedTinh({ code, name });
    setSelectedXa(null);
    setSelectedThon(null);
    setSearchXa("");
    setSearchThon("");
  };

  const handleSelectXa = (code: string, name: string) => {
    setSelectedXa({ code, name });
    setSelectedThon(null);
    setSearchThon("");
  };

  const handleClearAll = () => {
    setSelectedTinh(null);
    setSelectedXa(null);
    setSelectedThon(null);
    setSearchTinh("");
    setSearchXa("");
    setSearchThon("");
  };

  const handleApply = () => {
    onSelect({
      province: selectedTinh,
      ward: selectedXa,
      village: selectedThon,
    });
    onClose();
  };

  if (!isOpen) return null;

  // Component render loading skeleton giả lập danh sách mượt mà hơn
  const RenderSkeleton = () => (
    <div className="p-2 space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 w-full rounded-lg bg-gray-100" />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-200">
      <div className="flex h-[600px] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chọn địa chỉ hành chính
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Vui lòng chọn lần lượt Tỉnh/Thành phố, Phường/Xã và Thôn/Xóm
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thân Modal - Chia 3 cột bằng Flex/Grid */}
        <div className="flex flex-1 overflow-hidden divide-x divide-gray-100 bg-gray-50/50">
          {/* CỘT 1: TỈNH / THÀNH PHỐ */}
          <div className="flex w-1/3 flex-col bg-white">
            <div className="relative p-3 border-b border-gray-100 bg-white">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm Tỉnh/Thành phố..."
                value={searchTinh}
                onChange={(e) => setSearchTinh(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-8 text-sm placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:outline-none transition-all"
              />
              {searchTinh && (
                <button
                  type="button"
                  onClick={() => setSearchTinh("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
              {isLoadingTinh ? (
                <RenderSkeleton />
              ) : filteredTinhs.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">
                  Không tìm thấy kết quả
                </div>
              ) : (
                filteredTinhs.map((t) => {
                  const isSelected = selectedTinh?.code === t.code;
                  return (
                    <button
                      key={t.code}
                      type="button"
                      onClick={() => handleSelectTinh(t.code, t.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all active:scale-[0.99] ${
                        isSelected
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      <ChevronRight
                        size={14}
                        className={
                          isSelected ? "text-green-600" : "text-gray-400"
                        }
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT 2: PHƯỜNG / XÃ */}
          <div
            className={`flex w-1/3 flex-col bg-white transition-opacity duration-200 ${!selectedTinh ? "opacity-50 bg-gray-50/50" : ""}`}
          >
            <div className="relative p-3 border-b border-gray-100 bg-white">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm Phường/Xã..."
                disabled={!selectedTinh}
                value={searchXa}
                onChange={(e) => setSearchXa(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-8 text-sm placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {searchXa && (
                <button
                  onClick={() => setSearchXa("")}
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {!selectedTinh ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-gray-400 space-y-2">
                  <MapPin size={20} className="text-gray-300 animate-bounce" />
                  <span>Vui lòng chọn Tỉnh/Thành phố trước</span>
                </div>
              ) : isLoadingXa ? (
                <RenderSkeleton />
              ) : filteredXas.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">
                  Không tìm thấy kết quả
                </div>
              ) : (
                filteredXas.map((x) => {
                  const isSelected = selectedXa?.code === x.code;
                  return (
                    <button
                      key={x.code}
                      type="button"
                      onClick={() => handleSelectXa(x.code, x.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all active:scale-[0.99] ${
                        isSelected
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{x.name}</span>
                      <ChevronRight
                        size={14}
                        className={
                          isSelected ? "text-green-600" : "text-gray-400"
                        }
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT 3: THÔN / XÓM / TỔ */}
          <div
            className={`flex w-1/3 flex-col bg-white transition-opacity duration-200 ${!selectedXa ? "opacity-50 bg-gray-50/50" : ""}`}
          >
            <div className="relative p-3 border-b border-gray-100 bg-white">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm Thôn/Xóm/Tổ dân phố..."
                disabled={!selectedXa}
                value={searchThon}
                onChange={(e) => setSearchThon(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-8 text-sm placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {searchThon && (
                <button
                  onClick={() => setSearchThon("")}
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {!selectedXa ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-gray-400 space-y-2">
                  <MapPin size={20} className="text-gray-300" />
                  <span>Vui lòng chọn Phường/Xã trước</span>
                </div>
              ) : isLoadingThon ? (
                <RenderSkeleton />
              ) : filteredThons.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  Không tìm thấy dữ liệu thôn/xóm nào
                </div>
              ) : (
                filteredThons.map((v) => {
                  const isSelected = selectedThon?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() =>
                        setSelectedThon({ id: v.id, name: v.name })
                      }
                      type="button"
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all active:scale-[0.99] ${
                        isSelected
                          ? "bg-green-100/70 text-green-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{v.name}</span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-green-700 stroke-[3]"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={handleClearAll}
            disabled={!selectedTinh && !searchTinh}
            className="text-sm font-medium text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:no-underline hover:underline transition-colors"
          >
            Xóa tất cả lựa chọn
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedTinh} // Tối thiểu chọn Tỉnh mới cho áp dụng
              className="rounded-xl bg-green-600 px-6 py-2 text-sm font-medium text-white shadow-sm shadow-green-600/10 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Xác nhận áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSelectDiaChi;
