import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { $api } from "../../../../api/client";
import {
  APPLICATION_STATUS_MAP,
  DOCUMENT_STATUS_MAP,
  ADMISSION_TYPE_MAP,
} from "../../../../api/enum";
import type { ApplicationStatusEnum, DocumentStatusEnum } from "../../../../api/enum";

interface Props {
  profileId: number;
  onClose: () => void;
  onRefetch: () => void;
}

export const HoSoDetailModal: React.FC<Props> = ({ profileId, onClose, onRefetch }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [statusReason, setStatusReason] = useState("");

  // 1. Query profile detail
  const { data: profile, isLoading, refetch } = $api.useQuery(
    "get",
    "/admission-profiles/{id}",
    {
      params: { path: { id: profileId } },
    },
    { enabled: !!profileId },
  );

  // 2. Query documents of profile
  const { data: documents, refetch: refetchDocs } = $api.useQuery(
    "get",
    "/admission-documents/profile/{profileId}",
    {
      params: { path: { profileId } },
    },
    { enabled: !!profileId },
  );

  // 3. Mutations
  const { mutate: updateStatus, isPending: isUpdatingStatus } = $api.useMutation(
    "patch",
    "/admission-profiles/{id}/status",
    {
      onSuccess: () => {
        refetch();
        onRefetch();
      },
    },
  );

  const { mutate: verifyDoc, isPending: isVerifyingDoc } = $api.useMutation(
    "patch",
    "/admission-documents/{id}/verify",
    {
      onSuccess: () => {
        refetchDocs();
      },
    },
  );

  const handleStatusChange = (status: ApplicationStatusEnum) => {
    updateStatus({
      params: { path: { id: profileId } },
      body: { status: status as any, reason: statusReason || undefined },
    });
  };

  const handleVerifyDocument = (docId: number, status: DocumentStatusEnum, reason?: string) => {
    verifyDoc({
      params: { path: { id: docId } },
      body: { status: status as any, rejectionReason: reason },
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          <span className="text-xs font-medium text-slate-700">Đang tải chi tiết hồ sơ...</span>
        </div>
      </div>
    );
  }

  const statusConfig = APPLICATION_STATUS_MAP[profile.status as NonNullable<ApplicationStatusEnum>] || {
    label: profile.status,
    colorClass: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-100 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-indigo-600 text-xs">
                {profile.applicationCode}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusConfig.colorClass}`}>
                {statusConfig.label}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-800 mt-1">
              Thí sinh: {profile.fullName}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Quick Action Bar */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-700 block">Duyệt Trạng Thái Hồ Sơ</span>
              <span className="text-slate-500 text-[11px]">
                {profile.status === "ENROLLED"
                  ? "Hồ sơ đã nhập học chính thức. Mã SV đã được khởi tạo."
                  : "Chuyển trạng thái phù hợp theo quy trình xét duyệt."}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.status !== "APPROVED" && profile.status !== "ENROLLED" && (
                <button
                  onClick={() => handleStatusChange("APPROVED" as any)}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Trúng Tuyển (APPROVED)
                </button>
              )}
              {profile.status === "APPROVED" && (
                <button
                  onClick={() => handleStatusChange("CONFIRMED" as any)}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Xác Nhận Nhập Học (CONFIRMED)
                </button>
              )}
              {(profile.status === "CONFIRMED" || profile.status === "APPROVED") && (
                <button
                  onClick={() => handleStatusChange("ENROLLED" as any)}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Nhập Học Chính Thức (ENROLLED)
                </button>
              )}
              {profile.status !== "REJECTED" && (
                <button
                  onClick={() => handleStatusChange("REJECTED" as any)}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors"
                >
                  Từ Chối (REJECTED)
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Thông tin cá nhân & Liên hệ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs text-indigo-600">
                <User className="w-4 h-4" /> Thông tin thí sinh
              </h4>
              <p><span className="text-slate-500">Mã định danh/CCCD:</span> <strong className="text-slate-800">{profile.identityNumber}</strong></p>
              <p><span className="text-slate-500">Ngày sinh:</span> {new Date(profile.dob).toLocaleDateString("vi-VN")}</p>
              <p><span className="text-slate-500">Giới tính:</span> {profile.gender === "MALE" ? "Nam" : profile.gender === "FEMALE" ? "Nữ" : "Khác"}</p>
              <p><span className="text-slate-500">Trình độ tốt nghiệp:</span> {profile.educationLevel}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs text-indigo-600">
                <Phone className="w-4 h-4" /> Liên hệ & Địa chỉ
              </h4>
              <p><span className="text-slate-500">Điện thoại:</span> <strong className="text-slate-800">{profile.phone}</strong></p>
              <p><span className="text-slate-500">Email:</span> {profile.email || "N/A"}</p>
              <p><span className="text-slate-500">Địa chỉ:</span> {profile.addressDetail || "N/A"}</p>
              <p><span className="text-slate-500">Phụ huynh/Giám hộ:</span> {profile.fatherName || profile.motherName || profile.guardianName || "N/A"}</p>
            </div>
          </div>

          {/* Section 2: Phương thức & Kết quả Điểm xét tuyển */}
          <div className="p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs text-indigo-600">
              <Award className="w-4 h-4" /> Kết quả xét tuyển & Điểm số
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-500 block">Phương thức</span>
                <strong className="text-slate-800 text-xs">
                  {ADMISSION_TYPE_MAP[profile.admissionType as NonNullable<keyof typeof ADMISSION_TYPE_MAP>] || profile.admissionType}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-500 block">Điểm ưu tiên</span>
                <strong className="text-slate-800 text-xs">+{profile.priorityScore || 0} điểm</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-500 block">Tuyển thẳng</span>
                <strong className="text-slate-800 text-xs">{profile.isDirectAdmission ? "Có (Tuyển thẳng)" : "Không"}</strong>
              </div>
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <span className="text-[11px] text-indigo-600 font-medium block">Tổng điểm xét tuyển</span>
                <strong className="text-indigo-700 text-sm font-bold">{profile.scoreCalculated ?? profile.totalExamScore ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Giấy tờ số hóa (AdmissionDocuments) */}
          <div className="p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs text-indigo-600">
              <FileText className="w-4 h-4" /> Giấy tờ đính kèm ({documents?.length || 0})
            </h4>

            {documents && documents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {documents.map((doc: any) => {
                  const docStatus = DOCUMENT_STATUS_MAP[doc.status as NonNullable<DocumentStatusEnum>] || {
                    label: doc.status,
                    colorClass: "bg-slate-100 text-slate-600",
                  };
                  return (
                    <div key={doc.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{doc.documentConfigItem?.name || doc.fileName}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${docStatus.colorClass}`}>
                            {docStatus.label}
                          </span>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline mt-0.5"
                        >
                          Xem tệp <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.status !== "APPROVED" && (
                          <button
                            onClick={() => handleVerifyDocument(doc.id, "APPROVED" as any)}
                            disabled={isVerifyingDoc}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-medium border border-emerald-200"
                          >
                            Duyệt
                          </button>
                        )}
                        {doc.status !== "REJECTED" && (
                          <button
                            onClick={() => handleVerifyDocument(doc.id, "REJECTED" as any, "Giấy tờ mờ/không hợp lệ")}
                            disabled={isVerifyingDoc}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-medium border border-rose-200"
                          >
                            Từ chối
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">Thí sinh chưa tải lên giấy tờ nào.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-medium text-xs hover:bg-slate-300">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
