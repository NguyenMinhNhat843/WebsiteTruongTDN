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
  History,
} from "lucide-react";
import { $api } from "../../../../api/client";
import { toast } from "sonner";
import { useAppContext } from "../../../../AppProvider";

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
  const { currentUser } = useAppContext();

  const [identifier, setIdentifier] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const [amountPaidThisTime, setAmountPaidThisTime] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [transactionRef, setTransactionRef] = useState("");
  const [staffName, setStaffName] = useState("");

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

  const payments = invoice?.payments || [];

  useEffect(() => {
    if (invoice) {
      setAmountPaidThisTime(invoice.remainingAmount ?? 0);
    }
  }, [invoice]);

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

  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const searchKey = identifier.trim();
    if (!searchKey) return;
    setSubmittedId(searchKey);
  };

  const handleResetSearch = () => {
    setSubmittedId("");
    setIdentifier("");
    setAmountPaidThisTime(0);
  };

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

    const nextPaidAmount = (invoice.paidAmount ?? 0) + amountPaidThisTime;
    console.log("fee invoice id: ", invoice.id);

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
      {/* Thay đổi chiều rộng linh hoạt từ max-w-xl (chưa tìm) lên max-w-4xl (đã tìm thấy invoice) */}
      <div
        className={`bg-white rounded-xl shadow-xl border border-slate-200 w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200 transition-all ${invoice ? "max-w-4xl" : "max-w-xl"}`}
      >
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

        <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Ô TÌM KIẾM LUÔN Ở TRÊN CÙNG */}
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
                  Thay đổi sinh viên
                </button>
              )}
            </div>

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

          {/* GIAO DIỆN CHIA 2 CỘT KHI ĐÃ CÓ DỮ LIỆU INVOICE */}
          {invoice && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-slate-100 pt-4 animate-in fade-in duration-300">
              {/* CỘT TRÁI (7/12): THÔNG TIN SINH VIÊN & PHIẾU THU */}
              <div className="md:col-span-7 space-y-5">
                {/* Box sinh viên */}
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
                          Khóa:{" "}
                          <span className="text-slate-800 font-semibold">
                            {invoice.student.batch.batchName}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Khối tiền số */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Tổng học phí
                    </p>
                    <p className="font-bold text-slate-700 text-xs mt-1">
                      {(invoice.totalAmount ?? 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Đã đóng
                    </p>
                    <p className="font-bold text-emerald-600 text-xs mt-1">
                      {(invoice.paidAmount ?? 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                  <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                    <p className="text-[10px] text-rose-500 font-bold uppercase">
                      Còn nợ
                    </p>
                    <p className="font-extrabold text-rose-600 text-xs mt-1">
                      {(invoice.remainingAmount ?? 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>

                {/* Form nộp tiền */}
                <form onSubmit={handleConfirmPayment} className="space-y-4">
                  <div className="space-y-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Thông tin thu thực tế
                    </p>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-600">
                        Số tiền thu lượt này (đ){" "}
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
                            🏦 Chuyển khoản tại quầy
                          </option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Số biên lai / Ref
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
                  </div>

                  {/* Nút hành động góc dưới cụm form trái */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || invoice.remainingAmount === 0}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
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
              </div>

              {/* CỘT PHẢI (5/12): LỊCH SỬ CÁC LẦN NỘP TIỀN (PAYMENTS) */}
              <div className="md:col-span-5 border-l border-slate-100 md:pl-6 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Lịch sử nộp tiền ({payments.length})</span>
                </div>

                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      Chưa có lượt giao dịch nào
                    </div>
                  ) : (
                    payments.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 relative overflow-hidden ${
                          p.status === "SUCCESS"
                            ? "bg-emerald-50/30 border-emerald-100"
                            : p.status === "FAILED"
                              ? "bg-rose-50/30 border-rose-100"
                              : "bg-amber-50/30 border-amber-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-800 text-sm">
                            +{Number(p.amountPaid).toLocaleString("vi-VN")} đ
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                              p.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "FAILED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <div className="text-slate-600 space-y-0.5">
                          <p>
                            ⏱ Ngày nộp:{" "}
                            <span className="font-medium text-slate-700">
                              {new Date(p.paymentDate).toLocaleString("vi-VN")}
                            </span>
                          </p>
                          <p>
                            💳 Hình thức:{" "}
                            <span className="font-semibold text-slate-700">
                              {p.method === "CASH"
                                ? "Tiền mặt"
                                : "Chuyển khoản"}
                            </span>
                          </p>
                          {p.transactionRef && (
                            <p className="truncate">
                              📌 Ref/Biên lai:{" "}
                              <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-700">
                                {p.transactionRef as string}
                              </span>
                            </p>
                          )}
                          {p.createdBy && (
                            <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-100 mt-1">
                              Người thu: {p.createdBy as string}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDongHocPhi;
