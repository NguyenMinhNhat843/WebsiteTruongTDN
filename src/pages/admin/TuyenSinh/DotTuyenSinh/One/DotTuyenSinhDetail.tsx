import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Layers,
  FileText,
  Info,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  Filter,
  Search,
} from "lucide-react";
import { $api } from "../../../../../api/client";
import { useGetAcademicYears } from "../../../../../hooks/useAcademicYear";

const AdmissionCampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaignId = Number(id);

  // Tab State
  const [activeTab, setActiveTab] = useState<"info" | "applications">("info");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch dữ liệu Đợt tuyển sinh chi tiết
  const { data: campaign, isLoading: isCampaignLoading } = $api.useQuery(
    "get",
    "/admission-campaigns/{id}",
    {
      params: { path: { id: campaignId } },
    },
    { enabled: !!campaignId },
  );

  // Fetch danh sách năm học để map tên nếu API trả về ID
  const { data: academicYears } = useGetAcademicYears();
  const academicYear = academicYears?.data?.find(
    (y) => y.id === campaign?.academicYearId,
  );

  // Render Badge Trạng thái
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đang mở đăng ký
          </span>
        );
      case "PLANNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Đang kế hoạch
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Đã đóng
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            Hoàn thành
          </span>
        );
      default:
        return null;
    }
  };

  if (isCampaignLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 my-6">
        <p className="text-slate-500 text-sm">
          Không tìm thấy thông tin đợt tuyển sinh.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                {campaign.name}
              </h1>
              {renderStatusBadge(campaign.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mã đợt:{" "}
              <span className="font-mono font-medium text-slate-700">
                {campaign.code}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "info"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Info className="w-4 h-4" />
          Thông tin đợt tuyển
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "applications"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          Hồ sơ nộp vào
        </button>
      </div>

      {/* TAB 1: THÔNG TIN ĐỢT TUYỂN */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Trái: Thông tin chung */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Chi tiết thông tin
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Năm học
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {academicYear?.code || "Chưa xác định"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    Ngày bắt đầu
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {campaign.startDate
                      ? campaign.startDate.slice(0, 10)
                      : "N/A"}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    Ngày kết thúc
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {campaign.endDate ? campaign.endDate.slice(0, 10) : "N/A"}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Chỉ tiêu tổng
                </span>
                <div className="text-2xl font-black text-indigo-600">
                  {campaign.targetQuota || 0}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    chỉ tiêu
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Ghi chú / Mô tả
                </span>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[80px]">
                  {campaign.description || "Không có mô tả nào."}
                </p>
              </div>
            </div>
          </div>

          {/* Cột Phải: Danh sách Ngành & Chỉ tiêu */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Phân bổ chỉ tiêu ngành tuyển sinh
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                {campaign.campaignMajors?.length || 0} Ngành
              </span>
            </div>

            {!campaign.campaignMajors ||
            campaign.campaignMajors.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Đợt tuyển sinh này chưa được gán ngành tuyển sinh.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {campaign.campaignMajors.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item?.major?.majorName || `Ngành ID: ${item.majorId}`}
                      </p>
                      {item?.major?.majorCode && (
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Mã: {item?.major?.majorCode}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">
                        Chỉ tiêu
                      </span>
                      <span className="text-sm font-bold text-indigo-600">
                        {item.quota}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HỒ SƠ NỘP VÀO */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {/* Toolbar lọc & Tìm kiếm */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên thí sinh, CMND/CCCD..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                <Filter className="w-3.5 h-3.5" /> Lọc danh sách
              </button>
            </div>
          </div>

          {/* Bảng Danh Sách Hồ Sơ */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Họ và tên</th>
                  <th className="px-4 py-3">Số CCCD / CMND</th>
                  <th className="px-4 py-3">Ngành đăng ký</th>
                  <th className="px-4 py-3">Ngày nộp</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Bạn có thể thay đoạn này bằng API Get Applications theo Campaign ID */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400">1</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Nguyễn Văn An
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">038200012345</td>
                  <td className="px-4 py-3">Công nghệ thông tin</td>
                  <td className="px-4 py-3 text-xs">20/07/2026</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                      Chờ duyệt
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400">2</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Trần Thị Bích
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">038200054321</td>
                  <td className="px-4 py-3">Quản trị kinh doanh</td>
                  <td className="px-4 py-3 text-xs">19/07/2026</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Đã trúng tuyển
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionCampaignDetail;
