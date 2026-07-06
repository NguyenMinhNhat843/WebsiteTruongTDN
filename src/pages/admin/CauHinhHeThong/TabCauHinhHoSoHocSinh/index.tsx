import { useState } from "react";
import { $api } from "../../../../api/client";
import CreateModal from "./CreateModal";
import ModalDetail from "./ModalDetail"; // 1. Import ModalDetail
import {
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  Layers,
  GraduationCap,
} from "lucide-react";

const CauHinhHoSoHocSinh = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);

  const { data: documentConfigs, isLoading: isLoadingDocumentConfigs } =
    $api.useQuery("get", "/document-configs");

  const { data: documentConfigDetail, isLoading: isLoadingDetail } =
    $api.useQuery(
      "get",
      "/document-configs/{id}",
      {
        params: {
          path: {
            id: selectedConfigId || 0,
          },
        },
      },
      {
        enabled: !!selectedConfigId && isDetailModalOpen,
      },
    );

  const handleOpenDetail = (id: number) => {
    setSelectedConfigId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedConfigId(null);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen antialiased text-slate-600 selection:bg-indigo-100 selection:text-indigo-950">
      {/* HEADER SECTION */}
      <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Phòng Đào Tạo
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
                <FileText className="w-6 h-6" />
              </span>
              Cấu Hình Hồ Sơ Nhập Học
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl">
              Quản lý và thiết lập danh mục các loại giấy tờ, hồ sơ sinh viên
              bắt buộc phải nộp khi thực hiện thủ tục nhập học tại trường.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-indigo-100 hover:shadow-lg active:scale-[0.98] transition-all duration-200 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Thêm cấu hình mới</span>
          </button>
        </div>
      </div>

      {/* LOADING STATE SKELETON */}
      {isLoadingDocumentConfigs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="animate-pulse border border-slate-200/60 rounded-2xl p-6 bg-white h-48 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-4">
                <div className="h-5 bg-slate-200 rounded-md w-1/5"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded-md w-full"></div>
                  <div className="h-5 bg-slate-200 rounded-md w-2/3"></div>
                </div>
              </div>
              <div className="h-9 bg-slate-100 rounded-xl w-1/2 mt-4"></div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoadingDocumentConfigs &&
        (!documentConfigs || documentConfigs.length === 0) && (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-white max-w-xl mx-auto my-8 p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Layers className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Kho dữ liệu trống
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Chưa có biểu mẫu hay cấu hình hồ sơ nhập học nào phục vụ cho khóa
              học được thiết lập.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 text-sm mt-5 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              Tạo cấu hình đầu tiên ngay
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      {/* CARD LIST SECTION */}
      {!isLoadingDocumentConfigs &&
        documentConfigs &&
        documentConfigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentConfigs.map((config) => (
              <div
                key={config.id}
                onClick={() => handleOpenDetail(config.id)} // 4. Thêm sự kiện onClick vào đây
                className="group border border-slate-200/70 rounded-2xl p-6 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_-8px_rgba(79,70,229,0.1)] hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between min-h-[12rem] relative overflow-hidden cursor-pointer" // Thêm cursor-pointer để tăng UX
              >
                {/* Dải màu trang trí nhỏ ở góc trên khi hover card */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/40 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100/50 transition-colors duration-300">
                      Mã cấu hình: #{config.id}
                    </span>
                  </div>

                  <h3
                    className="text-base md:text-lg font-bold text-slate-800 group-hover:text-slate-900 line-clamp-2 leading-snug tracking-tight mb-4"
                    title={config.name}
                  >
                    {config.name}
                  </h3>
                </div>

                <div className="border-t border-slate-100/80 pt-4 mt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100/30 transition-colors duration-300">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span>
                      Áp dụng từ:{" "}
                      <span className="font-semibold text-slate-700 group-hover:text-indigo-950 transition-colors">
                        {new Date(config.startDate).toLocaleDateString("vi-VN")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* MODAL CONTAINER - Thêm Modal tạo mới */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 5. Tích hợp ModalDetail vào giao diện */}
      <ModalDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        documentConfigDetail={documentConfigDetail}
      />
    </div>
  );
};

export default CauHinhHoSoHocSinh;
