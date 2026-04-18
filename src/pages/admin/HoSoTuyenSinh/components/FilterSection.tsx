import { GraduationCap, Search, Activity, Calendar } from "lucide-react";
import { admissionBatches, useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";

const FilterSection = () => {
  const {
    filterBatch,
    setFilterBatch,
    filterSystem,
    setFilterSystem,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useQuanLyHoSoContext();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Lọc theo Đợt */}
        <SelectOption
          label="Đợt xét tuyển"
          icon={<Calendar size={16} />}
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
          options={admissionBatches.map((batch) => ({
            value: batch.value,
            label: batch.label,
          }))}
          containerClassName="min-w-[200px]"
        />

        {/* Lọc theo Hệ đào tạo */}
        <SelectOption
          label="Hệ đào tạo"
          icon={<GraduationCap size={16} />}
          value={filterSystem}
          onChange={(e) => setFilterSystem(e.target.value)}
          options={[
            { value: "all", label: "Tất cả hệ đào tạo" },
            { value: "Trung cấp nghề", label: "Trung cấp nghề" },
            { value: "Sơ cấp nghề", label: "Sơ cấp nghề" },
            { value: "Đại học liên kết", label: "Đại học liên kết" },
            { value: "Hệ 9+", label: "Hệ 9+" },
          ]}
          containerClassName="min-w-[200px]"
        />

        {/* Lọc theo Trạng thái */}
        <SelectOption
          label="Trạng thái"
          icon={<Activity size={16} />}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "submitted", label: "Đã nộp" },
            { value: "reviewing", label: "Đang xét" },
            { value: "approved", label: "Đạt" },
            { value: "rejected", label: "Không đạt" },
          ]}
          containerClassName="min-w-[180px]"
        />

        {/* Ô tìm kiếm - Căn chỉnh lại chiều cao để khớp với SelectOption */}
        <div className="ml-auto flex flex-col gap-1.5 w-full md:w-auto">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Tìm kiếm
          </label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 h-11.5 transition-all focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tên, mã HS, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none text-sm bg-transparent w-full md:w-64 text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
