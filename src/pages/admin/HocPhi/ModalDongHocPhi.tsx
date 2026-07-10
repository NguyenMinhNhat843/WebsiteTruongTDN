import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  User,
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Bookmark,
  GraduationCap,
} from "lucide-react";
import { $api } from "../../../api/client";
import { toast } from "sonner";

interface ModalDongHocPhiProps {
  isOpen: boolean;
  onClose: () => void;
  periodId: number;
  onSuccess?: () => void;
}

const ModalDongHocPhi: React.FC<ModalDongHocPhiProps> = ({
  isOpen,
  onClose,
  periodId,
  onSuccess,
}) => {
  // --- States quản lý nhập liệu ---
  const [identifier, setIdentifier] = useState(""); // Giá trị realtime trong ô input
  const [submittedId, setSubmittedId] = useState(""); // Giá trị chỉ lưu khi nhấn Submit tìm kiếm

  const [amountPaidThisTime, setAmountPaidThisTime] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [transactionRef, setTransactionRef] = useState("");
  const [staffName, setStaffName] = useState("");

  // Reset dữ liệu khi đóng/mở modal
  useEffect(() => {
    if (!isOpen) {
      setIdentifier("");
      setSubmittedId("");
      setAmountPaidThisTime(0);
      setPaymentMethod("CASH");
      setTransactionRef("");
      setStaffName("");
    }
  }, [isOpen]);

  // 1. Query: Tận dụng hoàn toàn React Query để tra cứu công nợ sinh viên
  // API chỉ được kích hoạt khi modal đang mở VÀ submittedId có giá trị
  const {
    data: invoice,
    isLoading: isSearching,
    error: searchError,
  } = $api.useQuery(
    "get",
    "/fee-invoices/periods/{periodId}/students/{identifier}/debt",
    {
      params: {
        path: {
          periodId: periodId,
          identifier: submittedId,
        },
      },
    },
    {
      enabled: isOpen && !!submittedId,
    },
  );

  // Tự động điền số tiền nộp mặc định khi React Query trả về data hóa đơn mới
  useEffect(() => {
    if (invoice) {
      setAmountPaidThisTime(invoice.remainingAmount ?? 0);
    }
  }, [invoice]);

  // 2. Mutation: Xác nhận cập nhật hóa đơn học phí
  const { mutate: updateInvoice, isPending: isSubmitting } = $api.useMutation(
    "patch",
    "/fee-invoices/{id}",
    {
      onSuccess: () => {
        toast.success(
          "Ghi nhận phiếu thu và cập nhật công nợ sinh viên thành công!",
        );
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Đã xảy ra lỗi khi xác nhận thanh toán.");
      },
    },
  );

  // Thao tác 1: Nhấn Tìm kiếm (Chỉ cập nhật submittedId để kích hoạt useQuery)
  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const searchKey = identifier.trim();
    if (!searchKey) return;
    setSubmittedId(searchKey);
  };

  // Hủy kết quả tìm kiếm hiện tại để tra cứu sinh viên khác
  const handleResetSearch = () => {
    setSubmittedId("");
    setIdentifier("");
    setAmountPaidThisTime(0);
  };

  // Thao tác 2: Xác nhận đóng tiền
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    if (amountPaidThisTime <= 0) {
      toast.error("Số tiền nộp lần này phải lớn hơn 0 đ.");
      return;
    }

    if (amountPaidThisTime > invoice.remainingAmount) {
      toast.error("Số tiền nộp vượt quá số nợ còn lại của sinh viên!");
      return;
    }

    // Tính tổng số tiền đóng lũy kế mới
    const nextPaidAmount = (invoice.paidAmount ?? 0) + amountPaidThisTime;

    updateInvoice({
      params: { path: { id: invoice.id } },
      body: {
        paidAmount: nextPaidAmount,
        paymentMethod: paymentMethod,
        transactionRef: transactionRef.trim() || undefined,
        staffName: staffName.trim() || undefined,
      } as any,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              Thu Học Phí Tại Quầy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* KHU VỰC TÌM KIẾM SINH VIÊN */}
          <form onSubmit={handleSearchStudent} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Nhập mã số sinh viên hoặc số điện thoại
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={!!invoice || isSearching}
                  placeholder="Ví dụ: SV202601 hoặc 0912xxxxxx..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                />
              </div>
              {!invoice && (
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Kiểm tra nợ"
                  )}
                </button>
              )}
              {invoice && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors shrink-0"
                >
                  Thay đổi
                </button>
              )}
            </div>

            {/* Thông báo lỗi tự động từ OpenAPI React Query */}
            {searchError && (
              <div className="flex items-start gap-2 text-xs bg-rose-50 text-rose-600 border border-rose-100 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {(searchError as any)?.message ||
                    "Không tìm thấy hóa đơn học phí."}
                </span>
              </div>
            )}
          </form>

          {/* HIỂN THỊ CÔNG NỢ & TIẾN HÀNH THU TIỀN */}
          {invoice && (
            <form
              onSubmit={handleConfirmPayment}
              className="space-y-5 border-t border-slate-100 pt-4 animate-in fade-in duration-300"
            >
              {/* Box thông tin chi tiết sinh viên */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                <div className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-sm space-y-1.5 flex-1">
                  <p className="font-bold text-slate-800 text-base">
                    {invoice.student?.fullName || "Chưa cập nhật tên"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 truncate">
                      <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Mã số:{" "}
                      <span className="font-mono font-bold text-slate-800">
                        {invoice.student?.studentCode}
                      </span>
                    </p>
                    {invoice.student?.phone && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        SĐT:{" "}
                        <span className="text-slate-800 font-medium">
                          {invoice.student.phone}
                        </span>
                      </p>
                    )}
                    {invoice.student?.batch && (
                      <p className="flex items-center gap-1.5 truncate col-span-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Khóa học:{" "}
                        <span className="text-slate-800 font-semibold">
                          {invoice.student.batch.batchName} (
                          {invoice.student.batch.batchCode})
                        </span>
                      </p>
                    )}
                    {(invoice.student?.major || invoice.student?.class) && (
                      <p className="text-slate-400 text-[11px] col-span-2 pt-0.5 border-t border-slate-200/60 mt-0.5">
                        {invoice.student?.major?.majorName}{" "}
                        {invoice.student?.class?.className &&
                          `| Lớp ${invoice.student.class.className}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bảng dòng tiền */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Tổng học phí
                  </p>
                  <p className="font-bold text-slate-700 text-sm mt-1">
                    {(invoice.totalAmount ?? 0).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Đã đóng lũy kế
                  </p>
                  <p className="font-bold text-emerald-600 text-sm mt-1">
                    {(invoice.paidAmount ?? 0).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                  <p className="text-[10px] text-rose-500 font-bold uppercase">
                    Còn nợ thiếu
                  </p>
                  <p className="font-extrabold text-rose-600 text-sm mt-1 animate-pulse">
                    {(invoice.remainingAmount ?? 0).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>

              {/* Form nhập phiếu thu */}
              <div className="space-y-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Thông tin thu tiền mặt / chuyển khoản
                </p>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Số tiền thu thực tế lượt này (đ){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min={1000}
                      max={invoice.remainingAmount}
                      value={amountPaidThisTime || ""}
                      onChange={(e) =>
                        setAmountPaidThisTime(Number(e.target.value))
                      }
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Hình thức nộp
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="CASH">💵 Tiền mặt tại quầy</option>
                      <option value="BANK_TRANSFER">
                        🏦 Chuyển khoản qua quầy
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Mã đối soát / Số biên lai
                    </label>
                    <input
                      type="text"
                      placeholder="Không bắt buộc"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Tên nhân viên thu ngân
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên người thu tiền..."
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Xác nhận thu tiền
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDongHocPhi;
