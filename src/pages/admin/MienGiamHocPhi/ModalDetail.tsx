import { Download, User, XCircle } from "lucide-react";
import type { Exemption } from "./mockType";
import { formatCurrency } from "../../../util/format";
import BadgeStatusExemtion from "../../../components/ui/BadgeStatusExemtion";

interface ModalDetailProps {
  selectedExemption: Exemption | null;
  onClose: () => void;
  setSelectedExemption: (exemption: Exemption | null) => void;
}

const ModalDetail = ({
  selectedExemption,
  onClose,
  setSelectedExemption,
}: ModalDetailProps) => {
  if (!selectedExemption) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER: Cố định */}
        <div className="bg-linear-to-r from-purple-500 to-pink-600 text-white p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Chi Tiết Miễn Giảm</h2>
              <p className="text-sm text-purple-100 opacity-80">
                Mã đơn: {selectedExemption.id}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                setSelectedExemption(null);
              }}
              className="hover:rotate-90 transition-transform"
            >
              <XCircle className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* BODY: Cuộn độc lập */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Thông tin học viên */}
          <section className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
              <User className="w-4 h-4 text-purple-600" /> Thông tin học viên
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ["Mã SV", selectedExemption.studentId],
                ["Họ tên", selectedExemption.studentName],
                ["Lớp", selectedExemption.class],
                ["Hệ", selectedExemption.system],
                ["SĐT", selectedExemption.phone, "col-span-2"],
              ].map(([label, val, span], i) => (
                <div key={i} className={span}>
                  <span className="text-gray-500">{label}:</span>{" "}
                  <span className="font-semibold ml-1">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Thông tin tiền tệ */}
          <section className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Loại miễn giảm:</span>
              <span className="font-bold text-purple-700">
                {selectedExemption.typeLabel}
              </span>
            </div>
            <div className="flex justify-between italic text-gray-500">
              <span>
                Tổng học phí: {formatCurrency(selectedExemption.totalFee)}
              </span>
              <span>Giảm {selectedExemption.percentage}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-purple-200 items-end">
              <span className="font-bold text-gray-900 text-base">
                Số tiền được giảm:
              </span>
              <span className="font-black text-green-600 text-xl">
                {formatCurrency(selectedExemption.amount)}
              </span>
            </div>
          </section>

          {/* Hồ sơ & Lý do */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xs mb-2 uppercase tracking-wider text-gray-500">
                Lý do đăng ký
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed italic border-l-4 border-purple-200 pl-3">
                "{selectedExemption.reason}"
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xs mb-2 uppercase tracking-wider text-gray-500">
                Hồ sơ đính kèm
              </h3>
              <div className="space-y-2">
                {selectedExemption.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate flex-1 mr-2">{doc}</span>
                    <button className="text-blue-600 font-bold shrink-0 flex items-center gap-1 hover:underline">
                      <Download size={14} /> Tải
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PHẦN GHI CHÚ PHÊ DUYỆT (Chỉ hiện khi đang chờ duyệt) */}
          {selectedExemption.status === "pending" && (
            <section className="pt-4 border-t border-gray-100">
              <label className="block font-bold text-xs mb-2 uppercase tracking-wider text-gray-500">
                Ghi chú phê duyệt
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                rows={3}
                placeholder="Nhập nội dung phản hồi hoặc lý do từ chối (nếu có)..."
                // value={reviewNote}
                // onChange={(e) => setReviewNote(e.target.value)}
              />
            </section>
          )}

          {/* Lịch sử/Trạng thái cũ (Nếu đã duyệt/từ chối) */}
          {selectedExemption.status !== "pending" && (
            <section className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between mb-3 font-bold uppercase text-gray-700">
                <span>Trạng thái</span>
                <BadgeStatusExemtion status={selectedExemption.status} />
              </div>
              {selectedExemption.reviewer && (
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <p>
                    Người duyệt:{" "}
                    <b className="text-gray-800">
                      {selectedExemption.reviewer}
                    </b>
                  </p>
                  <p className="text-right">
                    Ngày duyệt:{" "}
                    <b>
                      {new Date(
                        selectedExemption.reviewDate || "",
                      ).toLocaleDateString("vi-VN")}
                    </b>
                  </p>
                  {selectedExemption.reviewNote && (
                    <p className="col-span-2 mt-2 p-2 bg-white rounded border border-blue-100 italic">
                      Ghi chú: {selectedExemption.reviewNote}
                    </p>
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        {/* FOOTER: Cố định */}
        <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50 shrink-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-white transition-all font-semibold"
          >
            Đóng
          </button>
          {selectedExemption.status === "pending" && (
            <button
              onClick={() => {
                // Logic xử lý phê duyệt với reviewNote tại đây
                // handleApprove(selectedExemption.id, reviewNote);
              }}
              className="flex-2 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all font-bold"
            >
              Phê duyệt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;
