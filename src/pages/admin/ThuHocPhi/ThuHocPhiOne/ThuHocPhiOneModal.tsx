import { Calendar, Download, Printer, XCircle } from "lucide-react";
import { formatCurrency } from "../../../../util/format";
import type { Student } from "../type";
import type { FunctionComponent } from "react";
import { StyleMapEnumHeDaoTao } from "../../../../components/StyleMapEnum/StyleMapEnum";

interface ThuHocPhiOneProps {
  selectedStudent: Student;
  onClose?: () => void;
}

const ThuHocPhiOne: FunctionComponent<ThuHocPhiOneProps> = ({
  selectedStudent,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-6 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Chi Tiết Học Phí</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Thông tin học viên */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Thông tin học viên
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Mã SV", value: selectedStudent.id },
                { label: "Họ tên", value: selectedStudent.name },
                { label: "Lớp", value: selectedStudent.class },
                {
                  label: "Hệ",
                  value: StyleMapEnumHeDaoTao[selectedStudent.system].label,
                },
                { label: "SĐT", value: selectedStudent.phone },
                { label: "Email", value: selectedStudent.email },
              ].map((item, index) => (
                <div key={index} className="flex items-baseline pb-1">
                  <span className="text-gray-500 font-medium min-w-16 shrink-0">
                    {item.label}
                  </span>
                  <span className="ml-2 text-gray-900 font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng quan học phí */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Tổng học phí",
                value: selectedStudent.totalFee,
                color: "blue",
                text: "text-gray-900",
              },
              {
                label: "Đã đóng",
                value: selectedStudent.paid,
                color: "green",
                text: "text-green-600",
              },
              {
                label: "Còn lại",
                value: selectedStudent.remaining,
                color: "red",
                text: "text-red-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4 text-center`}
              >
                <div className="text-xs text-gray-600 font-semibold tracking-wide mb-1">
                  {stat.label}
                </div>
                <div className={`text-xl font-bold ${stat.text}`}>
                  {formatCurrency(stat.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Lịch sử thanh toán */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lịch sử thanh toán
            </h3>

            {selectedStudent.paymentHistory.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 ml-2 pl-6 space-y-6">
                {selectedStudent.paymentHistory.map((payment) => (
                  <div key={payment.id} className="relative">
                    {/* Dot trang trí tạo hiệu ứng timeline */}
                    <div className="absolute -left-7.75 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-base">
                            {formatCurrency(payment.amount)}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">
                            {payment.method}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            {payment.receiver}
                          </span>
                          <span>•</span>
                          <span>Mã: {payment.id}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(payment.date).toLocaleDateString("vi-VN")}
                        </div>
                        {payment.note && (
                          <div className="text-xs text-gray-400 italic">
                            "{payment.note}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 font-medium">
                  Chưa có dữ liệu thanh toán
                </p>
              </div>
            )}
          </div>
        </div>
        {/* FOOTER CỐ ĐỊNH: Nằm dưới cùng, không bị cuộn đi */}
        <div className="p-6 border-t border-slate-200 bg-white shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Đóng
            </button>
            <button className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              In biên lai
            </button>
            <button className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThuHocPhiOne;
