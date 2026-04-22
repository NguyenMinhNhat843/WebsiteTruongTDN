import { useState } from "react";
import {
  BookOpen,
  Users,
  DoorOpen,
  Clock,
  Eye,
  LayoutGrid,
} from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import PageShell from "../../../components/ui/PageShell";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import ReusableTable from "../../../components/ui/Table";
import ChiTietLopHoc from "./ChiTietLopHoc";
import {
  LopGiangDayProvider,
  useLopGiangDayContext,
} from "./LopGiangDayProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */

const LopHocGiangDay = () => {
  return (
    <LopGiangDayProvider>
      <Inner />
    </LopGiangDayProvider>
  );
};
const Inner = () => {
  const { classSelected, setClassSelected } = useLopGiangDayContext();
  const [selectedSemester, setSelectedSemester] = useState("HK1-2026");

  //Danh sách học kỳ cho bộ lọc
  const semesterOptions = [
    { value: "HK1-2026", label: "Học kỳ 1 - 2026" },
    { value: "HK2-2026", label: "Học kỳ 2 - 2026" },
    { value: "HK1-2025", label: "Học kỳ 1 - 2025" },
    { value: "HK2-2025", label: "Học kỳ 2 - 2025" },
  ];

  //Dữ liệu mẫu lớp học
  const MOCK_CLASSES = [
    {
      id: "KTDN20A",
      className: "Kế toán doanh nghiệp",
      classCode: "KTDN20A",
      room: "Phòng A.201",
      schedule: "Tiết 4 - 6",
      studentCount: 35,
    },
    {
      id: "GDCT20A",
      className: "Giáo dục chính trị",
      classCode: "KTDN20A",
      room: "Phòng B.105",
      schedule: "Tiết 1 - 3",
      studentCount: 42,
    },
  ];

  //Định nghĩa các cột cho Table
  const columns = [
    {
      key: "className",
      label: "Lớp học phần",
      className: "w-1/3",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{item.className}</span>
          <span className="text-xs text-slate-400">{item.classCode}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Phòng / Tiết",
      render: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-slate-600">
            <DoorOpen size={14} className="mr-1.5 text-blue-500" />
            {item.room}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock size={14} className="mr-1.5 text-orange-500" />
            {item.schedule}
          </div>
        </div>
      ),
    },
    {
      key: "students",
      label: "Sĩ số",
      render: (item: any) => (
        <div className="flex items-center font-medium text-slate-700">
          <Users size={16} className="mr-2 text-slate-400" />
          {item.studentCount} học sinh
        </div>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      className: "text-right",
      render: (item: any) => (
        <div className="flex justify-end">
          <ButtonAction
            label="Chi tiết"
            icon={<Eye size={16} />}
            onClick={() => console.log("Xem chi tiết lớp:", item.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Danh sách lớp giảng dạy"
      sub="Quản lý các lớp học và học phần được phân công trong học kỳ."
      icon={BookOpen}
      renderRight={
        <div className="w-64">
          <SelectOption
            options={semesterOptions}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            icon={<LayoutGrid size={18} />}
            className="bg-white"
          />
        </div>
      }
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <ReusableTable
          data={MOCK_CLASSES}
          columns={columns}
          rowKey="id"
          emptyMessage="Không có lớp học nào trong học kỳ này."
          className="w-full"
          onRowClick={(item) => setClassSelected(item)}
        />
      </div>
      <ChiTietLopHoc
        isOpen={!!classSelected}
        onClose={() => setClassSelected(null)}
        selectedClass={classSelected}
      />
    </PageShell>
  );
};

export default LopHocGiangDay;
