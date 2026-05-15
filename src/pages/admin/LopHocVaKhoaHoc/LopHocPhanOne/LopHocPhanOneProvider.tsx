import { useParams } from "react-router-dom";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";

export const [LopHocPhanOneProvider, useLopHocPhanOneContext] =
  createContextProvider(() => {
    const { id } = useParams();
    console.log(id);
    const lopHocPhanId = Number(id);
    // Get chi tiết lớp học phần
    const { data: lopHocPhanDetail, isLoading: isLoadingLopHocPhanDetail } =
      $api.useQuery(
        "get",
        "/course-offers/{id}",
        {
          params: {
            path: {
              id: lopHocPhanId!, // Lấy ID của lớp học phần đầu tiên làm ví dụ
            },
          },
        },
        {
          enabled: !!lopHocPhanId, // Chỉ chạy query khi có ID lớp học phần được chọn
        },
      );

    return {
      lopHocPhanDetail,
      isLoadingLopHocPhanDetail,
      lopHocPhanId,
    };
  });
