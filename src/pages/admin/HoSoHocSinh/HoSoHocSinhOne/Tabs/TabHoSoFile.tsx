import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Download,
  FileText,
  UploadCloud,
  X,
  Plus,
  Loader2,
  Check,
} from "lucide-react";
import { useHoSoHocSinhOneContext } from "../HoSoHocSinhOneProvider";
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

// --- HÀM HỖ TRỢ NÉN ẢNH GIỮ ĐỘ NÉT CAO ---
const compressImage = (
  file: File,
  maxWidth = 1600,
  quality = 0.88,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Nếu không phải định dạng ảnh, bỏ qua không nén
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Tính toán tỷ lệ giảm kích thước nếu chiều rộng lớn hơn giới hạn tối đa
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Không thể khởi tạo Canvas Context"));

        // Sử dụng thuật toán rendering mượt mà của Canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Vẽ ảnh lên canvas theo kích thước mới
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất canvas thành file Blob chất lượng cao (mặc định xuất về JPEG để tối ưu dung lượng)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Lỗi nén tệp tin ảnh"));

            // Tạo lại đối tượng File từ Blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".jpg"),
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              },
            );
            resolve(compressedFile);
          },
          "image/jpeg",
          quality, // 0.88 là điểm ngọt (sweet spot) giữ được độ sắc nét của văn bản/chữ và giảm dung lượng rất tốt
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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

  // State quản lý file tạm thời đã được nén và link preview
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Giải phóng bộ nhớ vùng preview URL khi đóng modal hoặc đổi file
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset file tạm thời khi đóng mở modal hoặc chuyển danh mục tài liệu khác
  useEffect(() => {
    setTempFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [isModalOpen, selectedDoc]);

  // Xử lý nén ảnh và hiển thị preview
  const processSelectedFile = async (file: File) => {
    try {
      setIsCompressing(true);

      // Tiến hành nén nếu là ảnh (giữ chiều rộng tối đa 1600px để văn bản/chữ rõ nét)
      const optimizedFile = await compressImage(file, 1600, 0.88);

      setTempFile(optimizedFile);

      if (optimizedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(optimizedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Lỗi xử lý file:", error);
      toast.error("Không thể xử lý tệp tin này, vui lòng thử lại.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Event handler chọn từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCreatingStudentDocument || isCompressing) return;
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Event handler kéo thả file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isCreatingStudentDocument || isCompressing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Gọi API lưu file khi người dùng nhấn xác nhận (Ok)
  const handleConfirmUpload = async () => {
    if (!tempFile || !selectedDoc || isCreatingStudentDocument || isCompressing)
      return;

    const formData = new FormData();
    formData.append("studentId", String(studentDetail?.id));
    formData.append(
      "documentConfigItemId",
      String(selectedDoc.documentConfigItemId),
    );
    formData.append("file", tempFile);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    createStudentDocument(
      {
        body: formData as any,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setTempFile(null);
          toast.success("Tải hồ sơ lên thành công!");
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi tải tệp lên. Vui lòng thử lại.");
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-350 mx-auto">
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
                  !isCreatingStudentDocument &&
                  !isCompressing &&
                  setSelectedDoc(item)
                }
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isCreatingStudentDocument || isCompressing
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
                    disabled={isCreatingStudentDocument || isCompressing}
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
            {/* Overlay chặn toàn bộ modal khi đang gọi API Upload */}
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
                disabled={isCreatingStudentDocument || isCompressing}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vùng hiển thị file hiện tại từ Server */}
            {selectedDoc.data && selectedDoc.data.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                  Các tệp tin đang lưu trữ ({selectedDoc.data.length})
                </span>

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

            {/* Khu vực Chọn tệp & Hiển thị ảnh Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                {tempFile
                  ? "Tệp chuẩn bị tải lên (Đã tối ưu)"
                  : selectedDoc.isUploaded
                    ? "Chọn tệp tin mới để thay thế"
                    : "Tải lên tệp tin"}
              </span>

              {/* Giao diện Loading lúc Canvas đang nén ảnh */}
              {isCompressing ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                  <p className="text-sm font-medium text-slate-600">
                    Đang tối ưu dung lượng và xử lý độ nét...
                  </p>
                </div>
              ) : tempFile ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative flex flex-col items-center gap-3">
                  <button
                    type="button"
                    disabled={isCreatingStudentDocument}
                    onClick={() => {
                      setTempFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-full transition-colors shadow-sm disabled:opacity-50"
                    title="Bỏ chọn file này"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {previewUrl ? (
                    <div className="w-full max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview tài liệu"
                        className="max-w-full max-h-48 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 w-full bg-white border border-slate-100 rounded-xl shadow-sm">
                      <FileText className="w-8 h-8 text-amber-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {tempFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(tempFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Vùng Kéo thả / Chọn file ban đầu */
                <div
                  onDragOver={(e) => {
                    if (isCreatingStudentDocument || isCompressing) return;
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() =>
                    !isCreatingStudentDocument &&
                    !isCompressing &&
                    fileInputRef.current?.click()
                  }
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                    isCreatingStudentDocument || isCompressing
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
                    disabled={isCreatingStudentDocument || isCompressing}
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
              )}
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                disabled={isCreatingStudentDocument || isCompressing}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>

              {tempFile && (
                <button
                  disabled={isCreatingStudentDocument || isCompressing}
                  onClick={handleConfirmUpload}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
                >
                  <Check className="w-4 h-4" /> Xác nhận tải lên
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
