import React, { useState, useMemo, useEffect } from "react";
import { useHocSinhContext } from "../../HocSinhProvider";
import { $api } from "../../../../../api/client";
import {
  Filter,
  RefreshCw,
  Search,
  BookOpen,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const Filters = () => {
  const { data: majorList } = $api.useQuery("get", "/majors");
  const { data: rawKhoaHocList, isLoading: isLoadingKhoaHocs } = $api.useQuery(
    "get",
    "/batches",
  );

  const { setFilters, filters } = useHocSinhContext();

  // Giữ lại state cục bộ riêng cho keyword để làm debounce mượt mà hơn khi gõ phím
  const [keywordInput, setKeywordInput] = useState(filters.keyword || "");

  // 1. Debounce riêng cho ô Tìm kiếm Từ khóa (đợi ngưng gõ 400ms mới call API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: keywordInput.trim() || undefined,
        page: 1, // Reset về trang 1 khi tìm kiếm từ khóa mới
      }));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keywordInput, setFilters]);

  // Đồng bộ lại ô input nếu bộ lọc bị xóa từ bên ngoài (hoặc nút Xóa bộ lọc)
  useEffect(() => {
    setKeywordInput(filters.keyword || "");
  }, [filters.keyword]);

  // Quy đổi dữ liệu sang định dạng { value, label } cho Khóa học dựa trên majorId của context
  const filteredBatchesOptions = useMemo(() => {
    if (!filters.majorId) return [];
    const selectedMajorId = Number(filters.majorId);

    return (rawKhoaHocList || [])
      .filter((batch: any) => Number(batch.majorId) === selectedMajorId)
      .map((batch: any) => ({
        value: batch.id,
        label: batch.name || batch.batchName || `Khóa ${batch.id}`,
      }));
  }, [filters.majorId, rawKhoaHocList]);

  // Chuẩn hóa danh sách Ngành học
  const majorOptions = useMemo(() => {
    return (majorList || []).map((major: any) => ({
      value: major.id,
      label: major.name || major.majorName || `Ngành ${major.id}`,
    }));
  }, [majorList]);

  // Thay đổi ngành học -> Cập nhật context trực tiếp & reset khóa học liền lúc
  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      majorId: value ? Number(value) : undefined,
      batchId: undefined, // Reset Khóa học ngay tại đây
      page: 1,
    }));
  };

  // Thay đổi khóa học -> Cập nhật context trực tiếp
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      batchId: value ? Number(value) : undefined,
      page: 1,
    }));
  };

  // Nút xóa bộ lọc ở thanh Header
  const handleClearFilters = () => {
    setKeywordInput("");
    setFilters((prev) => ({
      ...prev,
      keyword: undefined,
      majorId: undefined,
      batchId: undefined,
      page: 1,
    }));
  };

  // Kiểm tra xem đang có bộ lọc nào được active không (bỏ qua page, limit, status...)
  const hasActiveFilters = Boolean(
    filters.keyword || filters.majorId || filters.batchId,
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200/80 mb-6 transition-all duration-200 hover:shadow-md">
      {/* Tiêu đề & Nút xóa bộ lọc đưa lên cùng 1 hàng */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-base">
          <Filter className="w-5 h-5 text-blue-500" />
          Bộ lọc tìm kiếm
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-200 transition-all duration-150 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Lưới 3 ô nhập liệu có kích thước hoàn toàn bằng đều nhau */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Ô TÌM KIẾM TỪ KHÓA */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            Từ khóa
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Mã SV, họ tên, email..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* 2. Ô CHỌN NGÀNH HỌC */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Ngành học
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <BookOpen className="w-4 h-4" />
            </span>
            <select
              value={filters.majorId || ""}
              onChange={handleMajorChange}
              className="w-full pl-9 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">-- Chọn ngành học --</option>
              {majorOptions.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Custom mũi tên chỉ xuống để đồng nhất giao diện */}
            <span className="absolute right-3 text-gray-400 pointer-events-none text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 3. Ô CHỌN KHÓA HỌC (Phụ thuộc vào ngành học) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Khóa học
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {isLoadingKhoaHocs ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : !filters.majorId ? (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
            </span>
            <select
              value={filters.batchId || ""}
              onChange={handleBatchChange}
              disabled={!filters.majorId || isLoadingKhoaHocs}
              className="w-full pl-9 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
            >
              {!filters.majorId ? (
                <option value="">⚠️ Chọn ngành trước</option>
              ) : (
                <>
                  <option value="">-- Chọn khóa học --</option>
                  {filteredBatchesOptions.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            <span className="absolute right-3 text-gray-400 pointer-events-none text-xs">
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
