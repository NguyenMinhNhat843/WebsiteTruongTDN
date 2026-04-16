import React, { useState, useRef } from "react";
import {
  X,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

interface ImportExcelModalProps {
  onClose: () => void;
}

// Mock config (bạn đã có trong project)
const DIEM_FIELD_CONFIGS = [
  { field: "chuyenCan", label: "Chuyên cần", pct: "10%" },
  { field: "giuaKy", label: "Giữa kỳ", pct: "30%" },
  { field: "cuoiKy", label: "Cuối kỳ", pct: "60%" },
];

export default function ImportExcelModal({ onClose }: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]); // Dữ liệu giả lập sau khi parse excel
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Giả lập đọc file Excel và parse ra JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Giả lập data sau khi parse
      setPreviewData([
        {
          id: 1,
          maSV: "SV001",
          tenSV: "Nguyễn Văn A",
          mon: "Lập trình React",
          chuyenCan: 9,
          giuaKy: 8,
          cuoiKy: 7,
          tong: 7.5,
          status: "Hợp lệ",
        },
        {
          id: 2,
          maSV: "SV002",
          tenSV: "Trần Thị B",
          mon: "Lập trình React",
          chuyenCan: 10,
          giuaKy: 9,
          cuoiKy: 10,
          tong: 9.7,
          status: "Hợp lệ",
        },
        {
          id: 3,
          maSV: "SV003",
          tenSV: "Lê Văn C",
          mon: "Lập trình React",
          chuyenCan: 5,
          giuaKy: 4,
          cuoiKy: 2,
          tong: 3.2,
          status: "Thiếu điểm",
          error: true,
        },
      ]);
    }
  };

  const handleUpload = () => {
    console.log("Calling API to save:", previewData);
    alert("Đã gửi dữ liệu lên máy chủ!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 transition-all">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div
        className={`relative z-10 w-full ${previewData.length > 0 ? "max-w-5xl" : "max-w-xl"} bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                Nhập điểm từ file Excel
              </h3>
              <p className="text-xs text-gray-400">
                Hỗ trợ định dạng .xlsx, .xls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PHẦN HƯỚNG DẪN MỚI THÊM VÀO ĐÂY */}
        <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100/50">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-600">
              <AlertCircle size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-amber-900">
                Hướng dẫn cấu trúc file:
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                File Excel cần có các cột theo thứ tự:{" "}
                <span className="font-bold">Mã SV, Họ tên, Môn học</span> và các
                cột điểm thành phần. Dữ liệu bắt đầu từ dòng thứ 2.
              </p>
              <a
                href="/FileTemplates/Mau_Nhap_Diem_Sinh_Vien.xlsx"
                download="Mau_Nhap_Diem_Sinh_Vien.xlsx"
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-white px-2 py-1 rounded border border-amber-200 shadow-sm transition-all active:scale-95"
              >
                <Download size={12} />
                TẢI FILE EXCEL MẪU (.XLSX)
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50/30">
          {!file ? (
            /* Step 1: Dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-white hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
                accept=".xlsx, .xls"
              />
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                <Upload size={32} />
              </div>
              <p className="font-medium text-gray-600">
                Click để chọn file hoặc kéo thả vào đây
              </p>
              <p className="text-sm text-gray-400 mt-1">Tải file mẫu tại đây</p>
            </div>
          ) : (
            /* Step 2: Preview Table */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">
                    Tệp đang chọn:
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                    {file.name}
                  </span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewData([]);
                    }}
                    className="text-rose-500 hover:underline ml-2 text-xs"
                  >
                    Xóa
                  </button>
                </div>
                <div className="text-xs text-gray-400 italic">
                  * Vui lòng kiểm tra kỹ dữ liệu trước khi bấm xác nhận
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/60 text-gray-500 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3.5 border-b border-gray-100 text-center w-12">
                        STT
                      </th>
                      <th className="px-4 py-3.5 border-b border-gray-100">
                        Sinh viên
                      </th>
                      <th className="px-4 py-3.5 border-b border-gray-100">
                        Môn học
                      </th>
                      {DIEM_FIELD_CONFIGS.map(({ field, label, pct }) => (
                        <th
                          key={field}
                          className="px-4 py-3.5 border-b border-gray-100 text-center"
                        >
                          {label}
                          <br />
                          <span className="text-[9px] normal-case font-normal text-gray-400">
                            ({pct})
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3.5 border-b border-gray-100 text-center font-bold text-blue-600">
                        Tổng kết
                      </th>
                      <th className="px-4 py-3.5 border-b border-gray-100">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`text-sm hover:bg-gray-50/50 transition-colors ${row.error ? "bg-rose-50/30" : ""}`}
                      >
                        <td className="px-4 py-3 text-center text-gray-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {row.tenSV}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono uppercase">
                            {row.maSV}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{row.mon}</td>
                        <td className="px-4 py-3 text-center font-medium">
                          {row.chuyenCan}
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {row.giuaKy}
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {row.cuoiKy}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/20">
                          {row.tong}
                        </td>
                        <td className="px-4 py-3">
                          {row.error ? (
                            <span className="flex items-center gap-1.5 text-rose-500 text-xs font-medium">
                              <AlertCircle size={14} /> {row.status}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                              <CheckCircle2 size={14} /> {row.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={!file || previewData.some((r) => r.error)}
            onClick={handleUpload}
            className={`px-8 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-lg
              ${
                !file || previewData.some((r) => r.error)
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 active:scale-95"
              }
            `}
          >
            Thêm dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
}
