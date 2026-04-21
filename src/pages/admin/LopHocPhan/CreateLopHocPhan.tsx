import { useState, useMemo } from "react";
import {
  CheckCircle2,
  DoorOpen,
  PlayCircle,
  PlusCircle,
  Users,
} from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import ReusableTable from "../../../components/ui/Table";

// Giả sử sau khi Admin chọn xong 3 filter ở Bước 1, ta có danh sách lớp hành chính
const MOCK_ADMIN_CLASSES = [
  {
    id: "c1",
    code: "DDD17A",
    major: "Điện dân dụng",
    batch: "K17",
    currentSemester: 3,
  },
  {
    id: "c2",
    code: "DDD17B",
    major: "Điện dân dụng",
    batch: "K17",
    currentSemester: 3,
  },
  {
    id: "c3",
    code: "DDD17C",
    major: "Điện dân dụng",
    batch: "K17",
    currentSemester: 3,
  },
];

// Giả sử chương trình khung của ngành Điện dân dụng cho HK3 có 4 môn
const MOCK_CURRICULUM_SUBJECTS = [
  { id: "m1", name: "An toàn điện", credits: 2, type: "Lý thuyết" },
  {
    id: "m2",
    name: "Lắp đặt mạng điện nội thất",
    credits: 4,
    type: "Thực hành",
  },
  {
    id: "m3",
    name: "Sửa chữa thiết bị gia dụng",
    credits: 3,
    type: "Thực hành",
  },
  { id: "m4", name: "Khởi nghiệp", credits: 2, type: "Lý thuyết" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const CreateCourseModule = () => {
  const [isGenerated, setIsGenerated] = useState(false);

  // Logic sinh 12 lớp học phần (4 môn * 3 lớp)
  const generatedModules = useMemo(() => {
    const modules: any = [];
    MOCK_ADMIN_CLASSES.forEach((adminClass) => {
      MOCK_CURRICULUM_SUBJECTS.forEach((subject) => {
        modules.push({
          id: `${adminClass.code}-${subject.id}`,
          className: adminClass.code,
          subjectName: subject.name,
          credits: subject.credits,
          status: "Chưa mở lớp", // Trạng thái mặc định
          teacher: "Chưa phân công",
          room: "Chưa sắp xếp",
        });
      });
    });
    return modules;
  }, []);

  const columns = [
    { key: "className", label: "Lớp gốc", className: "font-medium" },
    {
      key: "subjectName",
      label: "Tên học phần",
    },
    {
      key: "credits",
      label: "Số tín chỉ/ĐVHT",
      render: (item: any) => `${item.credits} tín chỉ`,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item: any) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs border border-slate-200">
          {item.status}
        </span>
      ),
    },
    { key: "teacher", label: "Giáo viên" },
    { key: "room", label: "Phòng học" },
  ];

  return (
    <div className="space-y-6">
      {/* Bảng hiển thị kết quả sau khi bấm nút sinh lớp */}
      {isGenerated ? (
        <div>
          <div className="pb-4 flex justify-between items-center">
            <h3 className="font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={18} /> Danh sách lớp học phần dự thảo (12 lớp)
            </h3>
            <p className="text-xs text-emerald-600 italic">
              * Các lớp này sẽ cần phân công GV và lịch học ở bước sau
            </p>
          </div>

          <ReusableTable
            data={generatedModules}
            columns={columns}
            rowKey="id"
          />

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <ButtonAction
              label="Hủy bỏ"
              className="bg-slate-200 hover:bg-slate-300 text-slate-700"
              onClick={() => setIsGenerated(false)}
            />
            {/* Nút Phân bổ Giáo viên - Màu xanh Indigo để phân biệt với nút chính */}
            <ButtonAction
              label="Phân bổ giáo viên (12 GV sẵn sàng)"
              icon={<Users size={18} />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              onClick={() => console.log("Mở modal phân bổ GV")}
            />

            {/* Nút Phân bổ Phòng học - Màu tím/Violet */}
            <ButtonAction
              label="Phân bổ phòng học"
              icon={<DoorOpen size={18} />} // Hoặc dùng LayoutIcon
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
              onClick={() => console.log("Mở modal phân bổ phòng")}
            />
            <ButtonAction
              label="Xác nhận lưu vào hệ thống"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              icon={<PlayCircle size={18} />}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center cursor-pointer justify-center py-20 
          px-6 bg-white rounded-2xl border-2 border-dashed border-slate-200
          duration-300 hover:border-blue-400 hover:bg-blue-50/30 group"
          onClick={() => setIsGenerated(true)}
        >
          {/* Icon Container với hiệu ứng Group Hover */}
          <div className="p-5 bg-slate-100 rounded-full mb-6 text-slate-500 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-600">
            <PlusCircle size={48} strokeWidth={1.5} />
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Sẵn sàng khởi tạo lớp học phần
          </h3>

          <p className="text-slate-500 max-w-md text-center mb-8 text-sm leading-relaxed">
            Dựa trên cấu hình đã chọn, hệ thống sẽ tự động nhân bản môn học từ
            chương trình khung cho{" "}
            <span className="font-semibold text-blue-600">
              3 lớp hành chính
            </span>
            . Tổng cộng{" "}
            <span className="font-bold text-slate-800 underline decoration-blue-200 underline-offset-4">
              12 lớp học phần
            </span>{" "}
            sẽ được tạo dự thảo.
          </p>

          {/* Nút bấm chính sử dụng ActionButton của bạn */}
          <div className="relative">
            <ButtonAction
              label="Sinh 12 lớp học phần ngay"
              icon={<PlusCircle size={20} />}
            />

            {/* Hiệu ứng tia sáng nhẹ dưới nút khi hover vào vùng chứa */}
            <div className="absolute -inset-1 bg-blue-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          </div>

          {/* Chú thích nhỏ */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
            <span>Trạng thái: Đợi xác nhận khởi tạo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseModule;
