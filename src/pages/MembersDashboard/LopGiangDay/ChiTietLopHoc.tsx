import { useState } from "react";
import {
  Users,
  FileDown,
  Edit3,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import ReusableTable from "../../../components/ui/Table";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Form/Input";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChiTietLopHocProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: any; // Thay 'any' bằng kiểu dữ liệu thực tế của lớp học
}

const ChiTietLopHoc = ({
  isOpen,
  onClose,
  selectedClass,
}: ChiTietLopHocProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState([
    {
      id: "SV001",
      name: "Nguyễn Văn An",
      tk1: 8,
      tk2: 7,
      gk: 8.5,
      ck: 9,
      note: "",
    },
    {
      id: "SV002",
      name: "Trần Thị Bình",
      tk1: 6,
      tk2: 6.5,
      gk: 7,
      ck: 8,
      note: "Vắng 1 buổi",
    },
  ]);

  // Hàm xử lý thay đổi điểm số khi đang edit
  const handleGradeChange = (
    studentId: string,
    field: string,
    value: string,
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [field]: value } : s)),
    );
  };

  // Tính điểm tổng kết (TK1*0.1 + TK2*0.1 + GK*0.3 + CK*0.5)
  const calculateTotal = (s: any) => {
    const total =
      Number(s.tk1 || 0) * 0.1 +
      Number(s.tk2 || 0) * 0.1 +
      Number(s.gk || 0) * 0.3 +
      Number(s.ck || 0) * 0.5;
    return total.toFixed(1);
  };

  // Định nghĩa các cột cho ReusableTable  54]
  const columns = [
    {
      key: "name",
      label: "Học sinh",
      className: "font-medium", //
      render: (
        item: any, //  59]
      ) => (
        <div className="flex flex-col text-sm whitespace-nowrap">
          <span className="font-bold text-slate-700">{item.name}</span>
          <span className="text-xs text-slate-400">{item.id}</span>
        </div>
      ),
    },
    {
      key: "tk1",
      label: "TK 1",
      render: (item: any) =>
        isEditing ? (
          <Input
            type="number"
            value={item.tk1}
            onChange={(e) => handleGradeChange(item.id, "tk1", e.target.value)}
            containerClassName="w-20" //
          />
        ) : (
          <span className="text-sm">{item.tk1}</span>
        ),
    },
    {
      key: "tk2",
      label: "TK 2",
      render: (item: any) =>
        isEditing ? (
          <Input
            type="number"
            value={item.tk2}
            onChange={(e) => handleGradeChange(item.id, "tk2", e.target.value)}
            containerClassName="w-20"
          />
        ) : (
          <span className="text-sm">{item.tk2}</span>
        ),
    },
    {
      key: "gk",
      label: "Giữa kỳ",
      render: (item: any) =>
        isEditing ? (
          <Input
            type="number"
            value={item.gk}
            onChange={(e) => handleGradeChange(item.id, "gk", e.target.value)}
            containerClassName="w-20 font-semibold"
          />
        ) : (
          <span className="text-sm font-semibold">{item.gk}</span>
        ),
    },
    {
      key: "ck",
      label: "Cuối kỳ",
      render: (item: any) =>
        isEditing ? (
          <Input
            type="number"
            value={item.ck}
            onChange={(e) => handleGradeChange(item.id, "ck", e.target.value)}
            containerClassName="w-20 font-semibold"
          />
        ) : (
          <span className="text-sm font-semibold">{item.ck}</span>
        ),
    },
    {
      key: "total",
      label: "Tổng kết",
      //   className: "bg-slate-50",
      render: (item: any) => (
        <span className="font-bold text-blue-600">{calculateTotal(item)}</span>
      ),
    },
    {
      key: "note",
      label: "Ghi chú",
      render: (item: any) =>
        isEditing ? (
          <Input
            type="text"
            value={item.note}
            onChange={(e) => handleGradeChange(item.id, "note", e.target.value)}
            containerClassName="w-full min-w-[120px]"
          />
        ) : (
          <span className="text-xs text-slate-500 italic">{item.note}</span>
        ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedClass?.className || "Chi tiết lớp học"}
      subTitle={`Mã lớp: ${selectedClass?.id || "Đang tải..."}`}
      icon={GraduationCap}
      maxWidth="5xl"
      footer={
        <div className="flex justify-end gap-3 w-full border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Nhóm Action Buttons phía trên bảng */}
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={20} />
            <span className="font-semibold text-sm">
              Danh sách {students.length} học sinh
            </span>
          </div>

          {!isEditing ? (
            <div className="flex gap-2">
              <ButtonAction
                label="Import điểm"
                icon={<FileDown size={18} />}
                withText={true}
                // Màu xanh lá (Emerald) thường dùng cho các tác vụ Import/Export/Excel
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2"
                onClick={() => console.log("Import Excel")}
              />
              <ButtonAction
                label="Chỉnh sửa điểm"
                icon={<Edit3 size={18} />}
                withText={true}
                // Màu xanh dương (Blue) dùng cho tác vụ chỉnh sửa chính
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2"
                onClick={() => setIsEditing(true)}
              />
            </div>
          ) : (
            <ButtonAction
              label="Gửi duyệt điểm"
              icon={<CheckCircle size={18} />}
              withText={true}
              // Màu vàng cam (Amber/Orange) để cảnh báo thao tác quan trọng hoặc trạng thái chờ duyệt
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2"
              onClick={() => {
                setIsEditing(false);
                console.log("Dữ liệu đã lưu:", students);
              }}
            />
          )}
        </div>

        {/* Bảng điểm  */}
        <ReusableTable
          data={students}
          columns={columns}
          rowKey="id"
          emptyMessage="Chưa có dữ liệu học sinh trong lớp này."
        />
      </div>
    </Modal>
  );
};

export default ChiTietLopHoc;
