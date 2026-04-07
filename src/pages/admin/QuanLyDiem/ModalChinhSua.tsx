interface ScoreEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: {
    id: string;
    name: string;
    subject: string;
    scores: {
      attendance: number;
      regular: number;
      midterm: number;
      final: number;
    };
  };
}

import { X, Save, User, BookOpen, AlertCircle, Calculator } from "lucide-react";
import ActionButton from "../../../components/ui/ActionButton";

export default function ModalChinhSua({
  isOpen,
  onClose,
  studentData,
}: ScoreEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Save size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Cập nhật điểm thi
              </h3>
              <p className="text-xs text-slate-500">
                Chỉnh sửa điểm định kỳ cho sinh viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Thông tin chung (Read-only) */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <User size={16} className="text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Sinh viên
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {studentData.name} ({studentData.id})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Môn học
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {studentData.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Form nhập điểm */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 ml-1">
                Chuyên cần
              </label>
              <input
                type="number"
                defaultValue={studentData.scores.attendance}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 ml-1">
                Thường kỳ 1
              </label>
              <input
                type="number"
                defaultValue={studentData.scores.regular}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 ml-1">
                Giữa kỳ (20%)
              </label>
              <input
                type="number"
                defaultValue={studentData.scores.midterm}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 ml-1">
                Cuối kỳ (50%)
              </label>
              <input
                type="number"
                defaultValue={studentData.scores.final}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
              />
            </div>
          </div>

          {/* Ghi chú lý do chỉnh sửa (Bắt buộc cho Audit Log) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-1">
              Lý do chỉnh sửa{" "}
              <AlertCircle size={12} className="text-amber-500" />
            </label>
            <textarea
              placeholder="Nhập lý do thay đổi điểm (ví dụ: Chấm phúc khảo, nhập nhầm...)"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Calculator size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">
              Dự toán tổng kết: <span className="text-sm underline">4.8</span>
            </span>
          </div>

          <div className="flex gap-3">
            <ActionButton label="Hủy bỏ" color="#64748b" onClick={onClose} />
            <ActionButton
              label="Xác nhận lưu"
              primary
              color="#10b981"
              icon={<Save size={16} />}
              onClick={() => alert("Đã lưu thành công!")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
