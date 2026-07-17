import { useParams, useSearchParams } from "react-router-dom";
import NhapDiem from "../../admin/LopDanhNghia/LopHocOne/TableNhapDiem/NhapDiemTable";
import { $api } from "../../../api/client";
import Breadcrumb from "../../../components/ui/Breadcrum";

const BangDiem = () => {
  const { idLopHoc, idClassSubject } = useParams();
  const [searchParams] = useSearchParams();

  const classSubjectId = idClassSubject || searchParams.get("classSubjectId");
  const classSubjectIdNumber = classSubjectId
    ? Number(classSubjectId)
    : undefined;

  const classId = idLopHoc || searchParams.get("classId");
  const classIdNumber = classId ? Number(classId) : undefined;

  const { data: lopHocDetail, isLoading: isLoadingLopHocDetail } =
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

  // 2. TRẠNG THÁI LỖI: Sau khi hết loading mà vẫn thiếu thông tin quan trọng trên URL hoặc API thất bại
  if (!classSubjectIdNumber || !lopHocDetail) {
    return (
      <div className="p-4 text-red-500 font-medium">
        Không tìm thấy thông tin lớp học hoặc URL không hợp lệ.
      </div>
    );
  }

  // 3. TRẠNG THÁI THÀNH CÔNG: Đã có đủ dữ liệu sạch, tự tin truyền vào component con
  return (
    <div>
      <div className="my-3 ms-6">
        <Breadcrumb
          items={[
            {
              label: "Các lớp học",
              link: "/teacher/lop-hoc",
            },
            {
              label: `Lớp ${lopHocDetail?.className || ""}`,
              link: `/teacher/lop-hoc/${lopHocDetail?.id}`,
            },
            { label: "Nhập điểm" },
          ]}
        />
      </div>
      <NhapDiem
        classSubjectId={classSubjectIdNumber}
        lopHocDetail={lopHocDetail}
      />
    </div>
  );
};

export default BangDiem;
