import { Calendar } from "lucide-react";
import {
  ThoiKhoaBieuProvider,
  useThoiKhoaBieuContext,
} from "./ThoiKhoaBieuProvider";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import PageShell from "../../../components/ui/PageShell";
import { ThoiKhoaBieuTable } from "./ThoiKhoaBieu";

const ThoiKhoaBieuWrapper = () => {
  return (
    <ThoiKhoaBieuProvider>
      <InnerLayout />
    </ThoiKhoaBieuProvider>
  );
};

const InnerLayout = () => {
  const {
    semesterId,
    classId,
    lopHocsData,
    hocKysData,
    setSemesterId,
    setClassId,
    scheduleItems,
  } = useThoiKhoaBieuContext();

  const semester = hocKysData?.find((hk) => hk.id === semesterId);

  return (
    <PageShell
      title="Thời khóa biểu"
      sub="Quản lý thời khóa biểu của các lớp học"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* ================= BỘ LỌC (FILTERS) BÊN NGOÀI ================= */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64 space-y-1.5">
            <SelectOption
              label="Chọn học kỳ để xem thời khóa biểu"
              options={[
                { value: "", label: "Chọn học kỳ để xem" },
                ...(hocKysData?.map((hocKy) => ({
                  value: hocKy.id,
                  label: hocKy.name,
                })) || []),
              ]}
              value={semesterId || undefined}
              onChange={(e) => setSemesterId(Number(e.target.value))}
            />
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <SelectOption
              label="Chọn lớp học để xem thời khóa biểu"
              options={[
                { value: "", label: "Chọn lớp học để xem" },
                ...(lopHocsData?.map((lopHoc) => ({
                  value: lopHoc.id,
                  label: lopHoc.className,
                })) || []),
              ]}
              value={classId || undefined}
              onChange={(e) => setClassId(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ================= BẢNG NHẬN DATA THỜI KHÓA BIỂU ================= */}
        <ThoiKhoaBieuTable scheduleData={scheduleItems} semester={semester} />
      </div>
    </PageShell>
  );
};

export default ThoiKhoaBieuWrapper;
