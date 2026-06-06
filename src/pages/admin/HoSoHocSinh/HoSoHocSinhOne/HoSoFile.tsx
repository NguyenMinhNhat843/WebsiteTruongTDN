import React, { useState, useRef } from "react";
import {
  Eye,
  Download,
  FileText,
  UploadCloud,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { useHoSoHocSinhOneContext } from "./HoSoHocSinhOneProvider";
import { toast } from "sonner";

interface DocumentFile {
  id: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string | Date;
}

interface StudentDocItem {
  documentConfigItemId: number;
  name: string;
  data: DocumentFile[] | null;
  isUploaded: boolean;
}

interface StudentDocumentsProps {
  documents: StudentDocItem[];
}

export const StudentDocuments: React.FC<StudentDocumentsProps> = ({
  documents,
}) => {
  const { createStudentDocument, isCreatingStudentDocument, studentDetail } =
    useHoSoHocSinhOneContext();
  const [selectedDoc, setSelectedDoc] = useState<StudentDocItem | null>(
    documents[0] || null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi chọn file từ máy tính
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCreatingStudentDocument) return;

    if (e.target.files && e.target.files.length > 0 && selectedDoc) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("studentId", String(studentDetail?.id));
      formData.append(
        "documentConfigItemId",
        String(selectedDoc.documentConfigItemId),
      );
      formData.append("file", file);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      createStudentDocument(
        {
          body: formData as any,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi tải tệp lên. Vui lòng thử lại.");
          },
        },
      );
    }
  };

  // Xử lý kéo thả file (Drag & Drop)
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isCreatingStudentDocument) return;

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      selectedDoc
    ) {
      const file = e.dataTransfer.files[0];
      const formData = new FormData();
      formData.append("studentId", String(studentDetail?.id));
      formData.append(
        "documentConfigItemId",
        String(selectedDoc.documentConfigItemId),
      );
      formData.append("file", file);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      createStudentDocument(
        {
          body: formData as any,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi tải tệp lên. Vui lòng thử lại.");
          },
        },
      );
    }
  };

  return (
    <div className="grid grid-cols-1  gap-6 w-full max-w-350 mx-auto">
      {/* KHỐI BÊN TRÁI: DANH SÁCH DANH MỤC HỒ SƠ */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
          <h2 className="text-lg font-bold text-slate-800">
            Danh Mục Hồ Sơ Nhập Học
          </h2>
        </div>

        <div className="space-y-3">
          {documents.map((item, index) => {
            const isSelected = selectedDoc?.name === item.name;
            return (
              <div
                key={index}
                onClick={() =>
                  !isCreatingStudentDocument && setSelectedDoc(item)
                } // Khóa chọn danh mục khi đang upload
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isCreatingStudentDocument
                    ? "cursor-not-allowed opacity-75"
                    : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    Danh mục tài liệu
                  </span>
                  <span className="font-semibold text-[15px] text-slate-700">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      item.isUploaded
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.isUploaded ? "Đã nộp" : "Chưa nộp"}
                  </span>

                  <button
                    disabled={isCreatingStudentDocument} // Khóa nút xem/thêm khi đang upload
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      item.isUploaded
                        ? "Xem tệp hoặc nộp thêm"
                        : "Tải tài liệu lên"
                    }
                  >
                    {item.isUploaded ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: HỘP THOẠI XỬ LÝ QUẢN LÝ FILE & UPLOAD */}
      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all p-6 space-y-6 relative">
            {/* Overlay chặn toàn bộ modal khi đang loading */}
            {isCreatingStudentDocument && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-slate-600">
                  Đang tải tệp lên, vui lòng đợi...
                </span>
              </div>
            )}

            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {selectedDoc.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quản lý và cập nhật hồ sơ đính kèm
                </p>
              </div>
              <button
                disabled={isCreatingStudentDocument}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vùng hiển thị file hiện tại (Nếu có) */}
            {selectedDoc.data && selectedDoc.data.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                  Các tệp tin đang lưu trữ ({selectedDoc.data.length})
                </span>

                {/* Khung cuộn nếu danh sách file nhiều */}
                <div className="max-h-44 overflow-y-auto custom-scrollbar space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                  {selectedDoc.data.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                        <span
                          className="text-sm text-slate-600 font-medium truncate max-w-50"
                          title={file.fileName}
                        >
                          {file.fileName}
                        </span>
                      </div>

                      <a
                        href={
                          isCreatingStudentDocument ? undefined : file.fileUrl
                        }
                        download={file.fileName}
                        className={`p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm transition-all ${
                          isCreatingStudentDocument
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Khu vực Upload Kéo Thả / Chọn Ảnh mới */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                {selectedDoc.isUploaded
                  ? "Chọn tệp tin mới để thay thế"
                  : "Tải lên tệp tin"}
              </span>

              <div
                onDragOver={(e) => {
                  if (isCreatingStudentDocument) return;
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() =>
                  !isCreatingStudentDocument && fileInputRef.current?.click()
                }
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                  isCreatingStudentDocument
                    ? "border-slate-200 bg-slate-100 cursor-not-allowed"
                    : isDragging
                      ? "border-indigo-500 bg-indigo-50/30 cursor-pointer"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf"
                  disabled={isCreatingStudentDocument}
                />
                <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 border border-slate-100">
                  <UploadCloud className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Kéo thả file vào đây hoặc{" "}
                    <span className="text-indigo-600 hover:text-indigo-700">
                      bấm để duyệt
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Hỗ trợ định dạng Ảnh (JPG, PNG) hoặc tài liệu PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                disabled={isCreatingStudentDocument}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
