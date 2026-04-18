import { useParams } from "react-router-dom";
import { createContextProvider } from "../../../../util/createContextProvider";
import { applicationsData } from "../mockData";

export const [HoSoTuyenSinhOneProvider, useHoSoTuyenSinhOneContext] =
  createContextProvider(() => {
    const { id } = useParams<{ id: string }>();

    // Lấy dữ liệu hồ sơ dựa trên id từ params (giả sử có hàm getApplicationById)
    const applicant = applicationsData.find((app) => app.id === id) || null;

    return {
      applicant,
    };
  });
