import { useParams } from "react-router-dom";
import NhapDiem from "./NhapDiem";
import { useLopHocContext } from "../../LopHocProvider";

const NhapDiemPage = () => {
  const { LopHocDetail } = useLopHocContext();
  const { idClassSubject } = useParams<{ idClassSubject: string }>();
  const idNumber = idClassSubject ? Number(idClassSubject) : 0;

  if (!idNumber || !LopHocDetail) {
    return (
      <div>Thiếu thông tin lớp học hoặc idClassSubject trong query params</div>
    );
  }
  return (
    <div>
      <NhapDiem classSubjectId={idNumber} lopHocDetail={LopHocDetail} />
    </div>
  );
};

export default NhapDiemPage;
