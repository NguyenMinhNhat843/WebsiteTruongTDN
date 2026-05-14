import React, { useState } from "react";
import {
  X,
  Users,
  BookOpen,
  BadgeDollarSign,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { HocKyDto } from "../../pages/admin/HocKy/HocKyProvider";
import type { TaoCongNoPreviewDto } from "./HocPhiProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hocKys: HocKyDto[]; // Danh sách học kỳ để chọn
  hocPhiXemTruoc: TaoCongNoPreviewDto; // Dữ liệu từ API Preview
  isPendingHocPhiXemTruoc: boolean;
  createSemesterFees: () => void;
  isCreatePending: boolean;
}

export const CreateTuitionModal = ({
  isOpen,
  onClose,
  hocKys,
  hocPhiXemTruoc,
  isPendingHocPhiXemTruoc,
  createSemesterFees,
  isCreatePending,
}: Props) => {
  const [target, setTarget] = useState("all");

  if (!isOpen) return null;

  // Hàm format tiền tệ VNĐ
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Lên học phí học kỳ
            </h3>
            <p className="text-sm text-slate-500">
              Thiết lập và tạo hóa đơn công nợ hàng loạt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Cấu hình đợt thu */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Học kỳ áp dụng
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium">
                {hocKys.map((hk) => (
                  <option key={hk.id} value={hk.id}>
                    {hk.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Đối tượng áp dụng
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
              >
                <option value="all">Toàn trường</option>
                <option value="khóa" disabled>
                  Theo khóa (Chưa hỗ trợ)
                </option>
                <option value="khoa" disabled>
                  Theo khoa (Chưa hỗ trợ)
                </option>
                <option value="lớp" disabled>
                  Theo lớp (Chưa hỗ trợ)
                </option>
              </select>
            </div>
          </div>

          {/* Section Preview - Cực kỳ quan trọng cho Admin */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
              <Info size={18} />
              <h4>Thông số dự kiến (Preview)</h4>
            </div>

            {isPendingHocPhiXemTruoc ? (
              <div className="flex flex-col items-center py-4 space-y-2">
                <Loader2 className="animate-spin text-indigo-600" />
                <span className="text-sm text-indigo-600 font-medium">
                  Đang tính toán dữ liệu...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                    <Users size={14} /> Sinh viên
                  </div>
                  <div className="text-2xl font-black text-slate-800">
                    {hocPhiXemTruoc?.totalStudents?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                    <BookOpen size={14} /> Tín chỉ
                  </div>
                  <div className="text-2xl font-black text-slate-800">
                    {hocPhiXemTruoc?.totalCredits?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                    <BadgeDollarSign size={14} /> Tổng công nợ
                  </div>
                  <div className="text-2xl font-black text-indigo-600">
                    {formatVND(hocPhiXemTruoc?.estimatedTotalAmount || 0)}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 italic">
              <AlertCircle size={12} />
              Dữ liệu được tính toán dựa trên mức giá tín chỉ và danh sách học
              phần hiện tại.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => createSemesterFees()}
            disabled={isCreatePending || isPendingHocPhiXemTruoc}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {isCreatePending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {isCreatePending ? "Đang tạo công nợ..." : "Xác nhận tạo công nợ"}
          </button>
        </div>
      </div>
    </div>
  );
};
