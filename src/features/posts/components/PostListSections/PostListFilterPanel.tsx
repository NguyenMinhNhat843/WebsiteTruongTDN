import { usePostListContext, type Filters } from "../../hooks/usePostList";
import SelectFilter from "../../../../components/ui/SelectFilter";
import {
  AUDIENCE_META,
  CATEGORY_META,
} from "../../constants/postList.constant";

const PostListFilterPanel = () => {
  const { activeFilterCount, resetFilters, filters, setFilter } =
    usePostListContext();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <span className="text-sm font-semibold text-slate-700">Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-red-500 hover:text-red-700 transition"
          >
            Xoá bộ lọc
          </button>
        )}
        {/* Search */}
        <div className="relative ml-auto w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tên bài viết, tác giả..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Category */}
        <SelectFilter
          label="Danh mục"
          value={filters.category}
          onChange={(v) => setFilter("category", v as Filters["category"])}
          options={[
            { value: "all", label: "Tất cả danh mục" },
            ...Object.entries(CATEGORY_META).map(([k, v]) => ({
              value: k,
              label: `${v.icon} ${v.label}`,
            })),
          ]}
        />

        {/* Audience */}
        <SelectFilter
          label="Đối tượng"
          value={filters.audience}
          onChange={(v) => setFilter("audience", v as Filters["audience"])}
          options={[
            { value: "all", label: "Tất cả đối tượng" },
            ...Object.entries(AUDIENCE_META).map(([k, v]) => ({
              value: k,
              label: `${v.icon} ${v.label}`,
            })),
          ]}
        />

        {/* Status */}
        <SelectFilter
          label="Trạng thái"
          value={filters.status}
          onChange={(v) => setFilter("status", v as Filters["status"])}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "da-duyet", label: "✅ Đã duyệt" },
            { value: "cho-duyet", label: "⏳ Chờ duyệt" },
          ]}
        />

        {/* Date range */}
        <div className="col-span-2 flex flex-col gap-1 lg:col-span-1">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Thời gian
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilter("dateTo", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListFilterPanel;
