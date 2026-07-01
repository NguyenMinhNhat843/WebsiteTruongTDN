import { ClipboardList } from "lucide-react";
import InfoItemVertical from "../../components/InffoItemVertical";
import { useHocSinhContext } from "../../HocSinhProvider";
import { useHoSoHocSinhOneContext } from "../HoSoHocSinhOneProvider";

// Object map chuyển đổi hạnh kiểm sang tiếng Việt
const conductMap = {
  TOT: "Tốt",
  KHA: "Khá",
  TB: "Trung bình",
  YEU: "Yếu",
} as const;

const TabHoSoXetTuyen = () => {
  const { studentDetail } = useHocSinhContext();
  const { admissionProfile, isLoadingAdmissionProfile } =
    useHoSoHocSinhOneContext();

  if (!studentDetail) return null;

  if (isLoadingAdmissionProfile) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center py-12 text-gray-400">
        Đang tải dữ liệu hồ sơ xét tuyển...
      </div>
    );
  }

  const grades = [6, 7, 8, 9] as const;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
        <ClipboardList className="h-5 w-5 text-blue-500" />
        Kết Quả Học Tập Học Bạ Cấp THCS (Admission Profile)
      </h2>

      {admissionProfile ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {grades.map((grade) => {
            const gpaKey = `gpa${grade}` as const;
            const conductKey = `conduct${grade}` as const;

            // Lấy giá trị hạnh kiểm gốc (TOT, KHA,...)
            const rawConduct = admissionProfile[conductKey];

            return (
              <div
                key={grade}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3"
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
                  Lớp {grade}
                </div>
                <InfoItemVertical
                  label="Điểm TB (GPA)"
                  value={admissionProfile[gpaKey]}
                />
                <InfoItemVertical
                  label="Hạnh kiểm"
                  // Kiểm tra nếu có giá trị thì map sang tiếng Việt, ngược lại hiển thị "-" hoặc rỗng
                  value={rawConduct ? conductMap[rawConduct] : "-"}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-slate-50 rounded-xl border border-dashed">
          Chưa cập nhật dữ liệu điểm xét tuyển học bạ cấp THCS.
        </div>
      )}
    </div>
  );
};

export default TabHoSoXetTuyen;
