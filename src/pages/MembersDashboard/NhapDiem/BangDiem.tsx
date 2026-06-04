import { useSearchParams } from "react-router-dom";
import NhapDiem from "../../admin/LopDanhNghia/LopHocOne/TableNhapDiem/NhapDiem";
import { $api } from "../../../api/client";

const BangDiem = () => {
  const [searchParams] = useSearchParams();
  const classSubjectId = searchParams.get("classSubjectId");
  const classSubjectIdNumber = classSubjectId
    ? Number(classSubjectId)
    : undefined;

  const classId = searchParams.get("classId");
  const classIdNumber = classId ? Number(classId) : undefined;
  console.log(
    "classSubjectIdNumber: ",
    classSubjectIdNumber,
    "classIdNumber: ",
    classIdNumber,
  );

  const { data: LopHocDetail, isLoading: isLoadingLopHocDetail } =
    $api.useQuery(
      "get",
      `/classes/{id}`,
      {
        params: {
          path: {
            id: classIdNumber!,
          },
        },
      },
      {
        enabled: !!classIdNumber,
      },
    );

  // 1. TRẠNG THÁI LOADING: Hiển thị khi API đang tải (hoặc chưa có cả ID để chạy API)
  if (isLoadingLopHocDetail) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div>Đang tải dữ liệu lớp học...</div>
      </div>
    );
  }
  console.log("sadlkjasd: ", classSubjectIdNumber, LopHocDetail);

  // 2. TRẠNG THÁI LỖI: Sau khi hết loading mà vẫn thiếu thông tin quan trọng trên URL hoặc API thất bại
  if (!classSubjectIdNumber || !LopHocDetail) {
    return (
      <div className="p-4 text-red-500 font-medium">
        Không tìm thấy thông tin lớp học hoặc URL không hợp lệ.
      </div>
    );
  }

  // 3. TRẠNG THÁI THÀNH CÔNG: Đã có đủ dữ liệu sạch, tự tin truyền vào component con
  return (
    <div>
      <NhapDiem
        classSubjectId={classSubjectIdNumber}
        lopHocDetail={LopHocDetail}
      />
    </div>
  );
};

export default BangDiem;
