import { Search } from "lucide-react";
import FilterSectionWrapper from "../../../../components/ui/FilterSectionWrapper";
import { INITIAL_MAJORS } from "../mockData";
import { useXetTotNghiepContext } from "../XetTotNghiepProvider";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";

const FilterSection = () => {
  const {
    filterMajor,
    filterStatus,
    filterSystem,
    searchTerm,
    setFilterMajor,
    setFilterStatus,
    setFilterSystem,
    setSearchTerm,
  } = useXetTotNghiepContext();
  return (
    <FilterSectionWrapper title="Bộ lọc" classNameBody="grid grid-cols-3 gap-3">
      <Input
        label="Tìm kiếm"
        icon={Search}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tên hoặc mã SV..."
      />

      <SelectOption
        label="Hệ đào tạo"
        value={filterSystem}
        onChange={(e) => setFilterSystem(e.target.value as any)}
        options={[
          {
            label: "Tất cả hệ đào tạo",
            value: "",
          },
          {
            label: "Trung cấp",
            value: "trungcap",
          },
          {
            label: "Sơ cấp",
            value: "socap",
          },
          {
            label: "9+",
            value: "9plus",
          },
          {
            label: "Đại học liên kết",
            value: "daihoclienket",
          },
        ]}
      />

      <SelectOption
        label="Ngành học"
        value={filterMajor}
        onChange={(e) => setFilterMajor(e.target.value)}
        options={INITIAL_MAJORS.map((m) => ({
          label: m,
          value: m,
        }))}
      />

      {/* Trạng thái xét duyệt */}
      <div className="col-span-3 pt-2">
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
          Trạng thái xét
        </label>
        <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          {(
            [
              "All",
              "Đủ điều kiện",
              "Không đủ điều kiện",
              "Đang xem xét",
            ] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`flex-1 py-2.5 text-[10px] font-bold rounded-md transition-all ${
                filterStatus === status
                  ? "bg-white shadow-sm text-blue-600 border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {status === "All" ? "TẤT CẢ" : status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </FilterSectionWrapper>
  );
};

export default FilterSection;
