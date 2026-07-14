import { useState, useEffect } from "react";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import moment from "moment";

// Định nghĩa Interface để lưu trữ dữ liệu công nợ sau khi gộp
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
  invoice: any | null; // Dữ liệu trả về từ API FeeInvoiceWithStudentDto
  isLoading: boolean;
  error: boolean;
}

const StudentTuition = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.profile?.id;
  const studentCode = currentUser?.profile?.studentCode;

  // State lưu giữ danh sách học kỳ kèm thông tin công nợ gộp
  const [debtsBySemester, setDebtsBySemester] = useState<SemesterDebtInfo[]>(
    [],
  );
  // State quản lý việc chọn Học kỳ để xem chi tiết lịch sử giao dịch (Payments)
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(null);

  // 1. API: Lấy toàn bộ danh sách học kỳ của học sinh từ quá khứ đến nay
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
    {
      params: {
        query: {
          studentId: studentId!,
        },
      },
    },
    {
      enabled: !!studentId,
    },
  );

  // 2. Tự động khởi tạo cấu trúc dữ liệu và kích hoạt cơ chế fetch song song
  useEffect(() => {
    if (semesters && semesters.length > 0) {
      // Sắp xếp học kỳ theo thứ tự thời gian tăng dần để học sinh dễ theo dõi lộ trình
      const sortedSemesters = [...semesters].sort((a: any, b: any) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.term - b.term;
      });

      const initialData: SemesterDebtInfo[] = sortedSemesters.map((sem) => ({
        semesterId: sem.id,
        semesterName:
          sem.name || `Học kỳ ${sem.term} (${sem.schoolYear || sem.year})`,
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

      // Đặt học kỳ hiện tại (hoặc học kỳ cuối cùng) làm học kỳ active mặc định cho bảng giao dịch
      const currentSem =
        sortedSemesters.find((s: any) => s.isCurrent) ||
        sortedSemesters[sortedSemesters.length - 1];
      if (currentSem) {
        setActiveSemesterId(currentSem.id);
      }

      // Kích hoạt tiến trình lấy đợt đóng tiền và công nợ cho từng học kỳ
      initialData.forEach((item) => {
        fetchDebtForSemester(item.semesterId);
      });
    }
  }, [semesters]);

  // Hàm core thực hiện fetch tuần tự: Semester -> TuitionPeriod -> FeeInvoice
  const fetchDebtForSemester = async (semId: number) => {
    try {
      // Bước A: Tìm TuitionPeriod ứng với SemesterId
      const periodResponse = await $api.useQuery("get", "/tuition-periods", {
        params: {
          query: { semesterId: semId },
        },
      });

      const periods = periodResponse.data;
      const activePeriod = periods && periods.length > 0 ? periods[0] : null;

      console.log("ádasda");

      if (!activePeriod) {
        // Học kỳ này không/chưa có đợt thu học phí nào được tạo
        setDebtsBySemester((prev) =>
          prev.map((item) =>
            item.semesterId === semId
              ? { ...item, isLoading: false, periodId: null }
              : item,
          ),
        );
        return;
      }

      console.log("ádasdaádasdasdadadasdasdas");

      // Bước B: Có periodId -> Gọi API lấy công nợ hóa đơn của học sinh đó
      const invoiceResponse = await $api.useQuery(
        "get",
        `/fee-invoices/periods/{periodId}/students/{identifier}/debt`,
        {
          params: {
            path: {
              periodId: activePeriod.id,
              identifier: studentCode,
            },
          },
        },
      );

      setDebtsBySemester((prev) =>
        prev.map((item) =>
          item.semesterId === semId
            ? {
                ...item,
                periodId: activePeriod.id,
                periodName: activePeriod.name,
                startDate: activePeriod.startDate,
                endDate: activePeriod.endDate,
                invoice: invoiceResponse.data,
                isLoading: false,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error(`Lỗi khi tải công nợ cho học kỳ ID ${semId}:`, err);
      setDebtsBySemester((prev) =>
        prev.map((item) =>
          item.semesterId === semId
            ? { ...item, isLoading: false, error: true }
            : item,
        ),
      );
    }
  };

  // Helper định dạng hiển thị tiền tệ VNĐ
  const formatVND = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper render badge trạng thái đóng tiền
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Đã hoàn thành
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            ● Đóng một phần
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            ● Chưa đóng
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

  // Tìm học kỳ đang được học sinh nhấp chọn để xem lịch sử giao dịch
  const activeSemesterData = debtsBySemester.find(
    (d) => d.semesterId === activeSemesterId,
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header trang */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Cổng Thông Tin Học Phí
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi tổng quan công nợ học phí và tra cứu lịch sử giao dịch thanh
          toán của bạn
        </p>
      </div>

      {/* ================= PHẦN 1: BẢNG TỔNG QUAN CÔNG NỢ QUA CÁC HỌC KỲ ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📊 Tổng hợp công nợ qua các học kỳ
          </h2>
        </div>

        {isLoadingSemesters ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            Đang tải danh sách học kỳ...
          </div>
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
              <tbody className="divide-y divide-gray-150 text-sm">
                {debtsBySemester.map((item) => {
                  if (item.isLoading) {
                    return (
                      <tr key={item.semesterId}>
                        <td
                          colSpan={8}
                          className="p-4 text-center text-gray-400 animate-pulse"
                        >
                          Đang tải dữ liệu học phí {item.semesterName}...
                        </td>
                      </tr>
                    );
                  }

                  if (item.error) {
                    return (
                      <tr key={item.semesterId}>
                        <td
                          colSpan={8}
                          className="p-4 text-center text-red-500"
                        >
                          ⚠️ Lỗi tải dữ liệu học phí cho {item.semesterName}
                        </td>
                      </tr>
                    );
                  }

                  const hasInvoice = !!item.invoice;

                  return (
                    <tr
                      key={item.semesterId}
                      className={`hover:bg-gray-50/30 transition-colors ${
                        activeSemesterId === item.semesterId
                          ? "bg-blue-50/20"
                          : ""
                      }`}
                    >
                      {/* Tên học kỳ */}
                      <td className="p-4 pl-6 font-bold text-gray-800">
                        {item.semesterName}
                      </td>

                      {/* Đợt thu */}
                      <td className="p-4 text-gray-600 font-medium">
                        {item.periodName || (
                          <span className="text-gray-400 italic">
                            Không có đợt thu
                          </span>
                        )}
                      </td>

                      {/* Hạn đóng */}
                      <td className="p-4 text-center text-gray-500 font-medium">
                        {item.endDate
                          ? moment(item.endDate).format("DD/MM/YYYY")
                          : "-"}
                      </td>

                      {/* Tổng tiền */}
                      <td className="p-4 text-right font-bold text-gray-800">
                        {hasInvoice ? formatVND(item.invoice.totalAmount) : "-"}
                      </td>

                      {/* Đã nộp */}
                      <td className="p-4 text-right font-bold text-emerald-600">
                        {hasInvoice ? formatVND(item.invoice.paidAmount) : "-"}
                      </td>

                      {/* Số tiền còn lại */}
                      <td className="p-4 text-right font-black text-rose-600">
                        {hasInvoice
                          ? formatVND(item.invoice.remainingAmount)
                          : "-"}
                      </td>

                      {/* Trạng thái đóng */}
                      <td className="p-4 text-center">
                        {hasInvoice ? (
                          renderStatusBadge(item.invoice.status)
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      {/* Nút xem lịch sử giao dịch */}
                      <td className="p-4 text-center">
                        {hasInvoice && item.invoice.payments?.length > 0 ? (
                          <button
                            onClick={() => setActiveSemesterId(item.semesterId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm border ${
                              activeSemesterId === item.semesterId
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            Xem lịch sử nộp
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Không có giao dịch
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= PHẦN 2: CHI TIẾT CÁC LẦN GIAO DỊCH (PAYMENTS) ================= */}
      {activeSemesterData &&
        activeSemesterData.invoice?.payments?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
            <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-blue-900 flex items-center gap-2">
                  💳 Lịch sử giao dịch chi tiết
                </h2>
                <p className="text-xs text-blue-600 font-medium mt-0.5">
                  Thuộc:{" "}
                  <span className="font-bold">
                    {activeSemesterData.semesterName}
                  </span>
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
                <tbody className="divide-y divide-gray-150 text-sm">
                  {activeSemesterData.invoice.payments.map(
                    (payment: any, index: number, arr: any[]) => {
                      // Đảo ngược index hiển thị (ví dụ: lần nộp đầu tiên là lần 1)
                      const displayOrder = arr.length - index;

                      return (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50/30 transition-colors"
                        >
                          {/* Lần nộp */}
                          <td className="p-4 pl-6 text-center font-bold text-gray-500">
                            #{displayOrder}
                          </td>

                          {/* Ngày nộp */}
                          <td className="p-4 text-gray-600 font-medium">
                            {moment(payment.paymentDate).format(
                              "DD/MM/YYYY HH:mm",
                            )}
                          </td>

                          {/* Số tiền nộp */}
                          <td className="p-4 text-right font-black text-emerald-600">
                            {formatVND(payment.amountPaid)}
                          </td>

                          {/* Phương thức */}
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200 uppercase">
                              {payment.method === "CASH"
                                ? "💵 Tiền mặt"
                                : payment.method === "BANK_TRANSFER"
                                  ? "🏦 Chuyển khoản"
                                  : "💳 Thẻ/VNPAY"}
                            </span>
                          </td>

                          {/* Mã tham chiếu */}
                          <td className="p-4 text-gray-500 font-mono text-xs select-all">
                            {payment.transactionRef || (
                              <span className="text-gray-300 italic">
                                Không có
                              </span>
                            )}
                          </td>

                          {/* Trạng thái giao dịch */}
                          <td className="p-4 text-center">
                            {payment.status === "SUCCESS" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                                Thành công
                              </span>
                            ) : payment.status === "FAILED" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                                Thất bại
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                                Đang xử lý
                              </span>
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
