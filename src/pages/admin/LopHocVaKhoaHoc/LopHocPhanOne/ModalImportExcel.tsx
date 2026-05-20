import React, { useState, useRef } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTableDiemContext } from "./TableDiemProvider";
import { useLopHocPhanOneContext } from "./LopHocPhanOneProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModalImportExcelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Định nghĩa cấu trúc DTO đầu ra theo yêu cầu của bạn
interface GradeDTO {
  componentId: number;
  score?: number | null | undefined;
  courseRegistrationId: number;
}

const ModalImportExcel: React.FC<ModalImportExcelProps> = ({
  isOpen,
  onClose,
}) => {
  const { tableData, gradesConfig } = useTableDiemContext();
  const [importData, setImportData] = useState<GradeDTO[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submitGrades } = useLopHocPhanOneContext();

  if (!isOpen) return null;

  // --- LOGIC 1: DOWNLOAD FILE MẪU ---
  const handleDownloadTemplate = async () => {
    if (!tableData || tableData.length === 0) {
      alert("Không có dữ liệu học sinh để xuất file mẫu!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bang_Diem_Mau");

    const columns = [
      { header: "Mã Sinh Viên", key: "studentCode", width: 15 },
      { header: "Họ và Tên", key: "fullName", width: 25 },
      { header: "ID Đăng Ký (Không sửa)", key: "regisId", width: 20 },
    ];

    gradesConfig?.forEach((grade) => {
      columns.push({
        header: `${grade.name} (${grade.weight * 100}%)`,
        key: String(grade.id),
        width: 18,
      });
    });

    worksheet.columns = columns;

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    tableData.forEach((student) => {
      const rowData: Record<string, any> = {
        studentCode: student.studentCode,
        fullName: student.fullName,
        regisId: student.regisId,
      };

      gradesConfig?.forEach((grade) => {
        const gradeEntry = student.diem[grade.id];
        rowData[String(grade.id)] =
          gradeEntry?.score !== undefined && gradeEntry?.score !== null
            ? gradeEntry.score
            : "";
      });

      const row = worksheet.addRow(rowData);

      gradesConfig?.forEach((grade) => {
        const cell = row.getCell(String(grade.id));
        const gradeEntry = student.diem[grade.id];

        if (gradeEntry?.status === "APPROVED") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FEF08A" },
          };
        }
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const blob = new Blob([buffer], { type: fileType });
    saveAs(blob, `Mau_Nhap_Diem_LopHocPhan.xlsx`);
  };

  // --- LOGIC 2: ĐỌC VÀ XỬ LÝ FILE EXCEL IMPORT ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const workbook = new ExcelJS.Workbook();

    try {
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1); // Lấy sheet đầu tiên

      if (!worksheet) {
        alert("Không tìm thấy dữ liệu trong file Excel!");
        return;
      }

      const parsedGrades: GradeDTO[] = [];

      // Đọc từ dòng số 2 (bỏ qua dòng Header số 1)
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // Bỏ qua header

        // Lấy thông tin ID Đăng ký dựa theo vị trí cột cố định (Cột 3 là regisId)
        const courseRegistrationId = Number(row.getCell(3).value);
        if (!courseRegistrationId || isNaN(courseRegistrationId)) return;

        // Tìm student tương ứng trong dữ liệu gốc để đối chiếu trạng thái điểm cũ (APPROVED) nếu cần
        const currentStudent = tableData?.find(
          (s) => Number(s.regisId) === courseRegistrationId,
        );

        // Duyệt qua các cột điểm động (bắt đầu từ cột thứ 4 trở đi)
        gradesConfig?.forEach((grade, index) => {
          const colIndex = 4 + index; // Cột 4, 5, 6... tương ứng với từng cấu hình điểm
          const cellValue = row.getCell(colIndex).value;

          // Kiểm tra xem trạng thái cũ của đầu điểm này có đang là APPROVED không
          const oldGradeEntry = currentStudent?.diem[grade.id];

          let score: number | null | undefined = undefined;

          if (
            cellValue !== null &&
            cellValue !== undefined &&
            cellValue !== ""
          ) {
            const parsedScore = Number(cellValue);
            score = isNaN(parsedScore) ? null : parsedScore;
          } else {
            score = null;
          }

          if (oldGradeEntry?.status === "APPROVED") return;

          parsedGrades.push({
            componentId: Number(grade.id),
            score: score,
            courseRegistrationId: courseRegistrationId,
          });
        });
      });

      setImportData(parsedGrades);
    } catch (error) {
      console.error(error);
      alert("Đọc file Excel thất bại, vui lòng kiểm tra lại định dạng file!");
    }
  };

  // --- LOGIC 3: SUBMIT DATA ĐÃ CONVERT ---
  const handleSubmitImport = () => {
    if (importData.length === 0) {
      alert("Không có dữ liệu điểm hợp lệ để cập nhật!");
      return;
    }

    // Đây chính là DTO cuối cùng bạn cần:
    const finalPayload = {
      grades: importData,
    };

    submitGrades(finalPayload);

    alert(
      `Chuẩn bị import ${importData.length} bản ghi điểm thành công! (Xem log ở console)`,
    );
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setImportData([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-50 animate-fadeIn">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Import điểm từ file Excel
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            &times;
          </button>
        </div>

        {/* Body Modal */}
        <div className="my-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Hệ thống sẽ tạo file mẫu chứa thông tin danh sách học sinh hiện tại
            của lớp học phần này.
          </p>

          {/* Link tải file mẫu */}
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Tải File Excel mẫu (Chứa data hiện tại)</span>
            </button>
            <p className="text-xs text-amber-600 mt-2 font-medium leading-relaxed">
              * Lưu ý: Những ô điểm màu vàng là điểm đã duyệt (
              <span className="text-amber-700 font-bold">APPROVED</span>), vui
              lòng chỉ bổ sung/chỉnh sửa điểm ở những ô màu trắng.
            </p>
          </div>

          {/* Khu vực Upload công khai */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              fileName
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-indigo-500 bg-gray-50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileName ? (
              <div>
                <p className="text-sm font-medium text-green-700">
                  ✓ Đã chọn file thành công:
                </p>
                <p className="text-xs text-gray-500 italic mt-1 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-indigo-600 mt-2 font-semibold">
                  Bấm lại để chọn file khác
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">
                  Bấm vào đây để chọn file Excel đã nhập liệu
                </p>
                <span className="mt-2 inline-block px-3 py-1 bg-white border text-xs font-semibold rounded shadow-sm text-gray-700">
                  Chọn File
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end space-x-3 border-t pt-3">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleSubmitImport}
            disabled={importData.length === 0}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              importData.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                : "bg-indigo-600 opacity-40 cursor-not-allowed"
            }`}
          >
            Xác nhận Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImportExcel;
