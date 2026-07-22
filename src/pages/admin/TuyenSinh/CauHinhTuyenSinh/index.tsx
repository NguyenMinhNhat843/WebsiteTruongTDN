import React, { useState } from "react";
import {
  FileCheck,
  Award,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { $api } from "../../../../api/client";
import type {
  DocumentConfigDto,
  PriorityRuleDto,
  AdmissionInterestDto,
} from "../../../../api/entity";

const CauHinhTuyenSinhHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"document" | "priority" | "interest">("document");

  // 1. Query Document Configs
  const { data: docConfigResp, refetch: refetchDoc } = $api.useQuery(
    "get",
    "/document-configs",
    { params: { query: { page: 1, limit: 20 } } },
  );

  // 2. Query Priority Rules
  const { data: priorityResp, refetch: refetchPriority } = $api.useQuery(
    "get",
    "/priority-rules",
    { params: { query: { page: 1, limit: 20 } } },
  );

  // 3. Query Admission Interests
  const { data: interestResp, refetch: refetchInterest } = $api.useQuery(
    "get",
    "/admission-interests",
    { params: { query: { page: 1, limit: 20 } } },
  );

  const { mutate: markNotified } = $api.useMutation("patch", "/admission-interests/{id}/notify", {
    onSuccess: () => refetchInterest(),
  });

  const { mutate: deleteInterest } = $api.useMutation("delete", "/admission-interests/{id}", {
    onSuccess: () => refetchInterest(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">
          Cấu Hình Tuyển Sinh & Tư Vấn Thí Sinh
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thiết lập checklist giấy tờ hồ sơ, quy tắc cộng điểm ưu tiên và quản lý danh sách nhu cầu tư vấn.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab("document")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "document"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileCheck className="w-4 h-4" /> Checklist Giấy Tờ Hồ Sơ
        </button>

        <button
          onClick={() => setActiveTab("priority")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "priority"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Award className="w-4 h-4" /> Quy Tắc Điểm Ưu Tiên
        </button>

        <button
          onClick={() => setActiveTab("interest")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "interest"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Nhu Cầu Đăng Ký Tư Vấn
        </button>
      </div>

      {/* Tab 1: Document Configs */}
      {activeTab === "document" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">
              Danh Sách Checklist Giấy Tờ Đính Kèm ({docConfigResp?.total || 0})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {docConfigResp?.data?.map((config: any) => (
              <div key={config.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-indigo-600">{config.name}</h4>
                  <span className="text-[11px] text-slate-400">ID: {config.id}</span>
                </div>
                <div className="space-y-1">
                  {config.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-slate-600 py-1 border-b border-slate-100 last:border-0">
                      <span>{item.name} ({item.code || "N/A"})</span>
                      {item.required && <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-medium">Bắt buộc</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Priority Rules */}
      {activeTab === "priority" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            Bảng Cấu Hình Điểm Cộng Ưu Tiên ({priorityResp?.total || 0})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px]">
                  <th className="py-3 px-4">Khu Vực</th>
                  <th className="py-3 px-4">Đối Tượng</th>
                  <th className="py-3 px-4">Điểm Cộng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priorityResp?.data?.map((rule: any) => (
                  <tr key={rule.id}>
                    <td className="py-3 px-4 font-semibold text-slate-800">{rule.priorityRegion || "Tất cả khu vực"}</td>
                    <td className="py-3 px-4 text-slate-600">{rule.priorityObject || "Không thuộc đối tượng"}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">+{rule.bonusScore} điểm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admission Interests */}
      {activeTab === "interest" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            Danh Sách Nhu Cầu Tư Vấn Tuyển Sinh ({interestResp?.total || 0})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px]">
                  <th className="py-3 px-4">Họ & Tên</th>
                  <th className="py-3 px-4">Số Điện Thoại</th>
                  <th className="py-3 px-4">Hệ Đào Tạo</th>
                  <th className="py-3 px-4">Trạng Thái Liên Hệ</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interestResp?.data?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.fullName}</td>
                    <td className="py-3 px-4 text-indigo-600 font-mono">{item.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{item.trainingType}</td>
                    <td className="py-3 px-4">
                      {item.notifiedAt ? (
                        <span className="px-2 py-0.5 text-[11px] bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                          Đã liên hệ ({new Date(item.notifiedAt).toLocaleDateString("vi-VN")})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[11px] bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                          Chưa liên hệ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {!item.notifiedAt && (
                        <button
                          onClick={() => markNotified({ params: { path: { id: item.id } } })}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium"
                        >
                          Đánh dấu đã tư vấn
                        </button>
                      )}
                      <button
                        onClick={() => deleteInterest({ params: { path: { id: item.id } } })}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CauHinhTuyenSinhHome;
