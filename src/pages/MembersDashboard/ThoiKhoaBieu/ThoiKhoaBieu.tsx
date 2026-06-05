import { Calendar, Loader2 } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import {
  ThoiKhoaBieuProvider,
  useThoiKhoaBieuContext,
} from "./ThoiKhoaBieuProvider";
import { ThoiKhoaBieuTable } from "../../admin/ThoiKhoaBieu/ThoiKhoaBieu";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import { useAppContext } from "../../../AppProvider";

const ThoiKhoaBieu = () => {
  return (
    <ThoiKhoaBieuProvider>
      <Inner />
    </ThoiKhoaBieuProvider>
  );
};

const Inner = () => {
  const {
    semester,
    studySchedule,
    isLoadingStudySchedule,
    semesterIdSelected,
    setSearchParams,
    searchParams,
  } = useThoiKhoaBieuContext();
  const { hocKysData, isHocKysLoading } = useAppContext();

  const semesterOptions = hocKysData?.map((hk) => ({
    value: hk.id,
    label: hk.name,
  }));

  const isLoading = isHocKysLoading || isLoadingStudySchedule;

  return (
    <PageShell
      title="Lịch giảng dạy"
      sub="Quản lý thời gian và lộ trình giảng dạy cá nhân trong tuần."
      icon={Calendar}
      renderRight={
        <SelectOption
          options={semesterOptions}
          value={semesterIdSelected || undefined}
          containerClassName="w-48"
          disabled={isHocKysLoading}
          onChange={(e) => {
            const value = e.target.value;
            const newParams = new URLSearchParams(searchParams);
            if (value) {
              newParams.set("semesterId", value);
            } else {
              newParams.delete("semesterId");
            }
            setSearchParams(newParams);
          }}
        />
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-2 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">
            Đang tải dữ liệu lịch giảng dạy...
          </p>
        </div>
      ) : (
        <ThoiKhoaBieuTable scheduleData={studySchedule} semester={semester} />
      )}
    </PageShell>
  );
};

export default ThoiKhoaBieu;
