import React, { useState, useMemo } from "react";
import { useHocSinhContext } from "../../HocSinhProvider";
import { $api } from "../../../../../api/client";
import SelectSearchInput from "../../../../../components/ui/Form/SelectInput";
import SearchInput from "../../../../../components/ui/Form/SearchInput";
import { Filter, RefreshCw, Search } from "lucide-react"; // Import Lucide Icons

/* eslint-disable @typescript-eslint/no-explicit-any */
const Filters = () => {
  const { data: majorList } = $api.useQuery("get", "/majors");
  const { data: rawKhoaHocList, isLoading: isLoadingKhoaHocs } = $api.useQuery(
    "get",
    "/batches",
  );

  const { setFilters, filters } = useHocSinhContext();

  const [formValues, setFormValues] = useState({
    keyword: "",
    majorId: "" as string | number,
    batchId: "" as string | number,
  });

  // Quy đổi dữ liệu sang định dạng { value, label } phù hợp với SelectSearchInput
  const filteredBatchesOptions = useMemo(() => {
    if (!formValues.majorId) return [];
    const selectedMajorId = Number(formValues.majorId);

    return (rawKhoaHocList || [])
      .filter((batch: any) => Number(batch.majorId) === selectedMajorId)
      .map((batch: any) => ({
        value: batch.id,
        label: batch.name || batch.batchName || `Khóa ${batch.id}`,
      }));
  }, [formValues.majorId, rawKhoaHocList]);

  // Chuẩn hóa danh sách Ngành học cho SelectSearchInput
  const majorOptions = useMemo(() => {
    return (majorList || []).map((major: any) => ({
      value: major.id,
      label: major.name || major.majorName || `Ngành ${major.id}`,
    }));
  }, [majorList]);

  // Đồng thời thay đổi ngành học và reset khóa học
  const handleMajorChange = (e: any) => {
    const newMajorId = e?.target ? e.target.value : e;
    setFormValues((prev) => ({
      ...prev,
      majorId: newMajorId,
      batchId: "", // Reset Khóa học ngay tại đây
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      keyword: formValues.keyword.trim() || undefined,
      majorId: formValues.majorId ? Number(formValues.majorId) : undefined,
      batchId: formValues.batchId ? Number(formValues.batchId) : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setFormValues((prev) => ({
      ...prev,
      keyword: "",
      majorId: "",
      batchId: "",
    }));

    setFilters((prev) => ({
      ...prev,
      keyword: undefined,
      majorId: undefined,
      batchId: undefined,
      page: 1,
    }));
  };

  const hasActiveFilters =
    Object.keys(filters || {}).filter((k) => k !== "page").length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white rounded-xl shadow-sm border border-gray-200/80 mb-6 transition-all duration-200 hover:shadow-md"
    >
      {/* Tiêu đề vùng lọc dữ liệu */}
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-base border-b border-gray-100 pb-2">
        <Filter className="w-5 h-5 text-blue-500" />
        Bộ lọc tìm kiếm
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
        {/* 1. Ô tìm kiếm Từ khóa */}
        <SearchInput
          label="Từ khóa"
          placeholder="Mã SV, họ tên, email..."
          value={formValues.keyword}
          onChange={(value) =>
            setFormValues((prev) => ({ ...prev, keyword: value }))
          }
        />

        {/* 2. Ô chọn Ngành học */}
        <SelectSearchInput
          label="Ngành học"
          placeholder="-- Chọn ngành học --"
          options={majorOptions}
          value={formValues.majorId}
          onChange={handleMajorChange}
        />

        {/* 3. Ô chọn Khóa học */}
        <SelectSearchInput
          label="Khóa học"
          placeholder={
            !formValues.majorId ? "⚠️ Chọn ngành trước" : "-- Chọn khóa học --"
          }
          options={filteredBatchesOptions}
          value={formValues.batchId}
          onChange={(value) =>
            setFormValues((prev) => ({
              ...prev,
              batchId: value?.target ? value.target.value : value,
            }))
          }
          isLoading={isLoadingKhoaHocs}
          disabled={!formValues.majorId || isLoadingKhoaHocs}
        />
      </div>

      {/* Khu vực nút bấm điều khiển */}
      <div className="flex justify-end gap-3 mt-5 border-t border-gray-100 pt-4">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-150 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 animate-duration-500" />
            Xóa bộ lọc
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default Filters;
