import { useState } from "react";
import { $api } from "../../api/client";
import { SelectOption } from "./Form/SelectOption";

interface SelectBatchProps {
  onMajorChange?: (majorId: number | null) => void;
  onBatchChange?: (batchId: number | null) => void;
  className?: string;
}

const SelectBatch = ({
  onMajorChange,
  onBatchChange,
  className = "grid grid-cols-1 md:grid-cols-2 gap-4 w-full",
}: SelectBatchProps) => {
  const [selectedMajor, setSelectedMajor] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  // 1. Lấy danh sách ngành đào tạo
  const { data: nganhs, isLoading: isLoadingNganhs } = $api.useQuery(
    "get",
    "/majors",
  );

  // 2. Lấy danh sách khóa đào tạo phụ thuộc vào ngành đã chọn
  const { data: daoTaos, isLoading: isLoadingDaoTaos } = $api.useQuery(
    "get",
    "/batches",
    {
      params: {
        query: {
          majorId: selectedMajor as number,
        },
      },
    },
    {
      enabled: !!selectedMajor,
    },
  );

  // Chuẩn hóa dữ liệu cho SelectOption Ngành
  const nganhOptions = [
    {
      value: "",
      label: isLoadingNganhs
        ? "Đang tải danh sách ngành..."
        : "-- Chọn ngành học --",
    },
    ...(nganhs?.map((nganh) => ({
      value: String(nganh.id),
      label: nganh.majorName,
    })) || []),
  ];

  // Chuẩn hóa dữ liệu cho SelectOption Khóa đào tạo
  const daoTaoOptions = [
    {
      value: "",
      label: !selectedMajor
        ? "-- Vui lòng chọn ngành trước --"
        : isLoadingDaoTaos
          ? "Đang tải khóa đào tạo..."
          : "-- Chọn khóa đào tạo --",
    },
    ...(daoTaos?.map((daoTao) => ({
      value: String(daoTao.id),
      label: daoTao.batchName,
    })) || []),
  ];

  return (
    <div className={className}>
      {/* Select Chọn Ngành Học */}
      <SelectOption
        label="Ngành đào tạo"
        options={nganhOptions}
        disabled={isLoadingNganhs}
        value={selectedMajor ? String(selectedMajor) : ""}
        onChange={(e) => {
          const val = e.target.value ? Number(e.target.value) : null;

          // Xử lý đồng thời: Cập nhật ngành mới + Khai tử khóa học cũ ngay tại Event Handler
          setSelectedMajor(val);
          setSelectedBatch(null); // Reset state tại đây cực kỳ an toàn

          if (onMajorChange) onMajorChange(val);
          if (onBatchChange) onBatchChange(null); // Báo ra ngoài là khóa học đã bị hủy
        }}
      />

      {/* Select Chọn Khóa Đào Tạo */}
      <SelectOption
        label="Khóa đào tạo (Đợt)"
        options={daoTaoOptions}
        disabled={!selectedMajor || isLoadingDaoTaos}
        value={selectedBatch ? String(selectedBatch) : ""}
        onChange={(e) => {
          const val = e.target.value ? Number(e.target.value) : null;
          setSelectedBatch(val);
          if (onBatchChange) onBatchChange(val);
        }}
      />
    </div>
  );
};

export default SelectBatch;
