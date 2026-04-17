import {
  X,
  Calendar,
  Users,
  GraduationCap,
  ClipboardList,
  Send,
  FileOutput,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import { HE_BADGE } from "../constants";
import { HE_DAO_TAO } from "../mockData";
import DanhSachSinhVienTab from "./DanhSachSinhVienTab";
import TabButton from "../components/TabButton";
import { LopHocOneProvider, useLopHocOneContext } from "./LopHocOneProvider";
import ThongTinLopHocTab from "./ThongTinLopHocTab";

interface DetailModalProps {
  row: any;
  onClose: () => void;
}

const DetailModal = ({ row, onClose }: DetailModalProps) => {
  return (
    <LopHocOneProvider>
      <Inner row={row} onClose={onClose} />
    </LopHocOneProvider>
  );
};

function Inner({ row, onClose }: DetailModalProps) {
  const { activeTab, setActiveTab, onClickUpdate, editMode } =
    useLopHocOneContext();
  if (!row) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh]">
        {/* Header Header */}
        <div className="relative bg-linear-to-r from-blue-600 to-indigo-700 px-8 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <GraduationCap size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-100 text-xs font-mono tracking-wider uppercase">
                  {row.ma}
                </span>
                <Badge
                  className={`${HE_BADGE[row.he]} border-none !bg-white/20 !text-white text-[10px]`}
                >
                  {HE_DAO_TAO[row.he]}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold leading-tight">{row.ten}</h2>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-gray-100 bg-white">
          <TabButton
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
            icon={<ClipboardList size={16} />}
            label="Thông tin chung"
          />
          <TabButton
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
            icon={<Users size={16} />}
            label="Sinh viên"
          />
          <TabButton
            active={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            icon={<Calendar size={16} />}
            label="Lịch học"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {activeTab === "info" && <ThongTinLopHocTab row={row} />}

          {activeTab === "students" && <DanhSachSinhVienTab />}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Gửi thông báo"
            >
              <Send size={18} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              title="Xuất Excel"
            >
              <FileOutput size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onClickUpdate()}
              className={`
                px-6 py-2 text-sm font-medium rounded-xl transition-all duration-300
                ${
                  editMode
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                }
              `}
            >
              {editMode ? "Lưu thay đổi" : "Chỉnh sửa lớp"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
