import { DollarSign, Filter, FilterIcon, Search } from "lucide-react";
import { useThuHocPhiContext } from "../ThuHocPhiProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { StyleMapEnumTrangThaiHocPhi } from "../../../../components/StyleMapEnum/StyleMapEnum";
import Input from "../../../../components/ui/Form/Input";

const FilterOption = () => {
  const {
    filterSystem,
    filterStatus,
    setFilterStatus,
    setFilterSystem,
    searchQuery,
    setSearchQuery,
  } = useThuHocPhiContext();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex gap-2 items-center">
        <FilterIcon className="w-6 h-6 text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-gray-700 mb-4">Bộ lọc</p>
      </div>
      <div className="flex items-center gap-4">
        <SelectOption
          icon={<Filter className="w-4 h-4 text-gray-400" />}
          options={[
            {
              label: "Tất cả hệ đào tạo",
              value: "all",
            },
            {
              label: "Trung cấp nghề",
              value: "Trung cấp nghề",
            },
            {
              label: "Sơ cấp nghề",
              value: "Sơ cấp nghề",
            },
            {
              label: "Hệ 9+",
              value: "Hệ 9+",
            },
          ]}
          value={filterSystem}
          onChange={(e) => setFilterSystem(e.target.value)}
        />

        <SelectOption
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          icon={<DollarSign className="w-4 h-4 text-gray-400" />}
          options={[
            {
              label: "Tất cả trạng thái",
              value: "all",
            },
            ...Object.entries(StyleMapEnumTrangThaiHocPhi).map(
              ([key, config]) => ({
                label: config.label,
                value: key,
              }),
            ),
          ]}
        />

        <Input
          placeholder="Tìm theo tên, mã SV, lớp..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search} // Truyền component Search từ lucide-react vào
          containerClassName="ml-auto w-lg"
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default FilterOption;
