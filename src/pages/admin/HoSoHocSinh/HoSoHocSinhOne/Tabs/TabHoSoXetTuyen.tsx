import { ClipboardList } from "lucide-react";
import { useHoSoHocSinhOneContext } from "../HoSoHocSinhOneProvider";

const conductMap = {
  TOT: "Tốt",
  KHA: "Khá",
  TB: "Trung bình",
  YEU: "Yếu",
} as const;

const TabHoSoXetTuyen = () => {
  const { isEditMode, formData, setFormData, isLoadingAdmissionProfile } =
    useHoSoHocSinhOneContext();

  if (isLoadingAdmissionProfile) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center py-12 text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-2"></div>
        Đang tải dữ liệu hồ sơ xét tuyển...
      </div>
    );
  }

  const handleProfileChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      admissionProfile: {
        ...(prev.admissionProfile || {}),
        [field]: value,
      },
    }));
  };

  const grades = [6, 7, 8, 9] as const;
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
        <ClipboardList className="h-5 w-5 text-blue-500" />
        Kết Quả Học Tập Học Bạ Cấp THCS (Admission Profile)
      </h2>

      {formData.admissionProfile || isEditMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {grades.map((grade) => {
            const gpaKey = `gpa${grade}`;
            const conductKey = `conduct${grade}`;

            const rawGpa =
              formData.admissionProfile?.[
                gpaKey as keyof NonNullable<typeof formData.admissionProfile>
              ];
            const rawConduct =
              formData.admissionProfile?.[
                conductKey as keyof NonNullable<
                  typeof formData.admissionProfile
                >
              ];

            return (
              <div
                key={grade}
                className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-4 shadow-inner"
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
                  Lớp {grade}
                </div>

                {/* Điểm TB GPA */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">
                    Điểm TB (GPA)
                  </label>
                  {isEditMode ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="0.0"
                      className={inputClass}
                      value={rawGpa ?? ""}
                      onChange={(e) =>
                        handleProfileChange(
                          gpaKey,
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-800">
                      {rawGpa !== undefined && rawGpa !== null ? rawGpa : "---"}
                    </div>
                  )}
                </div>

                {/* Hạnh kiểm */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">
                    Hạnh kiểm
                  </label>
                  {isEditMode ? (
                    <select
                      className={inputClass}
                      value={rawConduct || "TOT"}
                      onChange={(e) =>
                        handleProfileChange(conductKey, e.target.value)
                      }
                    >
                      {Object.entries(conductMap).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm font-bold text-gray-800">
                      {rawConduct
                        ? conductMap[rawConduct as keyof typeof conductMap]
                        : "---"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
          <ClipboardList className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          Chưa cập nhật dữ liệu điểm xét tuyển học bạ cấp THCS.
        </div>
      )}
    </div>
  );
};

export default TabHoSoXetTuyen;
