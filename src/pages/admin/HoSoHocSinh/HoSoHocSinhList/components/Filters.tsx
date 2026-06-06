import React, { useState, useMemo } from "react";
import { useHocSinhContext } from "../../HocSinhProvider";
import { $api } from "../../../../../api/client";
import SelectSearchInput from "../../../../../components/ui/Form/SelectInput";
import { SelectOption } from "../../../../../components/ui/Form/SelectOption";
import SearchInput from "../../../../../components/ui/Form/SearchInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
const STATUS_LABELS: Record<string, string> = {
  approved: "Đã duyệt",
  studying: "Đang học",
  suspended: "Bảo lưu",
  dropped: "Tự thôi học",
  expelled: "Buộc thôi học",
  graduated: "Đã tốt nghiệp",
};

const Filters = () => {
  const { data: majorList } = $api.useQuery("get", "/majors");
  const { data: rawKhoaHocList, isLoading: isLoadingKhoaHocs } = $api.useQuery(
    "get",
    "/batches",
  );

  const { setFilters, filters } = useHocSinhContext();

  const [formValues, setFormValues] = useState({
    keyword: "",
    status: "" as any,
    majorId: "" as string | number,
    batchId: "" as string | number,
  });

  // =========================================================================
  // GIẢI PHÁP SỬA LỖI: Sử dụng useMemo thay thế cho useEffect
  // Quy đổi dữ liệu sang định dạng { value, label } phù hợp với SelectSearchInput
  // =========================================================================
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

  // Chuẩn hóa danh sách Trạng thái cho SelectOption
  const statusOptions = useMemo(() => {
    return Object.entries(STATUS_LABELS).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  }, []);

  // =========================================================================
  // XỬ LÝ SỰ KIỆN: Đồng thời thay đổi ngành học và reset khóa học
  // =========================================================================
  const handleMajorChange = (e: any) => {
    // SelectSearchInput trả ra event object hoặc custom value tùy cách triển khai,
    // đảm bảo bóc tách lấy được value mới của Ngành học.
    const newMajorId = e?.target ? e.target.value : e;
    setFormValues((prev) => ({
      ...prev,
      majorId: newMajorId,
      batchId: "", // Reset Khóa học ngay tại đây để loại bỏ hoàn toàn useEffect
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      keyword: formValues.keyword.trim() || undefined,
      status: formValues.status || undefined,
      majorId: formValues.majorId ? Number(formValues.majorId) : undefined,
      batchId: formValues.batchId ? Number(formValues.batchId) : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setFormValues({
      keyword: "",
      status: "" as any,
      majorId: "",
      batchId: "",
    });
    setFilters({});
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>
        Bộ lọc tìm kiếm
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* 1. Ô tìm kiếm Từ khóa bằng SearchInput dùng chung */}
        <SearchInput
          label="Từ khóa"
          placeholder="Mã SV, họ tên, email..."
          value={formValues.keyword}
          onChange={(value) =>
            setFormValues((prev) => ({ ...prev, keyword: value }))
          }
        />

        {/* 2. Ô chọn Ngành học bằng SelectSearchInput (Có tính năng tìm kiếm) */}
        <SelectSearchInput
          label="Ngành học"
          placeholder="-- Chọn ngành học --"
          options={majorOptions}
          value={formValues.majorId}
          onChange={handleMajorChange}
        />

        {/* 3. Ô chọn Khóa học bằng SelectSearchInput (Lọc động theo ngành) */}
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

        {/* 4. Ô chọn Trạng thái hồ sơ bằng SelectOption (Dropdown native cơ bản) */}
        <SelectOption
          label="Trạng thái hồ sơ"
          options={statusOptions}
          value={formValues.status}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              status: e.target.value as any,
            }))
          }
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Xóa bộ lọc
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z"
            />
          </svg>
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default Filters;
