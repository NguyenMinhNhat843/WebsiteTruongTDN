import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import ChuongTrinhKhungOne from "../../admin/ChuongTrinhKhung/ChuongTrinhKhungOne/ChuongTrinhKhungOne";

const StudentChuongTrinhKhung = () => {
  const { currentUser } = useAppContext();
  console.log("currentUser", currentUser);
  const {
    data: curriculum,
    isLoading: isCurriculumLoading,
    error: curriculumError,
  } = $api.useQuery("get", "/curriculums/first", {
    params: {
      query: {
        batchId: currentUser?.profile?.batchId || "",
      },
    },
  });

  // 1. Xử lý trạng thái đang tải dữ liệu
  if (isCurriculumLoading) {
    return (
      <div className="p-4 text-center">Đang tải chương trình khung...</div>
    );
  }

  // 2. Xử lý trạng thái lỗi hoặc không tìm thấy dữ liệu phù hợp với học sinh này
  if (curriculumError || !curriculum) {
    return (
      <div className="p-4 text-center text-red-500">
        Không tìm thấy chương trình khung phù hợp cho khóa học của bạn.
      </div>
    );
  }

  console.log("curriculum", curriculum);

  return (
    <div>
      <ChuongTrinhKhungOne data={curriculum} />
    </div>
  );
};

export default StudentChuongTrinhKhung;
