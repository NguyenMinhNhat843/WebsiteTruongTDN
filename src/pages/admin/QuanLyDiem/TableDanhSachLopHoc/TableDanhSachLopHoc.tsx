import { Users, X } from "lucide-react";
import ReusableTable, { type Column } from "../../../../components/ui/Table";
import StatusCotDiem from "../components/StatusCotDiem";
import Pagination from "../../../../components/ui/Pagination";
import {
  DanhSachDiemThiProvider,
  useDanhSachDiemThiContext,
} from "../DanhSachDiemThiProvider";
import TableNhapDiemSinhVien from "../TableDiemSinhVien/TableNhapDiemSinhVien";
import ButtonAction from "../../../../components/ui/ButtonAction";

// Định nghĩa cấu trúc dữ liệu cho một lớp học
export interface ClassGradeSummary {
  id: string;
  className: string;
  teacherName: string;
  subject: string;
  gradeColumns: {
    name: string;
    isApproved: boolean;
    isSubmitted: boolean;
  }[];
}

// Dữ liệu mẫu
const MOCK_CLASSES: ClassGradeSummary[] = [
  {
    id: "L001",
    className: "Kỹ thuật phần mềm 1 - K15",
    teacherName: "Nguyễn Văn A",
    subject: "Lập trình Web nâng cao",
    gradeColumns: [
      { name: "Thường xuyên 1", isApproved: true, isSubmitted: true },
      { name: "Thường xuyên 2", isApproved: true, isSubmitted: true },
      { name: "Giữa kỳ", isApproved: false, isSubmitted: true },
      { name: "Cuối kỳ", isApproved: false, isSubmitted: false },
    ],
  },
  {
    id: "L002",
    className: "An toàn thông tin 2",
    teacherName: "Trần Thị B",
    subject: "Mạng máy tính",
    gradeColumns: [
      { name: "Thường xuyên 1", isApproved: true, isSubmitted: true },
      { name: "Giữa kỳ", isApproved: false, isSubmitted: false },
    ],
  },
];

interface ClassListModuleProps {
  onSelectClass?: (item: ClassGradeSummary) => void;
}

const DanhSachLopHoc: React.FC<ClassListModuleProps> = ({ onSelectClass }) => {
  return (
    <DanhSachDiemThiProvider>
      <Inner onSelectClass={onSelectClass} />
    </DanhSachDiemThiProvider>
  );
};

const Inner = ({ onSelectClass }: ClassListModuleProps) => {
  const { openModalNhapDiemThiOne, setOpenModalNhapDiemThiOne } =
    useDanhSachDiemThiContext();
  const columns: Column<ClassGradeSummary>[] = [
    {
      key: "className",
      label: "Lớp học / Học phần",
      className: "font-medium w-1/4",
      render: (item) => (
        <div>
          <div className="font-bold">{item.className}</div>
          <div className="text-xs text-slate-400 font-normal">{item.id}</div>
        </div>
      ),
    },
    {
      key: "teacherName",
      label: "Giảng viên",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.teacherName}</span>
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full w-fit mt-1 whitespace-nowrap">
            {item.subject}
          </span>
        </div>
      ),
    },
    {
      key: "TK1",
      label: "Thường xuyên 1",
      render: (item) => {
        return (
          <StatusCotDiem
            isApproved={item.gradeColumns[0]?.isApproved}
            isSubmitted={item.gradeColumns[0]?.isSubmitted}
          />
        );
      },
    },
    {
      key: "TX2",
      label: "Thường xuyên 2",
      render: (item) => {
        return (
          <StatusCotDiem
            isApproved={item.gradeColumns[1]?.isApproved}
            isSubmitted={item.gradeColumns[1]?.isSubmitted}
          />
        );
      },
    },
    {
      key: "GK",
      label: "Giữa kỳ",
      render: (item) => {
        return (
          <StatusCotDiem
            isApproved={item.gradeColumns[2]?.isApproved}
            isSubmitted={item.gradeColumns[2]?.isSubmitted}
          />
        );
      },
    },
    {
      key: "CK",
      label: "Cuối kỳ",
      render: (item) => {
        return (
          <StatusCotDiem
            isApproved={item.gradeColumns[3]?.isApproved}
            isSubmitted={item.gradeColumns[3]?.isSubmitted}
          />
        );
      },
    },
    {
      key: "action",
      label: "",
      className: "text-right",
      render: () => (
        <button
          className="text-blue-600 font-semibold hover:underline px-2 whitespace-nowrap cursor-pointer"
          onClick={() => {
            setOpenModalNhapDiemThiOne(true);
          }}
        >
          Chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Danh sách lớp học
        </h3>
        <span className="text-sm text-slate-500">
          Tìm thấy <b>{MOCK_CLASSES.length}</b> lớp
        </span>
      </div>

      <ReusableTable
        data={MOCK_CLASSES}
        columns={columns}
        rowKey="id"
        onRowClick={onSelectClass}
        emptyMessage="Không tìm thấy lớp học nào theo bộ lọc"
      />

      <Pagination
        currentPage={1}
        onPageChange={() => console.log("")}
        pageSize={8}
        totalItems={10}
      />

      {/* Modal Nhập Điểm */}
      {openModalNhapDiemThiOne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ (Overlay) */}
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setOpenModalNhapDiemThiOne(false)} // Click ra ngoài để đóng
          />

          {/* Nội dung Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header của Modal */}
            <div className="flex items-center justify-between p-4 bg-blue-600">
              <h3 className="text-xl font-semibold text-white">
                Nhập điểm sinh viên
              </h3>
              <button
                onClick={() => setOpenModalNhapDiemThiOne(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Body của Modal */}
            <div className="p-6 overflow-y-auto">
              <TableNhapDiemSinhVien />
            </div>

            {/* Footer (Tùy chọn) */}
            <div className="p-4 bg-slate-100 flex justify-end gap-3">
              <ButtonAction
                label="Hủy bỏ"
                onClick={() => setOpenModalNhapDiemThiOne(false)}
              />
              <ButtonAction
                label="Lưu thay đổi"
                className="bg-blue-600 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DanhSachLopHoc;
