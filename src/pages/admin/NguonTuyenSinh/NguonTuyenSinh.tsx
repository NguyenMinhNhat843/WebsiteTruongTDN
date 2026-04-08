import React, { useState, useEffect } from "react";
import type { AdmissionStat } from "./type";
import { mockAdmissionStat } from "./mockData";
import { SYSTEM_LABELS } from "./styleMapEnum";
import Header from "../../../components/ui/HeaderPage";
import { ArrowRight, BarChart3, Plus } from "lucide-react";
import Breadcrumb from "../../../components/ui/Breadcrum";
import { StatCard } from "../../../components/ui/StatCard";
import ProgressBar from "../../../components/ui/ProgressBar";
import { HeDaoTaoBadge } from "../../../components/ui/HeDaoTaoBadge";

const AdmissionStatsUI: React.FC = () => {
  const [stats, setStats] = useState<AdmissionStat>(mockAdmissionStat);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  // Simulate loading state on init
  useEffect(() => {
    const timer = setTimeout(() => {
      // In real app: fetch from BE here
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // Simulate BE call
    console.log("Ghi chú mới:", newNote);
    setNewNote("");
    setIsFormOpen(false);
  };

  const navigateToSourceDetail = (sourceId: string) => {
    // Simulate navigation — in real app: useNavigate(`/stats/source/${sourceId}`)
    console.log("Navigate to source detail:", sourceId);
  };

  const navigateToProgramDetail = (programName: string) => {
    // Simulate navigation
    console.log("Navigate to program detail:", programName);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Header
        icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
        title="Thống kê nguồn tuyển sinh"
        sub={
          <p>
            Cập nhật đến ngày <span className="font-medium">08/04/2026</span> •
            Tổng số thí sinh đã đăng ký:{" "}
            <span className="font-semibold text-blue-600">
              {stats.total.toLocaleString()}
            </span>
          </p>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            l: "Nguồn chính",
            v: stats.bySource[0]?.name || "-",
            c: "#6366f1",
            s: stats.bySource[0]
              ? `${stats.bySource[0].count.toLocaleString()} (${stats.bySource[0].percentage.toFixed(1)}%)`
              : "Chưa có dữ liệu",
          },
          {
            l: "Hệ đào tạo đông nhất",
            v:
              stats.byProgram.length > 0
                ? stats.byProgram.reduce((a, b) => (a.count > b.count ? a : b))
                    .programName
                : "-",
            c: "#2563eb",
            s: `${stats.byProgram.reduce((sum, p) => sum + p.count, 0).toLocaleString()} thí sinh`,
          },
          {
            l: "Tỷ lệ tăng so với kỳ trước",
            v: "+12.4%",
            c: "#10b981",
            s: "So với tháng 03/2026",
          },
        ].map((item, idx) => (
          <StatCard
            key={idx}
            label={item.l}
            value={item.v}
            color={item.c}
            description={item.s}
          />
        ))}
      </div>

      {/* Sources Chart & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        {/* Header của Card */}
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Chi tiết theo nguồn tuyển sinh
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Phân loại dựa trên dữ liệu đăng ký thực tế
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm ghi chú
          </button>
        </div>

        {/* Nội dung danh sách */}
        <div className="p-6">
          <div className="grid gap-6">
            {stats.bySource.map((source) => (
              <div
                key={source.id}
                className="group flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                {/* Icon/Dot với hiệu ứng đổ bóng màu */}
                {/* <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-white"
                  style={{
                    backgroundColor: `${source.color}15`,
                    color: source.color,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: source.color }}
                  ></div>
                </div> */}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <button
                      onClick={() => navigateToSourceDetail(source.id)}
                      className="font-semibold text-slate-800 hover:text-blue-600 transition-colors truncate"
                    >
                      {source.name}
                    </button>
                    <span className="text-sm font-bold text-slate-900">
                      {source.percentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Progress bar được làm lại: Mềm và mịn hơn */}
                  <div className="w-full">
                    <ProgressBar value={78} max={100} />
                  </div>
                </div>

                {/* Mũi tên chỉ dẫn xuất hiện khi hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <ArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header của Card */}
        <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-lg font-semibold text-slate-900">
            Phân phối theo chương trình & hệ đào tạo
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Danh sách thống kê chi tiết theo từng ngành nghề
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100"
                >
                  Chương trình đào tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100"
                >
                  Hệ đào tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100"
                >
                  Số lượng thí sinh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.byProgram.map((p, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigateToProgramDetail(p.programName)}
                      className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      {p.programName}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm ring-1 ring-inset ${
                        SYSTEM_LABELS[p.system].badgeClass.includes("blue")
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                          : "bg-indigo-50 text-indigo-700 ring-indigo-600/20"
                      }`}
                    >
                      {SYSTEM_LABELS[p.system].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      {p.count.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer giả để tăng độ hoàn thiện */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex justify-end">
          <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
            Xem báo cáo đầy đủ
          </button>
        </div>
      </div>

      {/* Add Note Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thêm ghi chú tuyển sinh
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Nhập ghi chú (VD: Tăng mạnh từ Facebook sau chiến dịch quảng cáo tháng 3...)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    newNote.trim()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionStatsUI;
