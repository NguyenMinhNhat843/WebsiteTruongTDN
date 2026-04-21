import { Settings, X, Layers, Briefcase, Bell, Save } from "lucide-react";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import Input from "../../../components/ui/Form/Input";
import ButtonAction from "../../../components/ui/ButtonAction";

interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThietLapKhoaModal = ({ isOpen, onClose }: SettingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Thiết lập chung
              </h2>
              <p className="text-[12px] text-slate-500 font-medium uppercase tracking-wider">
                Cấu hình danh mục chuyên môn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Cấu hình hiển thị */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
              <Layers size={14} /> Phân loại mặc định
            </h4>
            <SelectOption
              label="Hệ đào tạo chủ chốt"
              options={[
                {
                  value: "TC",
                  label: "Trung cấp nghề",
                  icon: <Briefcase size={14} />,
                },
                {
                  value: "CD",
                  label: "Cao đẳng liên thông",
                  icon: <Briefcase size={14} />,
                },
                {
                  value: "ST",
                  label: "Sơ cấp / Ngắn hạn",
                  icon: <Briefcase size={14} />,
                },
              ]}
              defaultValue="TC"
            />
          </div>

          {/* Cấu hình mã định danh */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
              <Settings size={14} /> Quy tắc mã khoa
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tiền tố mã (Prefix)"
                placeholder="VD: K-"
                defaultValue="K"
              />
              <Input
                label="Độ dài số tự tăng"
                type="number"
                placeholder="VD: 3"
                defaultValue="2"
              />
            </div>
          </div>

          {/* Thông báo hệ thống */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <Bell className="text-amber-500 shrink-0" size={18} />
            <p className="text-[12px] text-amber-700 leading-relaxed font-medium">
              Các thay đổi tại đây sẽ áp dụng cho việc tạo mới Khoa và cách hiển
              thị báo cáo chuyên môn trên toàn hệ thống.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-[14px] text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <div className="flex-[1.5]">
            <ButtonAction
              label="Lưu cấu hình"
              icon={<Save size={18} />}
              className="w-full py-3 rounded-xl shadow-lg shadow-indigo-100 font-bold text-[14px]"
              onClick={() => {
                console.log("Đã lưu thiết lập");
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThietLapKhoaModal;
