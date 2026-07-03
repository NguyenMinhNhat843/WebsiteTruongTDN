import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLopHocContext } from "../../LopHocProvider";
import Input from "../../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../../components/ui/Form/SelectOption";

const SearchClassSection = () => {
  const { filterClass, setFilterClass, nganhHocs, khoaHocs } =
    useLopHocContext();

  const majorOptions = [
    { value: "", label: "Tất cả ngành học" },
    ...(nganhHocs?.map((nganh) => ({
      value: String(nganh.id), // Ép kiểu số thành chuỗi
      label: nganh.majorName,
    })) || []),
  ];

  const batchOptions = [
    { value: "", label: "Tất cả khóa học" },
    ...(khoaHocs
      ?.filter(
        (khoa) =>
          khoa.majorId === filterClass?.majorId || !filterClass?.majorId,
      )
      .map((khoa) => ({
        value: String(khoa.id), // Ép kiểu số thành chuỗi để khớp 100% với "" ở trên
        label: khoa.batchName,
      })) || []),
  ];

  // State cục bộ phục vụ cơ chế Debounce ô Input tìm kiếm
  const [searchTerm, setSearchTerm] = useState(filterClass?.search || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilterClass((prev) => ({
        ...prev,
        search: searchTerm || undefined,
      }));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setFilterClass]);

  // Hàm xử lý thay đổi Dropdown Khóa học (Batch)
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterClass((prev) => ({
      ...prev,
      batchId: value ? Number(value) : undefined,
    }));
  };

  // Hàm xử lý thay đổi Dropdown Ngành học (Major)
  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterClass((prev) => ({
      ...prev,
      majorId: value ? Number(value) : undefined,
    }));
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end bg-white p-5 rounded-2xl border border-gray-100 shadow-sm w-full">
      {/* Cột 2: Chọn Ngành học */}
      <div className="w-full md:w-1/3">
        <SelectOption
          label="Ngành học"
          options={majorOptions}
          value={filterClass?.majorId || ""}
          onChange={handleMajorChange}
        />
      </div>
      {/* Cột 1: Chọn Khóa học */}
      <div className="w-full md:w-1/3">
        <SelectOption
          label="Khóa học"
          options={batchOptions}
          value={filterClass?.batchId || ""}
          onChange={handleBatchChange}
        />
      </div>

      <div className="w-full md:w-1/3">
        <Input
          label="Tìm kiếm nhanh"
          type="text"
          placeholder="Nhập mã lớp hoặc tên lớp..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchClassSection;
