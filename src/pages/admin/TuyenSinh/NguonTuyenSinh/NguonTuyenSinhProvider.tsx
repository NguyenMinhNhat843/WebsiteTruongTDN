import { createContextProvider } from "../../../../util/createContextProvider";

export const [NguonTuyenSInhProvider, useNguonTuyenSinhContext] =
  createContextProvider(() => {
    // Dữ liệu mẫu cho các hệ đào tạo
    const trainingSystemData = [
      {
        name: "Trung cấp nghề",
        students: 450,
        color: "#3b82f6",
        growth: "+12%",
      },
      { name: "Sơ cấp nghề", students: 320, color: "#10b981", growth: "+8%" },
      {
        name: "Đại học liên kết",
        students: 180,
        color: "#8b5cf6",
        growth: "+15%",
      },
      { name: "Hệ 9+", students: 250, color: "#f59e0b", growth: "+10%" },
    ];

    // Dữ liệu nguồn tuyển sinh
    const enrollmentSourceData = [
      { source: "THPT", tcn: 180, scn: 120, dhlk: 100, he9: 0 },
      { source: "THCS", tcn: 150, scn: 200, dhlk: 0, he9: 250 },
      { source: "Đã tốt nghiệp THPT", tcn: 80, scn: 0, dhlk: 80, he9: 0 },
      { source: "Học viên làm việc", tcn: 40, scn: 0, dhlk: 0, he9: 0 },
    ];

    return {
      trainingSystemData,
      enrollmentSourceData,
    };
  });
