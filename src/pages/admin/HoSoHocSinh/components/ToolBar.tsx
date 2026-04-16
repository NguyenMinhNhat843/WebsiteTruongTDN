import { LayoutGrid, List } from "lucide-react";
import React from "react";
import type { EnumHeDaoTao } from "../../../../type/enum";
import { useHoSoHocSinhContext } from "../HoSoHocSinhProvider";
import { ALL_HE_DAO_TAO, ALL_TRANG_THAI } from "../mockStyleMapEnum";
import type { FilterState, TrangThaiHocSinh } from "../mockType";
import FilterSectionWrapper from "../../../../components/ui/FilterSectionWrapper";
import SearchInput from "../../../../components/ui/Form/SearchInput";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";

const ToolBar = () => {
  const {
    handleFilter,
    search,
    setViewMode,
    viewMode,
    filter,
    setSearch,
    lopList,
  } = useHoSoHocSinhContext();
  return (
    <FilterSectionWrapper
      classNameBody="grid grid-cols-3 gap-6"
      renderHeader={() => {
        return (
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        );
      }}
    >
      <SearchInput
        placeholder="Tìm theo tên, mã HS, SĐT, lớp..."
        value={search}
        onChange={setSearch}
        label="Tìm kiếm"
      />

      {/* Quick filters */}
      <SelectOption
        label="Hệ đào tạo"
        options={[
          { label: "Tất cả hệ", value: "" },
          ...ALL_HE_DAO_TAO.map((h) => ({ label: h, value: h })),
        ]}
        value={filter.heDaoTao}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleFilter("heDaoTao", e.target.value as EnumHeDaoTao | "")
        }
      />
      <SelectOption
        label="Trạng thái"
        options={[
          { label: "Tất cả trạng thái", value: "" },
          ...ALL_TRANG_THAI.map((t) => ({ label: t, value: t })),
        ]}
        value={filter.trangThai}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleFilter("trangThai", e.target.value as TrangThaiHocSinh | "")
        }
      />
      <SelectOption
        label="Lớp học"
        value={filter.lop}
        onChange={(e) => handleFilter("lop", e.target.value)}
        options={[
          { label: "Tất cả lớp", value: "" },
          ...lopList.map((l) => ({ label: l, value: l })),
        ]}
      />
      <SelectOption
        label="Học bổng"
        value={filter.hocBong}
        onChange={(e) =>
          handleFilter("hocBong", e.target.value as FilterState["hocBong"])
        }
        options={[
          { label: "Tất cả", value: "" },
          { label: "Có học bổng", value: "co" },
          { label: "Không có", value: "khong" },
        ]}
      />

      <SelectOption
        label="Hồ sơ thiếu"
        value={filter.hoSoThieu}
        onChange={(e) =>
          handleFilter("hoSoThieu", e.target.value as FilterState["hoSoThieu"])
        }
        options={[
          { label: "Tất cả", value: "" },
          { label: "Còn thiếu giấy tờ", value: "co" },
          { label: "Hồ sơ đầy đủ", value: "khong" },
        ]}
      />
    </FilterSectionWrapper>
  );
};

export default ToolBar;
