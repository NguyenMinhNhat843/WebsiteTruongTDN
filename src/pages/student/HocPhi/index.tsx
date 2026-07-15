import { useState, useEffect } from "react";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import moment from "moment";
import { toast } from "sonner";
import {
  Copy,
  Check,
  CreditCard,
  QrCode,
  AlertCircle,
  Info,
  CheckCircle2,
  RotateCw,
  X,
  Wallet,
  Building2,
} from "lucide-react";

// ========================================================
// TYPES
// ========================================================
interface SemesterDebtInfo {
  semesterId: number;
  semesterName: string;
  term: number;
  year: number;
  schoolYear: string | null;
  periodId: number | null;
  periodName: string | null;
  startDate: string | null;
  endDate: string | null;
  invoice: any | null;
  isLoading: boolean;
  error: boolean;
}

type PaymentMethod = "BANK_TRANSFER" | "VNPAY";

// ========================================================
// PAYMENT MODAL
// ========================================================
interface PaymentModalProps {
  item: SemesterDebtInfo;
  onClose: () => void;
  onSuccess: (semesterId: number) => void;
  formatVND: (v: number | null | undefined) => string;
  studentCode: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ item, onClose, onSuccess, formatVND, studentCode }) => {
  const [step, setStep] = useState<"select" | "bank" | "vnpay" | "processing" | "done">("select");
  const [method, setMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [payAmount, setPayAmount] = useState<number>(item.invoice?.remainingAmount || 0);
  const [copied, setCopied] = useState<string | null>(null);
  const [fakeBank, setFakeBank] = useState("");

  // Thông tin chuyển khoản giả lập
  const bankInfo = {
    bankName: "Ngân hàng Quân Đội (MBBank)",
    accountNumber: "0936789012345",
    accountName: "TRUONG THPT TRUNG DUNG NAM",
    content: `HOCPHI ${studentCode} ${item.periodId || ""}`,
  };

  const { mutate: updateInvoice, isPending: isUpdating } = $api.useMutation(
    "patch",
    "/fee-invoices/{id}",
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePay = () => {
    if (!item.invoice?.id) return;
    if (step === "bank") {
      setStep("processing");
      setTimeout(() => {
        submitPayment("BANK_TRANSFER");
      }, 1500);
    } else if (step === "vnpay") {
      if (!fakeBank) {
        toast.error("Vui lòng chọn ngân hàng để tiếp tục thanh toán!");
        return;
      }
      setStep("processing");
      setTimeout(() => {
        submitPayment("VNPAY");
      }, 2000);
    }
  };

  const submitPayment = (payMethod: PaymentMethod) => {
    const newPaidAmount = (item.invoice.paidAmount || 0) + payAmount;
    updateInvoice(
      {
        params: { path: { id: item.invoice.id } },
        body: {
          paidAmount: newPaidAmount,
          paymentMethod: payMethod,
          transactionRef: `PAY_${payMethod}_${studentCode}_${Date.now()}`,
          staffName: "STUDENT_SELF_PAY",
        } as any,
      },
      {
        onSuccess: () => {
          setStep("done");
          onSuccess(item.semesterId);
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi ghi nhận thanh toán. Vui lòng thử lại.");
          setStep(method === "BANK_TRANSFER" ? "bank" : "vnpay");
        },
      }
    );
  };

  const remainingAfterPay = Math.max(0, (item.invoice?.remainingAmount || 0) - payAmount);

  const fakeBanks = [
    { id: "mbbank", name: "MBBank", logo: "🏦" },
    { id: "vcb", name: "Vietcombank", logo: "🔵" },
    { id: "tcb", name: "Techcombank", logo: "🔴" },
    { id: "bidv", name: "BIDV", logo: "🟡" },
    { id: "vib", name: "VIB", logo: "🟣" },
    { id: "acb", name: "ACB", logo: "🟠" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div>
            <h2 className="text-base font-black">Thanh toán học phí</h2>
            <p className="text-blue-100 text-xs mt-0.5 font-medium">{item.periodName || item.semesterName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Nội dung theo Step */}
        <div className="p-6 space-y-5">

          {/* ─── STEP 1: CHỌN PHƯƠNG THỨC ─── */}
          {step === "select" && (
            <>
              {/* Tóm tắt hóa đơn */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng học phí</span>
                  <span className="font-bold text-slate-800">{formatVND(item.invoice?.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Đã đóng</span>
                  <span className="font-bold text-emerald-600">{formatVND(item.invoice?.paidAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-700">Còn phải đóng</span>
                  <span className="font-black text-rose-600 text-base">{formatVND(item.invoice?.remainingAmount)}</span>
                </div>
              </div>

              {/* Nhập số tiền thanh toán lần này */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Số tiền đóng lần này (tối đa: {formatVND(item.invoice?.remainingAmount)})
                </label>
                <input
                  type="number"
                  value={payAmount}
                  min={0}
                  max={item.invoice?.remainingAmount}
                  onChange={(e) => {
                    const v = Math.min(Number(e.target.value), item.invoice?.remainingAmount || 0);
                    setPayAmount(v < 0 ? 0 : v);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-slate-800 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
                <div className="flex gap-2">
                  {[50, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setPayAmount(Math.round((item.invoice?.remainingAmount || 0) * pct / 100))}
                      className="px-3 py-1 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    onClick={() => setPayAmount(item.invoice?.remainingAmount || 0)}
                    className="px-3 py-1 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
                  >
                    Toàn bộ
                  </button>
                </div>
              </div>

              {/* Chọn phương thức */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phương thức thanh toán</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: "BANK_TRANSFER" as PaymentMethod, label: "Chuyển khoản NH", icon: <Building2 size={20} />, color: "blue" },
                    { key: "VNPAY" as PaymentMethod, label: "Cổng VNPay", icon: <CreditCard size={20} />, color: "red" },
                  ] as const).map(({ key, label, icon, color }) => (
                    <button
                      key={key}
                      onClick={() => setMethod(key)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${method === key
                        ? color === "blue"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <span className={`p-2 rounded-lg ${method === key ? (color === "blue" ? "bg-blue-100" : "bg-red-100") : "bg-slate-100"}`}>
                        {icon}
                      </span>
                      <span className="text-xs font-bold leading-tight">{label}</span>
                      {method === key && <CheckCircle2 size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(method === "BANK_TRANSFER" ? "bank" : "vnpay")}
                disabled={payAmount <= 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-md shadow-blue-200 transition-all cursor-pointer"
              >
                Tiếp tục → Xác nhận thanh toán {payAmount > 0 ? formatVND(payAmount) : ""}
              </button>
            </>
          )}

          {/* ─── STEP 2A: CHUYỂN KHOẢN NH ─── */}
          {step === "bank" && (
            <>
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-medium">
                <Info size={15} className="shrink-0" />
                Chuyển khoản đúng nội dung để hệ thống tự động ghi nhận thanh toán.
              </div>

              {/* QR placeholder */}
              <div className="flex justify-center py-2">
                <div className="w-40 h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <QrCode size={36} />
                  <span className="text-[10px] font-bold">QR Thanh toán</span>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-sm">
                {[
                  { label: "Ngân hàng", value: bankInfo.bankName, key: "bank" },
                  { label: "Số tài khoản", value: bankInfo.accountNumber, key: "account" },
                  { label: "Chủ tài khoản", value: bankInfo.accountName, key: "name" },
                  { label: "Số tiền", value: formatVND(payAmount), key: "amount" },
                  { label: "Nội dung CK", value: bankInfo.content, key: "content" },
                ].map(({ label, value, key }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 text-xs shrink-0 font-medium">{label}:</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className={`font-bold text-slate-800 text-xs ${key === "content" ? "text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100" : ""}`}>{value}</span>
                      <button
                        onClick={() => handleCopy(value, key)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer text-slate-400"
                      >
                        {copied === key ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("select")} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer">
                  ← Quay lại
                </button>
                <button onClick={handlePay} className="flex-2 flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-200 transition-all cursor-pointer">
                  ✓ Xác nhận đã chuyển khoản
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 2B: CỔNG VNPAY GIẢ LẬP ─── */}
          {step === "vnpay" && (
            <>
              <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-4 text-white text-center">
                <div className="text-lg font-black">VNPay</div>
                <div className="text-xs text-red-100 mt-0.5">Cổng thanh toán trực tuyến</div>
                <div className="text-xl font-black mt-2">{formatVND(payAmount)}</div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Chọn ngân hàng nội địa</p>
                <div className="grid grid-cols-3 gap-2">
                  {fakeBanks.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setFakeBank(b.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${fakeBank === b.id
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                    >
                      <span className="text-lg">{b.logo}</span>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-medium">
                <AlertCircle size={15} className="shrink-0" />
                Đây là giao diện giả lập. Không cần nhập thông tin thẻ ngân hàng thật.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("select")} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer">
                  ← Quay lại
                </button>
                <button onClick={handlePay} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-200 transition-all cursor-pointer">
                  Xác nhận thanh toán
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 3: ĐANG XỬ LÝ ─── */}
          {step === "processing" && (
            <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <RotateCw size={28} className="text-blue-600 animate-spin" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">Đang xử lý thanh toán...</p>
                <p className="text-xs text-slate-400 mt-1">Vui lòng không đóng cửa sổ này trong quá trình xử lý.</p>
              </div>
            </div>
          )}

          {/* ─── STEP 4: HOÀN THÀNH ─── */}
          {step === "done" && (
            <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center ring-4 ring-emerald-50">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-800">Thanh toán thành công!</p>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Số tiền <span className="text-emerald-600 font-black">{formatVND(payAmount)}</span> đã được ghi nhận.
                </p>
                {remainingAfterPay > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-3 font-medium">
                    Bạn vẫn còn dư nợ <span className="font-black">{formatVND(remainingAfterPay)}</span>. Vui lòng tiếp tục đóng học phí đúng hạn.
                  </p>
                )}
                {remainingAfterPay === 0 && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mt-3 font-medium">
                    🎉 Tuyệt vời! Bạn đã hoàn thành đóng học phí học kỳ này.
                  </p>
                )}
              </div>
              <button onClick={onClose} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer">
                Đóng & Xem lại thông tin
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


// ========================================================
// MAIN PAGE COMPONENT
// ========================================================
const StudentTuition = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.profile?.id;
  const studentCode = currentUser?.profile?.studentCode;

  const [debtsBySemester, setDebtsBySemester] = useState<SemesterDebtInfo[]>([]);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<SemesterDebtInfo | null>(null);

  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
    {
      params: {
        query: { studentId: studentId! },
      },
    },
    { enabled: !!studentId },
  );

  useEffect(() => {
    if (semesters && semesters.length > 0) {
      const sortedSemesters = [...semesters].sort((a: any, b: any) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.term - b.term;
      });

      const initialData: SemesterDebtInfo[] = sortedSemesters.map((sem) => ({
        semesterId: sem.id,
        semesterName: sem.name || `Học kỳ ${sem.term} (${sem.schoolYear || sem.year})`,
        term: sem.term,
        year: sem.year,
        schoolYear: sem.schoolYear || null,
        periodId: null,
        periodName: null,
        startDate: null,
        endDate: null,
        invoice: null,
        isLoading: true,
        error: false,
      }));

      setDebtsBySemester(initialData);

      const currentSem =
        sortedSemesters.find((s: any) => s.isCurrent) ||
        sortedSemesters[sortedSemesters.length - 1];
      if (currentSem) {
        setActiveSemesterId(currentSem.id);
      }

      initialData.forEach((item) => {
        fetchDebtForSemester(item.semesterId);
      });
    }
  }, [semesters]);

  const fetchDebtForSemester = async (semId: number) => {
    try {
      const periodResponse = await fetch(`${import.meta.env.VITE_BASE_URL || ""}/tuition-periods?semesterId=${semId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      const periods = await periodResponse.json();
      const activePeriod = periods && periods.length > 0 ? periods[0] : null;

      if (!activePeriod) {
        setDebtsBySemester((prev) =>
          prev.map((item) =>
            item.semesterId === semId ? { ...item, isLoading: false, periodId: null } : item,
          ),
        );
        return;
      }

      const invoiceResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL || ""}/fee-invoices/periods/${activePeriod.id}/students/${studentCode}/debt`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } },
      );

      if (!invoiceResponse.ok) {
        setDebtsBySemester((prev) =>
          prev.map((item) =>
            item.semesterId === semId
              ? { ...item, isLoading: false, periodId: activePeriod.id, periodName: activePeriod.name, startDate: activePeriod.startDate, endDate: activePeriod.endDate }
              : item,
          ),
        );
        return;
      }

      const invoiceData = await invoiceResponse.json();

      setDebtsBySemester((prev) =>
        prev.map((item) =>
          item.semesterId === semId
            ? {
              ...item,
              periodId: activePeriod.id,
              periodName: activePeriod.name,
              startDate: activePeriod.startDate,
              endDate: activePeriod.endDate,
              invoice: invoiceData,
              isLoading: false,
            }
            : item,
        ),
      );
    } catch {
      setDebtsBySemester((prev) =>
        prev.map((item) =>
          item.semesterId === semId ? { ...item, isLoading: false, error: true } : item,
        ),
      );
    }
  };

  // Sau khi thanh toán thành công, reload data của học kỳ đó
  const handlePaymentSuccess = (semId: number) => {
    toast.success("Thanh toán thành công! Đang cập nhật dữ liệu...");
    setDebtsBySemester((prev) =>
      prev.map((item) =>
        item.semesterId === semId ? { ...item, isLoading: true } : item,
      ),
    );
    setTimeout(() => {
      fetchDebtForSemester(semId);
    }, 1000);
  };

  const formatVND = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={10} /> Đã hoàn thành
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            ⬤ Đóng một phần
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            ⬤ Chưa đóng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
            Không xác định
          </span>
        );
    }
  };

  const activeSemesterData = debtsBySemester.find((d) => d.semesterId === activeSemesterId);

  // Tổng quan tài chính
  const totalDebt = debtsBySemester.reduce((sum, d) => sum + (d.invoice?.remainingAmount || 0), 0);
  const totalPaid = debtsBySemester.reduce((sum, d) => sum + (d.invoice?.paidAmount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Payment Modal */}
      {paymentTarget && (
        <PaymentModal
          item={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSuccess={handlePaymentSuccess}
          formatVND={formatVND}
          studentCode={studentCode || ""}
        />
      )}

      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Cổng Thông Tin Học Phí</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tổng quan công nợ học phí và tra cứu lịch sử giao dịch thanh toán của bạn.
          </p>
        </div>
      </div>

      {/* Tổng quan tài chính nhanh */}
      {debtsBySemester.some((d) => !d.isLoading) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <AlertCircle size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Tổng dư nợ</p>
              <p className="text-xl font-black text-rose-600">{formatVND(totalDebt)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Tổng đã đóng</p>
              <p className="text-xl font-black text-emerald-600">{formatVND(totalPaid)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Số đợt có hóa đơn</p>
              <p className="text-xl font-black text-slate-800">{debtsBySemester.filter((d) => d.invoice).length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bảng tổng quan công nợ */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">📊 Tổng hợp công nợ qua các học kỳ</h2>
        </div>

        {isLoadingSemesters ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Đang tải danh sách học kỳ...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 pl-6">Học kỳ</th>
                  <th className="p-4">Đợt thu học phí</th>
                  <th className="p-4 text-center">Hạn nộp</th>
                  <th className="p-4 text-right">Tổng học phí</th>
                  <th className="p-4 text-right">Đã nộp</th>
                  <th className="p-4 text-right">Còn lại</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {debtsBySemester.map((item) => {
                  if (item.isLoading) {
                    return (
                      <tr key={item.semesterId}>
                        <td colSpan={8} className="p-4 text-center text-gray-400 animate-pulse">
                          Đang tải dữ liệu học phí {item.semesterName}...
                        </td>
                      </tr>
                    );
                  }

                  if (item.error) {
                    return (
                      <tr key={item.semesterId}>
                        <td colSpan={8} className="p-4 text-center text-red-500">
                          ⚠️ Lỗi tải dữ liệu học phí cho {item.semesterName}
                        </td>
                      </tr>
                    );
                  }

                  const hasInvoice = !!item.invoice;
                  const canPay = hasInvoice && item.invoice.remainingAmount > 0;

                  return (
                    <tr
                      key={item.semesterId}
                      className={`hover:bg-gray-50/40 transition-colors ${activeSemesterId === item.semesterId ? "bg-blue-50/20" : ""
                        }`}
                    >
                      <td className="p-4 pl-6 font-bold text-gray-800">{item.semesterName}</td>

                      <td className="p-4 text-gray-600 font-medium">
                        {item.periodName || <span className="text-gray-400 italic">Không có đợt thu</span>}
                      </td>

                      <td className="p-4 text-center text-gray-500 font-medium">
                        {item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "-"}
                      </td>

                      <td className="p-4 text-right font-bold text-gray-800">
                        {hasInvoice ? formatVND(item.invoice.totalAmount) : "-"}
                      </td>

                      <td className="p-4 text-right font-bold text-emerald-600">
                        {hasInvoice ? formatVND(item.invoice.paidAmount) : "-"}
                      </td>

                      <td className="p-4 text-right font-black text-rose-600">
                        {hasInvoice ? formatVND(item.invoice.remainingAmount) : "-"}
                      </td>

                      <td className="p-4 text-center">
                        {hasInvoice ? renderStatusBadge(item.invoice.status) : <span className="text-gray-400 italic">N/A</span>}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {/* Nút thanh toán */}
                          {canPay && (
                            <button
                              onClick={() => setPaymentTarget(item)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <CreditCard size={12} /> Thanh toán
                            </button>
                          )}

                          {/* Không có giao dịch & không thể trả */}
                          {!hasInvoice && !canPay && (
                            <span className="text-xs text-gray-400 italic">Không có</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Phần 2: Chi tiết giao dịch */}
      {activeSemesterData && activeSemesterData.invoice?.payments?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-blue-900 flex items-center gap-2">
                💳 Lịch sử giao dịch chi tiết
              </h2>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                Thuộc: <span className="font-bold">{activeSemesterData.semesterName}</span>
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
              {activeSemesterData.invoice.payments.length} lần giao dịch
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 pl-6 text-center w-[60px]">Lần</th>
                  <th className="p-4">Ngày giao dịch</th>
                  <th className="p-4 text-right">Số tiền đóng</th>
                  <th className="p-4 text-center">Phương thức</th>
                  <th className="p-4">Mã tham chiếu / Đối soát</th>
                  <th className="p-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {activeSemesterData.invoice.payments.map(
                  (payment: any, index: number, arr: any[]) => {
                    const displayOrder = arr.length - index;
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-4 pl-6 text-center font-bold text-gray-500">#{displayOrder}</td>
                        <td className="p-4 text-gray-600 font-medium">
                          {moment(payment.paymentDate).format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="p-4 text-right font-black text-emerald-600">
                          {formatVND(payment.amountPaid)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200 uppercase">
                            {payment.method === "CASH"
                              ? "💵 Tiền mặt"
                              : payment.method === "BANK_TRANSFER"
                                ? "🏦 Chuyển khoản"
                                : "💳 VNPay"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono text-xs select-all">
                          {payment.transactionRef || <span className="text-gray-300 italic">Không có</span>}
                        </td>
                        <td className="p-4 text-center">
                          {payment.status === "SUCCESS" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">Thành công</span>
                          ) : payment.status === "FAILED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">Thất bại</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Đang xử lý</span>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTuition;
