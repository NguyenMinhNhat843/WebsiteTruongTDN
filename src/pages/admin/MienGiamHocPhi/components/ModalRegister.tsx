import { AlertCircle, FileText, XCircle } from "lucide-react";
import { exemptionTypes } from "../mockData";

interface ModalRegisterProps {
  onClose?: () => void;
}

const ModalRegister = ({ onClose }: ModalRegisterProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER: Cố định */}
        <div className="bg-linear-to-r from-purple-500 to-pink-600 text-white p-6 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Đăng Ký Miễn Giảm Học Phí</h2>
            <button
              onClick={onClose}
              className="hover:rotate-90 transition-transform"
            >
              <XCircle className="w-6 h-6 text-white/80 hover:text-white" />
            </button>
          </div>
        </div>

        {/* BODY: Cuộn độc lập */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          {/* Alert Lưu ý */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-1">Lưu ý khi đăng ký:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs opacity-90">
                <li>Chuẩn bị hồ sơ chứng minh đầy đủ</li>
                <li>Thông tin trung thực, chính xác</li>
                <li>Xét duyệt trong 3-5 ngày làm việc</li>
              </ul>
            </div>
          </div>

          {/* Form Input nhóm theo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Mã học viên", placeholder: "VD: SV001", type: "text" },
              {
                label: "Họ và tên",
                placeholder: "Nhập họ và tên",
                type: "text",
              },
              { label: "Lớp", placeholder: "VD: TCN21A", type: "text" },
              {
                label: "Số điện thoại",
                placeholder: "Nhập số điện thoại",
                type: "tel",
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
            ))}
          </div>

          {/* Loại miễn giảm */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Loại miễn giảm <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all">
              <option value="">Chọn loại miễn giảm</option>
              {exemptionTypes.slice(1).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lý do */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Lý do đăng ký <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Nhập lý do chi tiết..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Hồ sơ đính kèm <span className="text-red-500">*</span>
            </label>
            <div className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
              <p className="text-sm font-medium text-gray-600">
                Kéo thả file hoặc nhấn để chọn
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                PDF, JPG, PNG (Tối đa 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER: Cố định */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          >
            Hủy bỏ
          </button>
          <button className="flex-[2] py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:opacity-90 transition-all">
            Gửi đơn đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegister;
