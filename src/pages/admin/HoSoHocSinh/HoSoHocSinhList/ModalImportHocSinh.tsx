import { useState } from "react";
import * as XLSX from "xlsx";
import {
  useHocSinhContext,
  type createStudentDto,
  type StatusHocSinhEnum,
} from "../HocSinhProvider";
import { useAppContext } from "../../../../AppProvider";

interface ImportStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportStudentModal = ({ isOpen, onClose }: ImportStudentModalProps) => {
  const {
    createManyStudents,
    isCreatingManyStudents,
    searchBatches,
    khoaHocList,
  } = useHocSinhContext();
  const [excelData, setExcelData] = useState<createStudentDto[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<number | string>("");
  const [selectedBatch, setSelectedBatch] = useState<number | string>("");
  const [error, setError] = useState("");
  const { majors } = useAppContext();

  // Map dữ liệu options ngành
  const MajorOptions = majors?.map((major) => ({
    label: major.majorName,
    value: major.id,
  }));
  const KhoaHocOptions = khoaHocList?.map((khoa) => ({
    label: khoa.batchCode,
    value: khoa.id,
  }));
  console.log("Danh sách khóa học sau khi chọn ngành:", KhoaHocOptions);

  const TEMPLATE_FILE_URL = "/FileTemplates/dsHocSinhTHUD.xlsx";

  if (!isOpen) return null;

  const formatExcelDate = (dateVal: any): string | null => {
    if (!dateVal) return null;

    if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
      const year = dateVal.getFullYear();
      const month = String(dateVal.getMonth() + 1).padStart(2, "0");
      const day = String(dateVal.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}T00:00:00.000Z`;
    }

    if (typeof dateVal === "string" && dateVal.trim() !== "") {
      const parsedDate = new Date(dateVal);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}T00:00:00.000Z`;
      }
    }

    return null;
  };

  const formatStudentData = (row: any): createStudentDto => {
    return {
      enrollmentDate: formatExcelDate(row["Ngày nhập học"]),
      graduationDate: formatExcelDate(row["Ngày tốt nghiệp dự kiến"]),
      fullName: String(row["Họ và tên hs"] || "").trim(),
      email: row["Email"] ? String(row["Email"]).trim() : null,
      gender:
        row["Giới tính"] !== undefined
          ? String(row["Giới tính"]).toLowerCase() === "nam" ||
            row["Giới tính"] === true
          : null,
      dob: formatExcelDate(row["Ngày sinh"]),
      phone: row["Sđt HS"] ? String(row["Sđt HS"]).trim() : null,
      address: row["Hộ khẩu thường trú"]
        ? String(row["Hộ khẩu thường trú"]).trim()
        : null,
      identityNumber: row["CCCD HS "] ? String(row["CCCD HS "]).trim() : null,

      fatherName: row["Họ và tên cha"]
        ? String(row["Họ và tên cha"]).trim()
        : null,
      fatherPhone: row["Sđt cha"] ? String(row["Sđt cha"]).trim() : null,
      fatherCCCD: row["CCCD cha"] ? String(row["CCCD cha"]).trim() : null,
      fatherYearOfBirth: row["Năm sinh cha"]
        ? Number(row["Năm sinh cha"])
        : null,
      fatherJob: row["Nghề nghiệp cha"]
        ? String(row["Nghề nghiệp cha"]).trim()
        : null,

      motherName: row["Họ và tên mẹ"]
        ? String(row["Họ và tên mẹ"]).trim()
        : null,
      motherPhone: row["Sđt mẹ"] ? String(row["Sđt mẹ"]).trim() : null,
      motherCCCD: row["CCCD mẹ"] ? String(row["CCCD mẹ"]).trim() : null,
      motherYearOfBirth: row["Năm sinh mẹ"] ? Number(row["Năm sinh mẹ"]) : null,
      motherJob: row["Nghề nghiệp mẹ"]
        ? String(row["Nghề nghiệp mẹ"]).trim()
        : null,

      guardianName: row["Người giám hộ"]
        ? String(row["Người giám hộ"]).trim()
        : null,
      guardianPhone: row["Sđt người giám hộ"]
        ? String(row["Sđt người giám hộ"]).trim()
        : null,

      batchId: selectedBatch ? Number(selectedBatch) : null,
      status: row["Trạng thái"]
        ? (String(row["Trạng thái"]).trim() as StatusHocSinhEnum)
        : ("studying" as StatusHocSinhEnum),
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);

        if (rawJson.length === 0) {
          setError("File excel không có dữ liệu!");
          return;
        }

        const formattedData = rawJson.map((row) => formatStudentData(row));

        const invalidRows = formattedData.filter(
          (student) => !student.fullName,
        );
        if (invalidRows.length > 0) {
          setError('Có bản ghi thiếu "Họ và tên". Vui lòng kiểm tra lại!');
          return;
        }

        setExcelData(formattedData);
      } catch (err) {
        setError(
          "Đọc file thất bại, vui lòng kiểm tra lại định dạng file Excel.",
        );
        console.error("Chi tiết lỗi Excel:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = () => {
    if (!selectedMajor) {
      setError("Vui lòng chọn ngành học trước khi import.");
      return;
    }

    if (excelData.length === 0) {
      setError("Vui lòng chọn file hợp lệ trước khi Import.");
      return;
    }

    // Cập nhật lại batchId chính xác cho tập dữ liệu trước khi gửi đi phòng trường hợp user chọn khóa sau khi up file
    const finalData = excelData.map((student) => ({
      ...student,
      batchId: selectedBatch ? Number(selectedBatch) : null,
    }));

    createManyStudents(
      {
        body: finalData,
      },
      {
        onSuccess: (res: any) => {
          alert(
            res?.message
              ? res?.message
              : `Import thành công ${finalData.length} học sinh!`,
          );
          setExcelData([]);
          setSelectedMajor("");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Import Danh Sách Học Sinh
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Hệ thống hỗ trợ thêm học sinh hàng loạt bằng tệp dữ liệu Excel
          </p>
        </div>
        <hr className="border-gray-200" />

        {/* BƯỚC 1: TẢI FILE MẪU */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              1
            </span>
            Tải tệp mẫu
          </label>
          <p className="text-xs text-gray-500 pl-6.5">
            Tải file excel mẫu về để điền thông tin đúng định dạng cấu trúc hệ
            thống.
          </p>
          <div className="pl-6.5 mt-1">
            <a
              href={TEMPLATE_FILE_URL}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors border border-indigo-100 shadow-sm"
            >
              📥 Tải File Excel Mẫu Tại Đây
            </a>
          </div>
        </div>

        {/* BƯỚC 2: CHỌN NGÀNH HỌC */}
        <div className="flex flex-col gap-2 mt-1">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              2
            </span>
            Chọn ngành học
          </label>
          <p className="text-xs text-gray-500 pl-6.5">
            Sinh viên trong file Excel chuẩn bị Import thuộc ngành nào dưới đây?
          </p>

          <div className="pl-6.5 mt-1 flex flex-col gap-2">
            <select
              value={selectedMajor}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMajor(val);
                if (error === "Vui lòng chọn ngành học trước khi import.")
                  setError("");
                searchBatches({
                  params: {
                    query: {
                      majorId: val ? Number(val) : undefined,
                    },
                  },
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
            >
              <option value="">-- Chọn ngành học --</option>
              {MajorOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                if (error === "Vui lòng chọn ngành học trước khi import.")
                  setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
            >
              <option value="">-- Chọn khóa đào tạo --</option>
              {KhoaHocOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Khối cảnh báo nghiệp vụ chỉ import 1 ngành */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 items-start text-amber-800">
              <span className="text-base leading-none mt-0.5">⚠️</span>
              <p className="text-xs font-medium leading-relaxed">
                <strong className="text-amber-900">Lưu ý quan trọng:</strong>{" "}
                Mỗi đợt import chỉ áp dụng cho sinh viên thuộc{" "}
                <span className="underline decoration-2 font-bold text-amber-900">
                  duy nhất 1 ngành
                </span>{" "}
                đã chọn ở trên. Vui lòng tách file nếu danh sách có nhiều ngành
                khác nhau.
              </p>
            </div>
          </div>
        </div>

        {/* BƯỚC 3: CHỌN FILE EXCEL */}
        <div className="flex flex-col gap-2 mt-1">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              3
            </span>
            Tải tệp dữ liệu lên
          </label>
          <p className="text-xs text-gray-500 pl-6.5">
            Chọn file dữ liệu Excel chứa thông tin danh sách học sinh cần
            import.
          </p>
          <div className="pl-6.5 mt-1">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* THÔNG BÁO LỖI HỆ THỐNG */}
        {error && (
          <div className="mx-1 mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2 animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* THÔNG BÁO THÀNH CÔNG TẠM THỜI */}
        {excelData.length > 0 && !error && (
          <div className="mx-1 mt-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium flex items-center gap-2">
            <span>✅</span> Đọc thành công{" "}
            <strong className="text-green-950 font-bold">
              {excelData.length}
            </strong>{" "}
            học sinh từ tệp! Đã sẵn sàng tiến hành import.
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isCreatingManyStudents}
            className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              excelData.length === 0 ||
              !selectedMajor ||
              !!error ||
              isCreatingManyStudents
            }
            className={`px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md shadow-green-600/10 transition-all flex items-center gap-1.5 ${
              excelData.length === 0 ||
              !selectedMajor ||
              !!error ||
              isCreatingManyStudents
                ? "opacity-50 cursor-not-allowed hover:bg-green-600 shadow-none"
                : "cursor-pointer"
            }`}
          >
            {isCreatingManyStudents ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </>
            ) : (
              `Xác nhận Import (${excelData.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentModal;
