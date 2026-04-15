import FilterSectionWrapper from "../../../../components/ui/FilterSectionWrapper";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";
import { useLopHocVaKhoaHocContext } from "../LopHocVaKhoaHocProvider";
import { Grid, Search } from "lucide-react";

const FilterSection = () => {
  const {
    fKhoa,
    fNganh,
    fStatus,
    handleFilter,
    search,
    setFKhoa,
    setFStatus,
    setFNganh,
    setSearch,
  } = useLopHocVaKhoaHocContext();
  return (
    <FilterSectionWrapper
      activeCount={0}
      title="Bộ lọc"
      onClear={() => console.log("clear")}
    >
      <SelectOption
        options={[
          { label: "Khóa đào tạo", value: "" },
          { label: "K2022", value: "K2022" },
          { label: "K2023", value: "K2023" },
          { label: "K2024", value: "K2024" },
        ]}
        value={fKhoa}
        onChange={(e) => {
          setFKhoa(e.target.value);
          handleFilter();
        }}
        label="Khóa đào tạo"
        icon={<Grid size={16} />}
      />
      <SelectOption
        options={[
          { label: "Tất cả ngành", value: "" },
          { label: "Kế toán", value: "Kế toán" },
          { label: "CNTT", value: "CNTT" },
          { label: "Điện – Điện tử", value: "Điện – Điện tử" },
          { label: "Cơ khí", value: "Cơ khí" },
        ]}
        value={fNganh}
        onChange={(e) => {
          setFNganh(e.target.value);
          handleFilter();
        }}
        label="Ngành học"
        icon={<Grid size={16} />}
      />
      <SelectOption
        label="Trạng thái"
        icon={<Grid size={16} />}
        options={[
          {
            label: "Tất cả trạng thái",
            value: "",
          },
          {
            label: "Đang học",
            value: "dang_hoc",
          },
          {
            label: "Đang tuyển",
            value: "dang_tuyen",
          },
          {
            label: "Đã kết thúc",
            value: "da_ket_thuc",
          },
        ]}
        value={fStatus}
        onChange={(e) => {
          setFStatus(e.target.value);
          handleFilter();
        }}
      />
      <Input
        label="Tìm kiếm"
        placeholder="Tìm theo mã lớp, tên lớp..."
        icon={Search}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleFilter();
        }}
        type="text"
      />
    </FilterSectionWrapper>
  );
};

export default FilterSection;
