import React, { useState, useRef } from "react";
import { useCreateContext, type LocalFileItem } from "./CreateProvider";
import {
  FileText,
  UploadCloud,
  Trash2,
  HelpCircle,
  Images,
  Paperclip,
} from "lucide-react";

const DocumentFile = () => {
  const {
    configHoSoNhapHocItems,
    isLoadingConfigHoSoNhapHoc,
    selectedFiles,
    setSelectedFiles,
  } = useCreateContext();

  // State quản lý danh sách nhiều file theo từng đầu mục config
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Xử lý nạp thêm nhiều file/ảnh vào mục tài liệu hiện tại
  const handleFilesSelect = (configItemId: number, files: FileList) => {
    const newItems: LocalFileItem[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      isImage: file.type.startsWith("image/"),
    }));

    setSelectedFiles((prev) => ({
      ...prev,
      [configItemId]: [...(prev[configItemId] || []), ...newItems],
    }));
  };

  // Xóa một file cụ thể trong danh mục mảng
  const handleRemoveFile = (
    configItemId: number,
    fileId: string,
    previewUrl: string,
  ) => {
    URL.revokeObjectURL(previewUrl); // Giải phóng bộ nhớ preview của trình duyệt
    setSelectedFiles((prev) => ({
      ...prev,
      [configItemId]: prev[configItemId].filter((item) => item.id !== fileId),
    }));
  };

  // Tự động kích hoạt mục cấu hình đầu tiên khi tải xong dữ liệu
  React.useEffect(() => {
    if (configHoSoNhapHocItems?.length > 0 && !activeItemId) {
      setActiveItemId(configHoSoNhapHocItems[0].id);
    }
  }, [configHoSoNhapHocItems]);

  if (isLoadingConfigHoSoNhapHoc) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-400 font-medium">
        Đang tải cấu hình danh mục hồ sơ...
      </div>
    );
  }

  const activeItem = configHoSoNhapHocItems?.find(
    (item) => item.id === activeItemId,
  );
  const activeFilesList = activeItemId ? selectedFiles[activeItemId] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-400 mx-auto p-1">
      {/* CỘT BÊN TRÁI: DANH SÁCH CÁC ĐẦU MỤC HỒ SƠ */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
          <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
          <h2 className="text-lg font-bold text-slate-800">
            Danh Mục Tài Liệu Đính Kèm
          </h2>
        </div>

        <div className="space-y-3">
          {configHoSoNhapHocItems?.map((item) => {
            const filesCount = selectedFiles[item.id]?.length || 0;
            const isSelected = activeItemId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/20 shadow-xs"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    {item.required ? "Tài liệu bắt buộc *" : "Tài liệu bổ sung"}
                  </span>
                  <span className="font-semibold text-[15px] text-slate-700">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
                      filesCount > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <Paperclip className="w-3 h-3" />
                    {filesCount > 0
                      ? `Đã chọn ${filesCount} tệp`
                      : "Chưa có tệp"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT BÊN PHẢI: KHU VỰC THAO TÁC VÀ REVIEW NHIỀU FILE TRONG 1 MỤC */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col min-h-[460px]">
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <h3 className="text-[16px] font-bold text-slate-800">
            Xử Lý Tệp Đính Kèm
          </h3>
        </div>

        {activeItem ? (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  Mục tiêu tải lên
                </span>
                <p className="text-[14px] font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeItem.name}
                </p>
              </div>

              {/* Vùng tải file (Luôn hiển thị để người dùng có thể nộp thêm ảnh/file liên tục vào mục này) */}
              <UploadZone
                configItemId={activeItem.id}
                onFilesSelect={handleFilesSelect}
              />

              {/* Danh sách các file/ảnh đang chờ của đầu mục này */}
              {activeFilesList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block flex items-center gap-1">
                    <Images className="w-3.5 h-3.5" /> Danh sách tệp đã chọn (
                    {activeFilesList.length})
                  </span>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {activeFilesList.map((fileItem) => (
                      <div
                        key={fileItem.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl gap-2"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {fileItem.isImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 flex items-center justify-center">
                              <img
                                src={fileItem.previewUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs font-semibold text-slate-700 truncate"
                              title={fileItem.file.name}
                            >
                              {fileItem.file.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {formatFileSize(fileItem.file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFile(
                              activeItem.id,
                              fileItem.id,
                              fileItem.previewUrl,
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <HelpCircle className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium">
              Chọn một mục tài liệu bên trái để bắt đầu tải lên.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: KHU VỰC THAO TÁC KÉO THẢ NHẬN MULTIPLE FILES ---
interface UploadZoneProps {
  configItemId: number;
  onFilesSelect: (id: number, files: FileList) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  configItemId,
  onFilesSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFilesSelect(configItemId, files);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
        isDragging
          ? "border-indigo-500 bg-indigo-50/30"
          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*,application/pdf"
        multiple // Kích hoạt tính năng chọn nhiều ảnh/file cùng một lúc
        onChange={(e) => processFiles(e.target.files)}
      />
      <div className="p-2 bg-white rounded-full shadow-xs border border-slate-100 text-indigo-500">
        <UploadCloud className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-700">
          Kéo thả hoặc{" "}
          <span className="text-indigo-600">bấm để chọn nhiều tệp tin</span>
        </p>
        <p className="text-[10px] text-slate-400">
          Hỗ trợ chọn đồng thời nhiều file Ảnh hoặc PDF
        </p>
      </div>
    </div>
  );
};

export default DocumentFile;
