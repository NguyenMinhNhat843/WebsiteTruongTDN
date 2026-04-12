import { createContextProvider } from "../../../util/createContextProvider";

export const [NguonTuyenSInhProvider, useNguonTuyenSinhContext] =
  createContextProvider(() => {
    // Dữ liệu mẫu cho các hệ đào tạo
    const trainingSystemData = [
      {
        name: "Trung cấp nghề",
        students: 450,
        growth: "+12%",
        // Gradient Xanh dương
        cardClass:
          "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500",
        iconBox: "bg-white/20",
        iconColor: "text-white",
      },
      {
        name: "Sơ cấp nghề",
        students: 320,
        growth: "+8%",
        // Gradient Xanh lá/Emerald
        cardClass:
          "bg-gradient-to-br from-green-500 to-emerald-600 border-emerald-400",
        iconBox: "bg-white/20",
        iconColor: "text-white",
      },
      {
        name: "Đại học liên kết",
        students: 180,
        growth: "+15%",
        // Gradient Tím/Indigo
        cardClass:
          "bg-gradient-to-br from-violet-600 to-indigo-700 border-violet-500",
        iconBox: "bg-white/20",
        iconColor: "text-white",
      },
      {
        name: "Hệ 9+",
        students: 250,
        growth: "+10%",
        // Gradient Cam/Vàng đậm
        cardClass:
          "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400",
        iconBox: "bg-white/20",
        iconColor: "text-white",
      },
    ];

    // Dữ liệu nguồn tuyển sinh
    const enrollmentSourceData = [
      { source: "THPT", tcn: 180, scn: 120, dhlk: 100, he9: 0 },
      { source: "THCS", tcn: 150, scn: 200, dhlk: 0, he9: 250 },
      { source: "Đã tốt nghiệp THPT", tcn: 80, scn: 0, dhlk: 80, he9: 0 },
      { source: "Học viên làm việc", tcn: 40, scn: 0, dhlk: 0, he9: 0 },
    ];

    const totalStudents = trainingSystemData.reduce(
      (sum, item) => sum + item.students,
      0,
    );

    return {
      trainingSystemData,
      enrollmentSourceData,
      totalStudents,
    };
  });
