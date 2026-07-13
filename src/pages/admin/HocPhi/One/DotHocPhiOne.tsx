import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { $api } from "../../../../api/client";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  BookOpen,
  Layers,
  Edit2,
  Plus,
  CircleDollarSign,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Wallet, // Thêm icon ví tiền cho nút Thu học phí
} from "lucide-react";
import ModalConfigTuition from "../Create/ModalCreateConfigTuition";
import ModalDongHocPhi from "../DongHocPhi/ModalDongHocPhi"; // <-- IMPORT MODAL THU HỌC PHÍ VỪA CODE
import { toast } from "sonner";

const DotHocPhiOne = () => {
  const { id } = useParams<{ id: string }>();
  const periodId = id ? Number(id) : 1;
  const navigate = useNavigate();

  // --- States Quản lý các Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<number | undefined>(
    undefined,
  );

  // State quản lý việc ẩn/hiển Modal Thu học phí tại quầy
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // State theo dõi xem configId nào đang chạy sync ngầm để hiển thị loading xoay vòng riêng biệt
  const [syncingConfigId, setSyncingConfigId] = useState<number | null>(null);

  // 1. API: Lấy chi tiết đợt học phí tổng thể
  const {
    data: dotHocPhi,
    isLoading: isDotLoading,
    refetch: refetchPeriod,
  } = $api.useQuery("get", "/tuition-periods/{id}", {
    params: { path: { id: periodId } },
  });

  // 2. API: Lấy danh sách CÁC CẤU HÌNH HỌC PHÍ ĐÃ TẠO thuộc đợt học phí này
  const {
    data: tuitionConfigs,
    isLoading: isConfigsLoading,
    refetch: refetchConfigs,
  } = $api.useQuery("get", "/tuition-configs", {
    params: {
      query: { periodId: periodId },
    },
  });

  // 3. MUTATION API: Gọi endpoint sinh công nợ thủ công vừa viết ở Backend
  const { mutate: syncInvoices } = $api.useMutation(
    "post",
    "/tuition-configs/{id}/sync-invoices",
    {
      onSuccess: (res: any) => {
        setSyncingConfigId(null);
        toast.success(
          `Đồng bộ công nợ thành công! Đã sinh thêm ${res?.count ?? 0} hóa đơn học phí mới cho sinh viên.`,
        );
      },
      onError: (err: any) => {
        setSyncingConfigId(null);
        toast.error(
          err?.message || "Đã xảy ra lỗi trong quá trình sinh công nợ.",
        );
      },
    },
  );

  // Xử lý khi click nút sinh công nợ thủ công
  const handleSyncInvoices = (configId: number) => {
    if (
      confirm(
        "Hệ thống sẽ rà soát và sinh bù hóa đơn công nợ cho toàn bộ sinh viên thuộc ngành/khóa này. Xác nhận tiếp tục?",
      )
    ) {
      setSyncingConfigId(configId);
      syncInvoices({
        params: { path: { id: configId } },
      });
    }
  };

  // Mở modal ở chế độ CREATE (Không truyền configId)
  const handleOpenCreateModal = () => {
    setSelectedConfigId(undefined);
    setIsModalOpen(true);
  };

  // Mở modal ở chế độ UPDATE (Truyền configId của bản ghi)
  const handleOpenUpdateModal = (configId: number) => {
    setSelectedConfigId(configId);
    setIsModalOpen(true);
  };

  if (isDotLoading || isConfigsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">
          Đang tải dữ liệu hệ thống...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* ==========================================
          0. BREADCRUMB & NÚT QUAY VỀ
         ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-slate-500">
          <Link to="/hoc-phi" className="hover:text-blue-600 transition-colors">
            Đợt học phí
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-[250px] sm:max-w-[400px]">
            {dotHocPhi?.name || `Chi tiết đợt #${periodId}`}
          </span>
        </nav>

        {/* Nút Quay về */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay về
        </button>
      </div>

      {/* ==========================================
          1. THÔNG TIN TỔNG QUAN ĐỢT HỌC PHÍ
         ========================================== */}
      {dotHocPhi && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Học kỳ ID: {dotHocPhi.semesterId}
              </span>
              <h1 className="text-xl font-bold text-slate-800 mt-2">
                {dotHocPhi.name}
              </h1>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {dotHocPhi.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đang mở đóng tiền
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Đã đóng / Khóa
                </span>
              )}

              {/* NÚT MỚI: THU HỌC PHÍ TẠI QUẦY */}
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Wallet className="w-4 h-4" /> Thu học phí tại quầy
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm cấu hình học phí
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Ngày bắt đầu thu
                </p>
                <p className="font-semibold text-slate-700">
                  {new Date(dotHocPhi.startDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Hạn chót nộp học phí
                </p>
                <p className="font-semibold text-slate-700">
                  {new Date(dotHocPhi.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          2. DANH SÁCH CÁC NGÀNH ĐÃ ĐƯỢC CẤU HÌNH
         ========================================== */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">
            Danh sách ngành đã thiết lập định mức phí (
            {tuitionConfigs?.length ?? 0})
          </h2>
        </div>

        {tuitionConfigs && tuitionConfigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tuitionConfigs.map((config: any) => (
              <div
                key={config.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {config.major?.majorCode || "TOÀN TRƯỜNG"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-1">
                    {config.major?.majorName || "Áp dụng tất cả các ngành"}
                  </h3>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tổng học phí:</span>
                      <span className="font-bold text-blue-600 text-sm">
                        {config.totalAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Tối thiểu nhập học:
                      </span>
                      <span className="font-semibold text-slate-700">
                        {config.minRequiredAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-dashed border-slate-100 pt-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Cơ cấu khoản thu:
                    </p>
                    {config.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-[11px] text-slate-500"
                      >
                        <span className="truncate max-w-[180px]">
                          • {item.name}
                        </span>
                        <span className="font-medium text-slate-700">
                          {item.amount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Định mức: Áp cứng
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      disabled={syncingConfigId === config.id}
                      onClick={() => handleSyncInvoices(config.id)}
                      className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 px-2 py-2 rounded-md transition-all border border-emerald-100 disabled:border-slate-200"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${syncingConfigId === config.id ? "animate-spin" : ""}`}
                      />
                      {syncingConfigId === config.id
                        ? "Đang đồng bộ..."
                        : "Sinh công nợ"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenUpdateModal(config.id)}
                      className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-2 rounded-md transition-all border border-blue-100"
                    >
                      <Edit2 className="w-3 h-3" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <CircleDollarSign className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Đợt học phí này chưa được cấu hình tiền
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Vui lòng nhấn nút "Thêm cấu hình học phí" ở phía trên để thiết lập
              định mức tiền thu cho từng ngành học cụ thể.
            </p>
          </div>
        )}
      </div>

      {/* ==========================================
          3. COMPONENT MODAL CẤU HÌNH HỌC PHÍ DÙNG CHUNG
         ========================================== */}
      <ModalConfigTuition
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConfigId(undefined);
        }}
        periodId={periodId}
        tuitionConfigId={selectedConfigId}
        onSuccess={() => {
          refetchConfigs();
        }}
      />

      {/* ==========================================
          4. COMPONENT MODAL THU HỌC PHÍ TẠI QUẦY
         ========================================== */}
      <ModalDongHocPhi
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        periodId={periodId}
        onSuccess={() => {
          // Khi đóng tiền thành công, refetch lại thông tin đợt học phí hoặc danh sách để cập nhật số liệu nếu có
          refetchPeriod();
          refetchConfigs();
        }}
      />
    </div>
  );
};

export default DotHocPhiOne;
