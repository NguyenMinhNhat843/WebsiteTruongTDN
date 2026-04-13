import { Filter, Search } from "lucide-react";
import Input from "../../../../components/ui/Form/Input";
import { useExemtionContext } from "../ExemtionProvider";
import { exemptionTypes } from "../mockData";

const FiltersSection = () => {
  const {
    filterStatus,
    filterType,
    searchQuery,
    setFilterStatus,
    setFilterType,
    setSearchQuery,
  } = useExemtionContext();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4">
        {/* Label & Filter Icon */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="w-5 h-5 text-gray-500" />
          <span>Bộ lọc:</span>
        </div>

        {/* Các Select filters */}
        {[
          { val: filterType, set: setFilterType, options: exemptionTypes },
          {
            val: filterStatus,
            set: setFilterStatus,
            options: [
              { value: "all", label: "Tất cả trạng thái" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              { value: "rejected", label: "Từ chối" },
            ],
          },
        ].map((f, i) => (
          <select
            key={i}
            value={f.val}
            onChange={(e) => f.set(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Ô Tìm kiếm */}
        <Input
          icon={Search}
          placeholder="Tìm theo tên, mã SV..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          containerClassName="w-md ml-auto"
        />
      </div>
    </div>
  );
};

export default FiltersSection;
