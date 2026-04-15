import FilterSectionWrapper from "../../../../components/ui/FilterSectionWrapper";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { STATUS_LABELS, TRAINING_SYSTEM_LABELS } from "../constants";
import type { AdmissionStatus, TrainingSystem } from "../type";
import { useTuyenSinhContext } from "../TuyenSinhProvider";

const FilterSection = () => {
  const { setStatusFilter, statusFilter, setSystemFilter, systemFilter } =
    useTuyenSinhContext();
  return (
    <FilterSectionWrapper title="Bộ lọc" classNameBody="grid grid-cols-2 gap-4">
      <SelectOption
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as AdmissionStatus | "all")
        }
        options={[
          {
            label: "Tất cả trạng thái",
            value: "",
          },
          ...Object.entries(STATUS_LABELS).map(([k, v]) => ({
            label: v,
            value: k,
          })),
        ]}
      />

      <SelectOption
        value={systemFilter}
        onChange={(e) =>
          setSystemFilter(e.target.value as TrainingSystem | "all")
        }
        options={[
          {
            label: "Tất cả hệ đào tạo",
            value: "",
          },
          ...Object.entries(TRAINING_SYSTEM_LABELS).map(([k, v]) => ({
            label: k,
            value: v,
          })),
        ]}
      />
    </FilterSectionWrapper>
  );
};

export default FilterSection;
