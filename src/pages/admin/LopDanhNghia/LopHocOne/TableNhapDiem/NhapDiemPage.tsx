import { useParams } from "react-router-dom";
import NhapDiem from "./NhapDiem";
import { useLopHocContext } from "../../LopHocProvider";
import { LoadingWrapper } from "../../../../../components/ui/LoadingWrapper";
import Breadcrumb from "../../../../../components/ui/Breadcrum";

const NhapDiemPage = () => {
  const { LopHocDetail, isLoadingLopHocDetail } = useLopHocContext();
  const { idClassSubject } = useParams<{ idClassSubject: string }>();
  const idNumber = idClassSubject ? Number(idClassSubject) : 0;

  if (isLoadingLopHocDetail) {
    return (
      <div className="w-full min-h-100 relative">
        <LoadingWrapper
          isLoading={true}
          message="Đang tải thông tin lớp học..."
        >
          <div className="w-full h-100 bg-slate-50/50 rounded-lg" />
        </LoadingWrapper>
      </div>
    );
  }

  if (!idNumber || !LopHocDetail) {
    return (
      <div className="p-4 text-sm font-medium text-red-500 bg-red-50 rounded-lg border border-red-100 max-w-2xl mt-4 mx-auto">
        ⚠️ Thiếu thông tin lớp học hoặc idClassSubject trong query params
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <Breadcrumb
        items={[
          {
            label: "Danh sách lớp học",
            link: "/admin/dao-tao/lop-hoc",
          },
          {
            label: `Lớp ${LopHocDetail?.className}`,
            link: `/admin/dao-tao/lop-hoc/${LopHocDetail?.id}`,
          },
          {
            label: "Nhập điểm",
          },
        ]}
        className="px-6 pt-6"
      />
      <NhapDiem classSubjectId={idNumber} lopHocDetail={LopHocDetail} />
    </div>
  );
};

export default NhapDiemPage;
