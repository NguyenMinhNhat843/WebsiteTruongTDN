import React, { useState, useMemo } from "react";
import {
  Printer,
  X,
  ReceiptText,
  User,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";

// --- Types ---
interface FeeItem {
  id: number;
  name: string;
  amount: number;
  category: string;
}

interface Applicant {
  id: string;
  applicantName: string;
  studentId: string;
  batchLabel: string;
  major: string;
}

// --- Data ---
const FEES_DEFAULT: FeeItem[] = [
  { id: 1, name: "Học phí học kỳ I", amount: 7200000, category: "Học tập" },
  {
    id: 2,
    name: "Bảo hiểm y tế (12 tháng)",
    amount: 924000,
    category: "Bảo hiểm",
  },
  { id: 3, name: "Phí ký túc xá (Kỳ 1)", amount: 1800000, category: "Dịch vụ" },
  {
    id: 4,
    name: "Phí thư viện & Tài liệu",
    amount: 150000,
    category: "Học tập",
  },
  {
    id: 5,
    name: "Phí đồng phục & Thẻ SV",
    amount: 450000,
    category: "Dịch vụ",
  },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + " ₫";

const BienLaiModal = ({
  applicant = {
    id: "2026-001",
    applicantName: "TRƯƠNG TRẦN ĐẠI NGHĨA",
    studentId: "SV20268899",
    batchLabel: "Khóa 2026 - Hệ Trung Cấp",
    major: "Kỹ thuật Phầm mềm (Backend)",
  },
  onClose,
}: {
  applicant?: Applicant;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<number[]>([1, 2]);

  const activeFees = useMemo(
    () => FEES_DEFAULT.filter((f) => selected.includes(f.id)),
    [selected],
  );

  const total = useMemo(
    () => activeFees.reduce((s, f) => s + f.amount, 0),
    [activeFees],
  );

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handlePrint = () => {
    const content = document.getElementById("bien-lai-print-area")?.innerHTML;
    const w = window.open("", "_blank");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>In Biên Lai - ${applicant.applicantName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { size: A5 landscape; margin: 5mm; }
              body { -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="p-8">${content}</div>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ReceiptText className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">
                Quyết toán phí nhập học
              </h2>
              <p className="text-xs text-slate-400">
                Chọn các khoản thu để xuất hóa đơn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* --- Body --- */}
        <div className="grid grid-cols-12 flex-1 overflow-hidden">
          {/* Cột trái: Tuyển chọn */}
          <div className="col-span-5 p-6 overflow-y-auto bg-slate-50/50 custom-scrollbar">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Danh mục thu
            </h3>
            <div className="space-y-3">
              {FEES_DEFAULT.map((fee) => (
                <div
                  key={fee.id}
                  onClick={() => toggle(fee.id)}
                  className={clsx(
                    "group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                    selected.includes(fee.id)
                      ? "bg-white border-cyan-500 shadow-md ring-4 ring-cyan-50"
                      : "bg-white border-slate-100 hover:border-slate-300",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded uppercase">
                        {fee.category}
                      </span>
                      <p className="font-bold text-slate-700 mt-1">
                        {fee.name}
                      </p>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        {fmt(fee.amount)}
                      </p>
                    </div>
                    {selected.includes(fee.id) && (
                      <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Preview (Phong cách hóa đơn giấy) */}
          <div className="col-span-7 p-8 bg-slate-200/50 overflow-y-auto flex justify-center custom-scrollbar">
            <div
              id="bien-lai-print-area"
              className="bg-white w-full max-w-125 h-fit  shadow-lg rounded-sm p-8 text-slate-800 relative border-t-4 border-cyan-600"
            >
              {/* Watermark ẩn khi in hoặc hiện mờ */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-12">
                <ReceiptText size={300} />
              </div>

              {/* Header Invoice */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="font-black text-xl text-cyan-700 tracking-tighter">
                    TRƯỜNG TRUNG CẤP NGHỀ
                  </h1>
                  <p className="text-[10px] text-slate-400 uppercase leading-3">
                    Hệ thống quản lý đào tạo chuyên nghiệp
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p>
                    Mã:{" "}
                    <span className="text-slate-800 font-mono">
                      #{applicant.id}
                    </span>
                  </p>
                  <p>Ngày: {new Date().toLocaleDateString("vi-VN")}</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-lg font-bold uppercase tracking-widest border-y border-slate-100 py-2">
                  Biên lai thu tiền
                </h2>
              </div>

              {/* Info SV */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className="font-bold">{applicant.applicantName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-slate-400" />
                  <span>Khóa: {applicant.batchLabel.split("-")[0]}</span>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm mb-8">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-left text-[11px] uppercase opacity-50">
                    <th className="py-2">Mục thu</th>
                    <th className="py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeFees.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 font-medium text-slate-600">
                        {f.name}
                      </td>
                      <td className="py-3 text-right font-bold">
                        {fmt(f.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="border-t-2 border-slate-800 pt-4 flex justify-between items-end">
                <div className="text-[10px] italic text-slate-400 max-w-[150px]">
                  Bằng chữ: Mười hai triệu tám trăm nghìn đồng chẵn./.
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    Tổng thanh toán
                  </p>
                  <p className="text-2xl font-black text-cyan-700 leading-none">
                    {fmt(total)}
                  </p>
                </div>
              </div>

              {/* Signature Area */}
              <div className="mt-10 grid grid-cols-2 text-center text-[11px]">
                <div>
                  <p className="font-bold">Người nộp tiền</p>
                  <p className="text-slate-400">(Ký, ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="font-bold">Người thu tiền</p>
                  <p className="text-slate-400">(Ký, ghi rõ họ tên)</p>
                  <div className="h-12"></div>
                  <p className="font-bold text-cyan-700 underline">
                    Hệ thống tự động
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer Action --- */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Đã chọn{" "}
            <span className="font-bold text-cyan-600">{selected.length}</span>{" "}
            khoản phí
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Hủy lệnh
            </button>
            <button
              onClick={handlePrint}
              disabled={selected.length === 0}
              className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-slate-200"
            >
              <Printer className="w-4 h-4" /> Xuất biên lai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BienLaiModal;
