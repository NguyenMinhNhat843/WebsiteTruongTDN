import { XCircle } from "lucide-react";
import { formatCurrency } from "../../../util/format";
import type { FunctionComponent } from "react";
import type { Student } from "./type";

interface ModalThuHocPhiProps {
  onClose: () => void;
  selectedStudent?: Student;
}

const ModalThuHocPhi: FunctionComponent<ModalThuHocPhiProps> = ({
  onClose,
  selectedStudent,
}) => {
  if (!selectedStudent) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Thu Học Phí</h2>
            <button
              onClick={() => {
                onClose();
              }}
              className="text-white/80 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-green-100">
            Học viên: {selectedStudent.name}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600">Tổng học phí:</div>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(selectedStudent.totalFee)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Đã đóng:</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(selectedStudent.paid)}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-600">Còn lại:</div>
                <div className="font-bold text-red-600 text-lg">
                  {formatCurrency(selectedStudent.remaining)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền thu <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              // value={paymentAmount}
              // onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Nhập số tiền"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương thức thanh toán
            </label>
            <select
              // value={paymentMethod}
              // onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
              <option value="card">Thẻ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              // value={paymentNote}
              // onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onClose();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              // onClick={handlePayment}
              // disabled={!paymentAmount}
              className="flex-1 px-4 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận thu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalThuHocPhi;
