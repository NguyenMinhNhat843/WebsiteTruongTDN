import { History, Clock, User } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import { Timeline } from "../../../components/ui/TimeLine";
import clsx from "clsx";

interface ModalLichSuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: {
    id: string;
    className: string;
    classCode: string;
  } | null;
}

const ModalLichSu = ({ isOpen, onClose, selectedClass }: ModalLichSuProps) => {
  // Dữ liệu mẫu lịch sử (thực tế bạn sẽ fetch dựa trên selectedClass.id)
  const historyData = [
    {
      time: "19:00 21/04/2026",
      action: "Gửi yêu cầu phê duyệt điểm cuối kỳ",
      teacher: "Nguyễn Văn A",
      type: "request",
    },
    {
      time: "14:30 20/04/2026",
      action: "Cập nhật điểm thành phần (TK1, TK2)",
      teacher: "Nguyễn Văn A",
      type: "edit",
    },
    {
      time: "09:15 20/04/2026",
      action: "Nhập điểm giữa kỳ từ file Excel",
      teacher: "Nguyễn Văn A",
      type: "import",
    },
  ];

  // Chuyển đổi sang format TimelineItemProps
  const timelineItems = historyData.map((item, index) => ({
    label: (
      <div className="flex items-center gap-2 text-slate-500">
        <Clock size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {item.time.split(" ")[0]} {/* Lấy giờ */}
        </span>
      </div>
    ),
    value: (
      <div className="flex flex-col">
        <span className="text-[13px] text-slate-400 font-medium italic mb-1">
          {item.time.split(" ")[1]} {/* Lấy ngày */}
        </span>
        <span
          className={clsx(
            "font-bold text-sm",
            item.type === "request" ? "text-amber-600" : "text-slate-700",
          )}
        >
          {item.action}
        </span>
      </div>
    ),
    description: (
      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
        <User size={12} />
        <span>Người thực hiện:</span>
        <span className="font-semibold text-slate-700">{item.teacher}</span>
      </div>
    ),
    active: index === 0, // Chỉ mục đầu tiên (mới nhất) sẽ sáng
    isLast: index === historyData.length - 1,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lịch sử thao tác"
      subTitle={
        selectedClass
          ? `Lớp: ${selectedClass.className} (${selectedClass.classCode})`
          : "Nhật ký hệ thống"
      }
      icon={History}
      maxWidth="lg" // Modal lịch sử thường không cần quá rộng
      footer={
        <div className="flex justify-end w-full border-t pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Đóng
          </button>
        </div>
      }
    >
      <div className="py-4 px-2">
        {historyData.length > 0 ? (
          <Timeline items={timelineItems} />
        ) : (
          <div className="text-center py-10 text-slate-400 italic">
            Chưa có lịch sử thao tác cho lớp học này.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalLichSu;
